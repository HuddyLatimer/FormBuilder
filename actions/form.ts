'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const formSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
})

export async function createForm(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string

    const parsed = formSchema.safeParse({ title, description })
    if (!parsed.success) {
        return { error: 'Title is required' }
    }

    const form = await prisma.form.create({
        data: {
            userId: user.id,
            title: parsed.data.title,
            description: parsed.data.description,
        },
    })

    redirect(`/builder/${form.id}`)
}

export async function getForms() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { forms: [], error: null }

        // Only show forms belonging to the user
        const forms = await prisma.form.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { submissions: true }
                }
            }
        })
        return { forms, error: null }
    } catch (error: any) {
        console.error('Error fetching forms:', error)
        return { forms: [], error: error.message || 'Failed to connect to system database' }
    }
}

export async function getFormById(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Users can only access their own forms in the builder
    return await prisma.form.findUnique({
        where: { id, userId: user.id },
        include: {
            fields: {
                orderBy: { order: 'asc' }
            },
            submissions: {
                orderBy: { createdAt: 'desc' },
                include: {
                    values: true
                }
            }
        }
    })
}

export async function updateFormContent(id: string, jsonContent: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Ensure user owns the form
    const formRecord = await prisma.form.findUnique({
        where: { id, userId: user.id }
    })

    if (!formRecord) throw new Error('Form not found or unauthorized')

    const fields = JSON.parse(jsonContent)

    return await prisma.$transaction(async (tx: any) => {
        const currentFields = await tx.formField.findMany({ where: { formId: id }, select: { id: true } })
        const currentIds = currentFields.map((f: any) => f.id)

        const incomingIds = fields.filter((f: any) => f.id && !f.id.startsWith('temp-')).map((f: any) => f.id)

        const toDelete = currentIds.filter((cid: string) => !incomingIds.includes(cid))
        if (toDelete.length > 0) {
            await tx.formField.deleteMany({ where: { id: { in: toDelete } } })
        }

        for (const field of fields) {
            const { id: fieldId, type, label, placeholder, required, options, order } = field

            if (fieldId && !fieldId.startsWith('temp-')) {
                await tx.formField.update({
                    where: { id: fieldId },
                    data: { label, placeholder, required, options, order, type }
                })
            } else {
                await tx.formField.create({
                    data: { formId: id, type, label, placeholder, required, options, order }
                })
            }
        }

        await tx.form.update({ where: { id }, data: { updatedAt: new Date() } })
    })
}

export async function publishForm(id: string, published: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    await prisma.form.update({
        where: { id },
        data: { published }
    })

    revalidatePath(`/builder/${id}`)
    revalidatePath('/dashboard')
}

export async function deleteForm(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Ensure user owns the form
    const formRecord = await prisma.form.findUnique({
        where: { id, userId: user.id }
    })

    if (!formRecord) throw new Error('Form not found or unauthorized')

    await prisma.form.delete({
        where: { id }
    })

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
