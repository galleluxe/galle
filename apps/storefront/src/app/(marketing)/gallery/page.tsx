import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Display, BodyText, Headline, Eyebrow } from "@/components/typography/display";

export const revalidate = 600;

export default function GalleryPage() {
  return (
    <PageShell className="pt-[40px] pb-section-gap min-h-screen">
      <section className="mb-section-gap text-center">
        <Display className="mb-6 tracking-tight">The Art of Olfaction</Display>
        <BodyText size="lg" className="max-w-2xl mx-auto">
          A visual exploration of form, essence, and the ethereal atmosphere
          that defines the GALLE collection.
        </BodyText>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-y-32">
          <div className="md:col-span-12 relative group mb-12 md:mb-0">
            <div className="aspect-[16/9] w-full overflow-hidden bg-surface-container-low rounded-lg shadow-[0_20px_60px_rgba(111,89,89,0.08)] relative">
              <Image
                src="/5.png"
                alt="Day Dream feature"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent flex items-end p-8 md:p-12">
                <div>
                  <Headline className="mb-2 text-on-surface">Day Dream</Headline>
                  <Eyebrow className="text-primary">The Awakening</Eyebrow>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-1 mt-12 md:mt-24 mb-12 md:mb-0 relative group">
            <div className="aspect-[3/4] w-full overflow-hidden bg-surface-container-low rounded-lg shadow-[0_15px_50px_rgba(111,89,89,0.06)] relative">
              <Image
                src="/2.png"
                alt="Adore"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                sizes="50vw"
              />
            </div>
            <div className="mt-6 md:absolute md:-right-24 md:bottom-24 md:bg-surface/90 md:backdrop-blur-sm md:p-8 md:shadow-[0_10px_30px_rgba(111,89,89,0.05)] md:max-w-xs z-10">
              <Headline size="sm" className="mb-3">
                Adore Noir
              </Headline>
              <BodyText>
                Shadows cast by golden hour light, revealing the depth of rare
                botanical extracts.
              </BodyText>
            </div>
          </div>

          <div className="hidden md:block md:col-span-2" />

          <div className="md:col-span-6 md:col-start-7 mb-12 md:mb-0 relative group">
            <div className="aspect-square w-full overflow-hidden bg-surface-container-low rounded-lg relative">
              <Image
                src="/3.png"
                alt="Entice"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                sizes="50vw"
              />
            </div>
            <div className="mt-6 text-center md:text-left">
              <Headline size="sm" className="mb-2">
                Entice Ethereal
              </Headline>
              <Eyebrow>Wear A Mood</Eyebrow>
            </div>
          </div>

          <div className="md:col-span-10 md:col-start-2 mt-12 md:mt-32">
            <div className="aspect-[21/9] w-full overflow-hidden bg-primary-container/20 rounded-lg flex items-center justify-center p-8">
              <div className="text-center max-w-lg">
                <span className="material-symbols-outlined text-4xl text-primary mb-6 block">
                  auto_awesome
                </span>
                <Headline className="mb-4 italic">
                  &ldquo;A fragrance is a silent poem, whispered to the
                  skin.&rdquo;
                </Headline>
                <Button asChild variant="ghost" className="mt-8">
                  <Link href="/about">Explore The Atelier</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
