import { getFormById } from '@/actions/form'
import { FormBuilder } from '@/components/form-builder/index'
import { notFound } from 'next/navigation'

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const form = await getFormById(id)

    if (!form) {
        notFound()
    }

    return (
        <FormBuilder form={form} />
    )
}
