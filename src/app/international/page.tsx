import CategoryNewsPage from "../../components/sections/category-news-page";

export const metadata = {
  title: "আন্তর্জাতিক সংবাদ | দৈনিক দিনলিপি",
  description: "বিশ্বের সর্বশেষ আন্তর্জাতিক সংবাদ ও গুরুত্বপূর্ণ খবর।",
};

export default function InternationalPage() {
  return (
    <CategoryNewsPage
      slug="international"
      title="আন্তর্জাতিক সংবাদ"
      subtitle="বিশ্বের বিভিন্ন দেশের গুরুত্বপূর্ণ ঘটনা, কূটনীতি ও আন্তর্জাতিক পরিস্থিতি।"
    />
  );
}