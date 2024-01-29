import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function register_controller() {
    const user = await prisma.user.create({
        data: {
          name: 'Alice',
          email: 'alice@prisma.io',
        },
      })
      console.log(user)
}

register_controller()
.then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })