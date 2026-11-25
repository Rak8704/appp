import CategoryNewsPage from "../../components/sections/category-news-page";

export const metadata = {
  title: "জাতীয় সংবাদ | দৈনিক দিনলিপি",
  description: "বাংলাদেশের সর্বশেষ জাতীয় সংবাদ পড়ুন দৈনিক দিনলিপিতে।",
};

export default function NationalPage() {
  return (
    <CategoryNewsPage
      slug="national"
      title="জাতীয় সংবাদ"
      subtitle="বাংলাদেশের রাজনীতি, প্রশাসন, জনজীবন ও দেশের গুরুত্বপূর্ণ সব খবর।"
    />
  );
}