import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Seeding database...')

    // Apply RLS policies
    try {
        const sqlPath = path.join(process.cwd(), 'supabase', 'schema.sql')
        if (fs.existsSync(sqlPath)) {
            console.log('Applying Supabase SQL schema...')
            const sql = fs.readFileSync(sqlPath, 'utf8')
            await prisma.$executeRawUnsafe(sql)
            console.log('Applied SQL schema.')
        }
    } catch (e) {
        console.warn('Could not apply SQL schema automatically:', e)
    }

    // Create a demo accessible form
    // We use a fixed UUID for the user ID to simulate an admin/owner
    // In a real scenario, this ID should match a real Supabase User ID
    const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000'

    // Create Profile for demo user
    await prisma.profile.upsert({
        where: { id: DEMO_USER_ID },
        update: {},
        create: {
            id: DEMO_USER_ID,
            role: 'admin',
            email: 'admin@example.com',
        },
    })

    // Create a Contact Form
    const contactForm = await prisma.form.create({
        data: {
            userId: DEMO_USER_ID,
            title: 'Contact Us',
            description: 'We would love to hear from you!',
            published: true,
            urlSlug: 'contact-us-demo',
            fields: {
                create: [
                    {
                        type: 'text',
                        label: 'Full Name',
                        placeholder: 'John Doe',
                        required: true,
                        order: 0,
                    },
                    {
                        type: 'email',
                        label: 'Email Address',
                        placeholder: 'john@example.com',
                        required: true,
                        order: 1,
                    },
                    {
                        type: 'textarea',
                        label: 'Message',
                        placeholder: 'How can we help?',
                        required: true,
                        order: 2,
                    },
                ],
            },
            submissions: {
                create: [
                    {
                        values: {
                            create: [
                                // We need to fetch field IDs, but in a single create it's tricky to map.
                                // So we'll seed submissions separately after fields are created if we need exact mapping.
                                // For simplicity, we just create the form structure here.
                            ],
                        },
                    },
                ],
            },
        },
    })

    // Add dummy submissions to the contact form
    // We need to fetch the fields
    const fields = await prisma.formField.findMany({
        where: { formId: contactForm.id },
    })

    const nameField = fields.find((f) => f.label === 'Full Name')
    const emailField = fields.find((f) => f.label === 'Email Address')
    const msgField = fields.find((f) => f.label === 'Message')

    if (nameField && emailField && msgField) {
        await prisma.submission.create({
            data: {
                formId: contactForm.id,
                values: {
                    create: [
                        { fieldId: nameField.id, value: 'Alice Smith' },
                        { fieldId: emailField.id, value: 'alice@example.com' },
                        { fieldId: msgField.id, value: 'Hello, I am interested in your services.' },
                    ],
                },
            },
        })

        await prisma.submission.create({
            data: {
                formId: contactForm.id,
                values: {
                    create: [
                        { fieldId: nameField.id, value: 'Bob Jones' },
                        { fieldId: emailField.id, value: 'bob@test.com' },
                        { fieldId: msgField.id, value: 'Reporting a bug.' },
                    ],
                },
            },
        })
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
