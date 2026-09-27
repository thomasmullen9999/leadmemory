import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@leadmemory.dev" },
    update: {},
    create: {
      name: "Alex Morgan",
      email: "admin@leadmemory.dev",
      passwordHash,
      role: "ADMIN",
    },
  });

  const rep = await prisma.user.upsert({
    where: { email: "rep@leadmemory.dev" },
    update: {},
    create: {
      name: "Jamie Chen",
      email: "rep@leadmemory.dev",
      passwordHash,
      role: "SALES_REP",
    },
  });

  const clientsData = [
    { name: "Priya Patel", company: "Northwind Retail", email: "priya@northwind.example", owner: rep },
    { name: "Tom Fletcher", company: "Fletcher & Co", email: "tom@fletcherco.example", owner: rep },
    { name: "Sara Wallace", company: "BrightPath Media", email: "sara@brightpath.example", owner: admin },
    { name: "Daniel Osei", company: "Osei Logistics", email: "daniel@oseilogistics.example", owner: admin },
  ];

  const stages = ["LEAD", "CONTACTED", "NEGOTIATING", "WON", "LOST"] as const;

  for (const c of clientsData) {
    const client = await prisma.client.create({
      data: {
        name: c.name,
        company: c.company,
        email: c.email,
        phone: "07" + Math.floor(100000000 + Math.random() * 899999999),
        ownerId: c.owner.id,
      },
    });

    const dealCount = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < dealCount; i++) {
      await prisma.deal.create({
        data: {
          clientId: client.id,
          title: `${c.company} - Contract ${i + 1}`,
          value: Math.floor(500 + Math.random() * 9500) * 100,
          stage: stages[Math.floor(Math.random() * stages.length)],
        },
      });
    }

    await prisma.note.create({
      data: {
        clientId: client.id,
        content: `Initial call went well with ${c.name}. Interested in learning more about pricing tiers.`,
      },
    });
  }

  console.log("Seed complete. Login with admin@leadmemory.dev or rep@leadmemory.dev, password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
