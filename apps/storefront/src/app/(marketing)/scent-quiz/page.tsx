import { PageShell } from "@/components/layout/page-shell";
import { Headline, BodyText, Eyebrow } from "@/components/typography/display";
import { ScentQuiz } from "@/features/concierge/components/scent-quiz";
import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "Scent Discovery Quiz",
  description: "Find your perfect GALLE fragrance through our olfactory mood quiz.",
};

export default function ScentQuizPage() {
  return (
    <PageShell className="pt-8 pb-section-gap max-w-3xl mx-auto text-center">
      <Reveal>
        <Eyebrow className="mb-4">Concierge</Eyebrow>
        <Headline className="mb-4">Scent Discovery</Headline>
        <BodyText className="mb-12 max-w-md mx-auto">
          Answer a few questions about your mood and we will guide you to your ideal essence.
        </BodyText>
      </Reveal>
      <Reveal delay={0.1}>
        <ScentQuiz />
      </Reveal>
    </PageShell>
  );
}
