import { PrismaClient } from "../src/generated/prisma/client";
import "dotenv/config";
const prisma = new PrismaClient();

const categories = [
  { name: "প্রচ্ছদ", slug: "home", description: "ওয়েবসাইটের প্রচ্ছদ ও প্রধান সংবাদ", sortOrder: 0 },
  { name: "জাতীয়", slug: "national", description: "বাংলাদেশের জাতীয় সংবাদ", sortOrder: 1 },
  { name: "রাজনীতি", slug: "politics", description: "বাংলাদেশের রাজনীতি ও রাজনৈতিক সংবাদ", sortOrder: 2 },
  { name: "আন্তর্জাতিক", slug: "international", description: "বিশ্বের গুরুত্বপূর্ণ সংবাদ", sortOrder: 3 },
  { name: "অর্থনীতি", slug: "economy", description: "অর্থনীতি, ব্যবসা-বাণিজ্য ও আর্থিক সংবাদ", sortOrder: 4 },
  { name: "খেলাধুলা", slug: "sports", description: "দেশ-বিদেশের খেলাধুলার সংবাদ", sortOrder: 5 },
  { name: "বিনোদন", slug: "entertainment", description: "বিনোদন, চলচ্চিত্র, সংগীত ও সংস্কৃতি", sortOrder: 6 },
  { name: "প্রযুক্তি", slug: "technology", description: "প্রযুক্তি, বিজ্ঞান ও উদ্ভাবনের সংবাদ", sortOrder: 7 },
  { name: "শিক্ষা", slug: "education", description: "শিক্ষা, পরীক্ষা ও শিক্ষাপ্রতিষ্ঠান সম্পর্কিত সংবাদ", sortOrder: 8 },
  { name: "স্বাস্থ্য", slug: "health", description: "স্বাস্থ্য, চিকিৎসা ও জনস্বাস্থ্য বিষয়ক সংবাদ", sortOrder: 9 },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        isActive: true,
        sortOrder: category.sortOrder,
      },
      create: {
        ...category,
        isActive: true,
      },
    });

    console.log(`সফল: ${category.name}`);
  }

  console.log("\n১০টি Navigation Category Database-এ যুক্ত/আপডেট হয়েছে।");
}

main()
  .catch((error) => {
    console.error("Category seed করতে সমস্যা হয়েছে:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
