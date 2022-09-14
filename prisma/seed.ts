import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const DEFAULT_SEED_COUNT = 30;
const args = process.argv.slice(2);
const prisma = new PrismaClient();

const doctorQualifications = ["MBBS", "BDMS"];
const seedCount = parseInt(args[1]) || DEFAULT_SEED_COUNT;

async function addDoctor() {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const dateOfBirth = faker.date.birthdate({ min: 25, max: 80, mode: "age" }).toLocaleDateString();
  const username = faker.internet.userName(firstName, lastName);
  const password = faker.internet.password();
  const contact = faker.phone.number("+91##########");
  const email = faker.internet.email(firstName, lastName);

  const experience = `${faker.random.numeric(1)} Years`;
  const qualifications = "MBBS";
  const specialization = "None";

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      dateOfBirth,
      username,
      password,
      contact,
      email,
      role: "doctor",
      doctor: { create: { experience, qualifications, specialization } },
    },
  });
}

(async function main() {
  for (const _ of Array.from({ length: seedCount }).keys()) await addDoctor();
})();
