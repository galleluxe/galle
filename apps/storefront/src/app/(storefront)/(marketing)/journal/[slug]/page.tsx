import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PageShell } from "@/components/layout/page-shell";
import { Display, Eyebrow } from "@/components/typography/display";
import { getAllPosts, getPostBySlug } from "@/lib/journal";

interface JournalPostProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: JournalPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Journal" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | GALLE Journal`,
      description: post.excerpt,
      images: [{ url: post.coverImage, alt: post.title }],
    },
  };
}

export const revalidate = 3600;

export default async function JournalPostPage({ params }: JournalPostProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <PageShell narrow className="pt-8 pb-section-gap">
      {/* Back + breadcrumb */}
      <Eyebrow className="mb-8">
        <Link href="/journal" className="hover:text-primary">← Journal</Link>
      </Eyebrow>

      {/* Meta */}
      <div className="flex gap-3 items-center mb-6">
        <Eyebrow>{post.category}</Eyebrow>
        <span className="text-outline-variant/60">·</span>
        <Eyebrow>
          {new Date(post.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Eyebrow>
        <span className="text-outline-variant/60">·</span>
        <Eyebrow>{post.readingTime} min read</Eyebrow>
      </div>

      <Display className="text-display-lg-mobile md:text-display-lg mb-10">
        {post.title}
      </Display>

      {/* Cover image */}
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden ambient-shadow mb-12">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>

      {/* MDX body */}
      <article className="prose prose-stone max-w-none prose-headings:font-bodoni prose-headings:text-primary prose-p:text-on-surface prose-p:leading-relaxed prose-strong:text-on-surface prose-li:text-on-surface">
        <MDXRemote source={post.content} />
      </article>

      {/* Next article CTA */}
      <div className="mt-16 pt-8 border-t border-outline-variant/30 text-center">
        <Link
          href="/journal"
          className="font-label-caps text-label-caps uppercase tracking-widest text-secondary hover:underline"
        >
          Read more from the Journal
        </Link>
      </div>
    </PageShell>
  );
}
