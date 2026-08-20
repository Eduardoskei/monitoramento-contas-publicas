import { SiteHeader } from '@/components/site-header'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-secction'
import { SolutionsSection } from '@/components/solutions-section'
import { CtaSection } from '@/components/cta-section'
import { SiteFooter } from '@/components/site-footer'

export default function Home() {
	return (
		<main>
			<SiteHeader />
			<HeroSection />
			<FeaturesSection />
			<SolutionsSection />
			<CtaSection />
			<SiteFooter />
		</main>
	)
}