import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

console.log('Client created with adapter')

main()
async function main() {
    try {
        await prisma.$connect()
        console.log('Connected')
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}
