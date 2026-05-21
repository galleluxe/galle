import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Display, BodyText, Headline, Eyebrow } from "@/components/typography/display";

export default function AboutPage() {
  return (
    <PageShell className="pt-8 pb-section-gap">
      <section className="mb-section-gap text-center">
        <Display className="mb-6">Crafting the Ethereal</Display>
        <BodyText size="lg" className="max-w-2xl mx-auto">
          Where olfactory grace meets minimalist sophistication. Unveiling the
          heritage and meticulous artistry behind every GALLE creation.
        </BodyText>
      </section>

      <section className="mb-section-gap grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
        <div className="md:col-span-5 md:col-start-2 order-2 md:order-1 mt-10 md:mt-0">
          <Headline className="mb-4">Our Philosophy</Headline>
          <BodyText className="mb-6">
            GALLE was born from a desire to distill memories into weightless
            sophistication. We believe fragrance is not merely an accessory,
            but an invisible architecture—a personal signature crafted from the
            rarest elements earth has to offer.
          </BodyText>
          <Button asChild variant="ghost">
            <Link href="/journal">Discover Our Roots</Link>
          </Button>
        </div>
        <div className="md:col-span-6 order-1 md:order-2 relative aspect-[4/5] md:aspect-square rounded-sm overflow-hidden ambient-shadow">
          <Image
            src="/hero-perfume.png"
            alt="GALLE atelier"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
      </section>

      <section className="mb-section-gap">
        <div className="text-center mb-12">
          <Headline>Sourcing Rare Botanicals</Headline>
          <BodyText className="mt-2">A global pursuit of purity.</BodyText>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col bg-surface-container-low p-8 rounded-sm ambient-shadow">
            <span className="material-symbols-outlined text-primary mb-4 text-3xl">
              eco
            </span>
            <Headline size="sm" className="mb-2 text-on-surface">
              Sustainable Harvests
            </Headline>
            <BodyText>
              Partnering with multi-generational farmers to ensure every bloom
              is hand-picked at dawn.
            </BodyText>
          </div>
          <div className="col-span-1 md:col-span-2 relative h-64 md:h-auto min-h-[280px] overflow-hidden rounded-sm ambient-shadow group">
            <Image
              src="/4.png"
              alt="Botanical sourcing"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="66vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <Headline size="sm" className="text-white mb-1">
                Grasse, France
              </Headline>
              <BodyText className="text-white/90">
                The birthplace of our signature Rose Centifolia.
              </BodyText>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-6 relative aspect-[3/4] rounded-sm overflow-hidden ambient-shadow">
            <Image
              src="/1.png"
              alt="Artisanal process"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <Headline className="mb-6">The Artisanal Process</Headline>
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Maceration",
                  desc: "Blends rest in darkness for up to six months, developing unparalleled depth.",
                },
                {
                  step: "02",
                  title: "Filtration",
                  desc: "Cold-filtration clarifies the essence without stripping natural character.",
                },
                {
                  step: "03",
                  title: "Bottling",
                  desc: "Each flacon is polished and filled by hand in our atelier.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center font-label-caps text-label-caps text-primary">
                    {item.step}
                  </div>
                  <div>
                    <Headline size="sm" className="mb-2 text-on-surface">
                      {item.title}
                    </Headline>
                    <BodyText>{item.desc}</BodyText>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
