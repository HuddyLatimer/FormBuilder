'use server'

import prisma from '@/lib/prisma'

export async function submitForm(formId: string, formData: FormData) {
    const form = await prisma.form.findUnique({
        where: { id: formId },
        include: { fields: true }
    })

    if (!form || !form.published) {
        return { error: 'Form not found or not active' }
    }

    const values: { fieldId: string; value: string }[] = []
    const errors: Record<string, string> = {}

    for (const field of form.fields) {
        const val = formData.get(field.id) as string

        if (field.required && (!val || val.trim() === '')) {
            errors[field.id] = `${field.label} is required`
            continue
        }

        if (val && field.type === 'email' && !val.includes('@')) {
            errors[field.id] = 'Invalid email'
        }

        if (val) {
            values.push({
                fieldId: field.id,
                value: val
            })
        }
    }

    if (Object.keys(errors).length > 0) {
        return { errors }
    }

    await prisma.submission.create({
        data: {
            formId,
            values: {
                create: values
            }
        }
    })

    return { success: true }
}
