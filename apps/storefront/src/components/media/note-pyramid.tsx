import type { FragranceProfile } from "@/lib/catalog/types";
import { Eyebrow } from "@/components/typography/display";

interface NotePyramidProps {
  fragrance: FragranceProfile;
  className?: string;
}

export function NotePyramid({ fragrance, className }: NotePyramidProps) {
  const layers = [
    { label: "Top", notes: fragrance.topNotes },
    { label: "Heart", notes: fragrance.heartNotes },
    { label: "Base", notes: fragrance.baseNotes },
  ];

  return (
    <section className={className}>
      <Eyebrow className="mb-8 text-center">Note Pyramid</Eyebrow>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
        {layers.map((layer) => (
          <div key={layer.label} className="text-center">
            <p className="font-label-caps text-label-caps text-secondary mb-4 uppercase tracking-widest">
              {layer.label}
            </p>
            <ul className="space-y-2">
              {layer.notes.map((note) => (
                <li key={note} className="font-body-md text-body-md text-on-surface">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {fragrance.editorialPullquote && (
        <blockquote className="mt-12 text-center font-headline-md text-headline-md text-primary italic max-w-xl mx-auto">
          &ldquo;{fragrance.editorialPullquote}&rdquo;
        </blockquote>
      )}
      {(fragrance.longevityHours || fragrance.sillage) && (
        <div className="mt-10 flex justify-center gap-12 text-center">
          {fragrance.longevityHours && (
            <div>
              <p className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-1">
                Longevity
              </p>
              <p className="font-headline-sm text-headline-sm text-on-surface">
                {fragrance.longevityHours}h+
              </p>
            </div>
          )}
          {fragrance.sillage && (
            <div>
              <p className="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-1">
                Sillage
              </p>
              <p className="font-headline-sm text-headline-sm text-on-surface">
                {fragrance.sillage}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
