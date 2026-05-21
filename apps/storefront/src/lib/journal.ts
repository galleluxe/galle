import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface JournalPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  category: string;
  readingTime: number;
  content?: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "journal");

function ensureDir() {
  if (!fs.existsSync(CONTENT_DIR)) return false;
  return true;
}

export function getAllPosts(): JournalPost[] {
  if (!ensureDir()) return FALLBACK_POSTS;

  try {
    const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
    const posts = files.map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { data } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: String(data.title ?? ""),
        date: String(data.date ?? ""),
        excerpt: String(data.excerpt ?? ""),
        coverImage: String(data.coverImage ?? "/5.png"),
        category: String(data.category ?? ""),
        readingTime: Number(data.readingTime ?? 5),
      } satisfies JournalPost;
    });

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch {
    return FALLBACK_POSTS;
  }
}

export function getPostBySlug(slug: string): (JournalPost & { content: string }) | null {
  if (!ensureDir()) {
    const fallback = FALLBACK_POSTS.find((p) => p.slug === slug);
    return fallback ? { ...fallback, content: "" } : null;
  }

  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: String(data.title ?? ""),
      date: String(data.date ?? ""),
      excerpt: String(data.excerpt ?? ""),
      coverImage: String(data.coverImage ?? "/5.png"),
      category: String(data.category ?? ""),
      readingTime: Number(data.readingTime ?? 5),
      content,
    };
  } catch {
    return null;
  }
}

const FALLBACK_POSTS: JournalPost[] = [
  {
    slug: "art-of-maceration",
    title: "The Art of Maceration",
    date: "2026-03-15",
    excerpt: "Why we let our blends rest in darkness for months before they reach you.",
    coverImage: "/5.png",
    category: "Craft",
    readingTime: 5,
  },
  {
    slug: "grasse-rose",
    title: "In Search of the Perfect Rose",
    date: "2026-02-10",
    excerpt: "A sourcing journey to Grasse, where the world's finest roses meet morning dew.",
    coverImage: "/3.png",
    category: "Sourcing",
    readingTime: 7,
  },
  {
    slug: "india-and-perfume",
    title: "India's Ancient Perfume Legacy",
    date: "2026-01-20",
    excerpt:
      "Long before Grasse became the perfume capital, Indian artisans were distilling the world's most complex attars.",
    coverImage: "/1.png",
    category: "Heritage",
    readingTime: 6,
  },
];
