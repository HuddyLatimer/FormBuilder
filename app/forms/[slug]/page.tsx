import prisma from '@/lib/prisma'
import { PublicForm } from '@/components/form-renderer/PublicForm'
import { notFound } from 'next/navigation'

export default async function PublicFormPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const form = await prisma.form.findUnique({
        where: { urlSlug: slug },
        include: { fields: true }
    })

    if (!form || !form.published) {
        notFound()
    }

    return <PublicForm form={form} />
}
