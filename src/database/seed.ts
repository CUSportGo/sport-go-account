import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  // create a dummy user
  const user01 = await prisma.user.upsert({
    where: {
      id: '00000000-0000-0000-0000-000000000000',
    },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000000',
      firstName: 'John',
      lastName: 'Doe',
      email: 'JohnDoe@gmail.com',
      phoneNumber: '090-000-0000',
      password: '12345678',
      role: 'USER',
    },
  });

  console.log(user01);
};

main()
  .catch((e: any) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
