import CategoryNewsPage from "../../components/sections/category-news-page";

export const metadata = {
  title: "খেলাধুলা | দৈনিক দিনলিপি",
  description: "ক্রিকেট, ফুটবলসহ সব খেলার সর্বশেষ সংবাদ।",
};

export default function SportsPage() {
  return (
    <CategoryNewsPage
      slug="sports"
      title="খেলাধুলা"
      subtitle="ক্রিকেট, ফুটবল, আন্তর্জাতিক টুর্নামেন্ট ও সব ধরনের খেলার খবর।"
    />
  );
}