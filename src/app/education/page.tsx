import CategoryNewsPage from "../../components/sections/category-news-page";

export const metadata = {
  title: "শিক্ষা | দৈনিক দিনলিপি",
  description: "শিক্ষা, পরীক্ষা, ভর্তি ও শিক্ষাপ্রতিষ্ঠানের সর্বশেষ সংবাদ।",
};

export default function EducationPage() {
  return (
    <CategoryNewsPage
      slug="education"
      title="শিক্ষা"
      subtitle="শিক্ষা ব্যবস্থা, পরীক্ষা, ভর্তি, ফলাফল ও শিক্ষাঙ্গনের গুরুত্বপূর্ণ খবর।"
    />
  );
}