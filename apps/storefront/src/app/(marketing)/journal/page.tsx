import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Display, BodyText, Headline, Eyebrow } from "@/components/typography/display";
import { getAllPosts } from "@/lib/journal";

export const revalidate = 3600;

export default function JournalPage() {
  const posts = getAllPosts();

  return (
    <PageShell className="pt-8 pb-section-gap">
      <section className="text-center mb-section-gap">
        <Display className="mb-6">Journal</Display>
        <BodyText size="lg" className="max-w-xl mx-auto">
          Stories of craft, scent, and the atelier.
        </BodyText>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-4xl mx-auto">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/journal/${post.slug}`}
            className="group overflow-hidden rounded-xl ambient-shadow bg-surface-container-low hover:bg-surface-container transition-colors"
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-8">
              <div className="flex gap-3 items-center mb-4">
                <Eyebrow>{post.category}</Eyebrow>
                <span className="text-outline-variant/60">·</span>
                <Eyebrow>
                  {new Date(post.date).toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                </Eyebrow>
              </div>
              <Headline className="mb-3 group-hover:text-secondary transition-colors">
                {post.title}
              </Headline>
              <BodyText>{post.excerpt}</BodyText>
              <p className="mt-4 font-label-caps text-[10px] uppercase tracking-widest text-secondary">
                {post.readingTime} min read →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
