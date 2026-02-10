import { HeroSection } from "@/components/home/hero-section"
import { CategoryGrid } from "@/components/home/category-grid"
import { FeaturedArticles } from "@/components/home/featured-articles"
import { SubmissionInfo } from "@/components/home/submission-info"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
      <CategoryGrid />
      <FeaturedArticles />
      <SubmissionInfo />
    </main>
  );
}
