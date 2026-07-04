const bcrypt = require("bcrypt");
const prisma = require("./lib/prisma");

async function main() {
  const hashedPassword = await bcrypt.hash("blog@admin", 10);

  await prisma.user.upsert({
    where: {
      email: "blogadmin@example.com",
    },
    update: {},
    create: {
      name: "Azlan",
      email: "blogadmin@example.com",
      passwordHash: hashedPassword,
    },
  });

  console.log("✅ Admin user created");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });