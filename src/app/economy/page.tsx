import CategoryNewsPage from "../../components/sections/category-news-page";

export const metadata = {
  title: "অর্থনীতি | দৈনিক দিনলিপি",
  description: "বাংলাদেশের অর্থনীতি, ব্যাংকিং, ব্যবসা ও বাণিজ্যের খবর।",
};

export default function EconomyPage() {
  return (
    <CategoryNewsPage
      slug="economy"
      title="অর্থনীতি"
      subtitle="ব্যাংক, শেয়ারবাজার, ব্যবসা-বাণিজ্য, বাজেট ও অর্থনীতির গুরুত্বপূর্ণ খবর।"
    />
  );
}