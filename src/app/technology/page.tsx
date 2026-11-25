import CategoryNewsPage from "../../components/sections/category-news-page";

export const metadata = {
  title: "প্রযুক্তি | দৈনিক দিনলিপি",
  description: "প্রযুক্তি, বিজ্ঞান, AI ও ডিজিটাল দুনিয়ার সর্বশেষ খবর।",
};

export default function TechnologyPage() {
  return (
    <CategoryNewsPage
      slug="technology"
      title="প্রযুক্তি"
      subtitle="প্রযুক্তি, কৃত্রিম বুদ্ধিমত্তা, গ্যাজেট ও ডিজিটাল বিশ্বের খবর।"
    />
  );
}