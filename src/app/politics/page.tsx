import CategoryNewsPage from "../../components/sections/category-news-page";

export const metadata = {
  title: "রাজনীতি | দৈনিক দিনলিপি",
  description: "বাংলাদেশ ও বিশ্বের রাজনীতির সর্বশেষ খবর।",
};

export default function PoliticsPage() {
  return (
    <CategoryNewsPage
      slug="politics"
      title="রাজনীতি"
      subtitle="রাজনৈতিক দল, নির্বাচন, সংসদ ও দেশের রাজনৈতিক অঙ্গনের সর্বশেষ খবর।"
    />
  );
}