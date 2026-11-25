import CategoryNewsPage from "../../components/sections/category-news-page";

export const metadata = {
  title: "বিনোদন | দৈনিক দিনলিপি",
  description: "দেশ-বিদেশের বিনোদন জগতের সর্বশেষ খবর।",
};

export default function EntertainmentPage() {
  return (
    <CategoryNewsPage
      slug="entertainment"
      title="বিনোদন"
      subtitle="সিনেমা, নাটক, সংগীত, তারকাদের খবর ও বিনোদন জগতের সব আপডেট।"
    />
  );
}