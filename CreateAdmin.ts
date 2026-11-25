
import "dotenv/config";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import { PrismaClient } from "./src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    console.log("\n================================");
    console.log("   DAILY DINLIPI ADMIN CREATOR");
    console.log("================================\n");

    const name = (await rl.question("Admin Name: ")).trim();
    const email = (await rl.question("Admin Email: ")).trim().toLowerCase();
    const password = await rl.question("Admin Password: ");

    if (!name || !email || !password) {
      throw new Error("সব তথ্য পূরণ করতে হবে।");
    }

    if (password.length < 8) {
      throw new Error("Password কমপক্ষে ৮ অক্ষরের হতে হবে।");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("সঠিক Email প্রদান করো।");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    if (existingUser) {
      const confirm = (
        await rl.question(
          "\nএই Email দিয়ে User আছে। তাকে SUPER_ADMIN করতে চাও? (yes/no): "
        )
      ).trim().toLowerCase();

      if (confirm !== "yes") {
        console.log("Operation cancelled.");
        return;
      }

      await prisma.user.update({
        where: { email },
        data: {
          name,
          password: hashedPassword,
          role: "SUPER_ADMIN",
          isActive: true,
        },
      });

      console.log("\nExisting User SUPER_ADMIN হয়েছে!");
    } else {
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "SUPER_ADMIN",
          isActive: true,
        },
      });

      console.log("\nSUPER_ADMIN Account তৈরি হয়েছে!");
    }

    console.log("\nLogin URL: http://localhost:3000/admin/login");
    console.log("Email:", email);
    console.log("Role: SUPER_ADMIN");
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("\nERROR:", error);
  process.exitCode = 1;
});
