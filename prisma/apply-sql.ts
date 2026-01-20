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
    console.log('Applying SQL schema...')
    try {
        const sqlPath = path.join(process.cwd(), 'supabase', 'schema.sql')
        if (fs.existsSync(sqlPath)) {
            const sql = fs.readFileSync(sqlPath, 'utf8')
            await prisma.$executeRawUnsafe(sql)
            console.log('Applied SQL schema successfully.')
        }
    } catch (e) {
        console.error('Failed to apply SQL schema:', e)
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect()
    })
