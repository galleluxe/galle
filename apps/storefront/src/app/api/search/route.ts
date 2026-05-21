import { NextRequest, NextResponse } from "next/server";
import { listProducts } from "@/lib/catalog";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ products: [] });
    }

    const products = await listProducts();
    const cleanQuery = query.toLowerCase().trim();

    // Filter products
    const filtered = products
      .filter((product) => {
        const titleMatch = product.title.toLowerCase().includes(cleanQuery);
        const descMatch = product.description.toLowerCase().includes(cleanQuery);
        const tagsMatch = product.tags.some((tag) =>
          tag.toLowerCase().includes(cleanQuery)
        );

        // Match fragrance profile attributes if available
        let notesMatch = false;
        if (product.fragrance) {
          const familyMatch = product.fragrance.family.toLowerCase().includes(cleanQuery);
          const topMatch = product.fragrance.topNotes.some((n) =>
            n.toLowerCase().includes(cleanQuery)
          );
          const heartMatch = product.fragrance.heartNotes.some((n) =>
            n.toLowerCase().includes(cleanQuery)
          );
          const baseMatch = product.fragrance.baseNotes.some((n) =>
            n.toLowerCase().includes(cleanQuery)
          );
          notesMatch = familyMatch || topMatch || heartMatch || baseMatch;
        }

        return titleMatch || descMatch || tagsMatch || notesMatch;
      })
      .map((product) => ({
        id: product.id,
        title: product.title,
        handle: product.handle,
        thumbnail: product.thumbnail,
        pricePaise: product.variants[0]?.pricePaise || 0,
        family: product.fragrance?.family,
      }));

    return NextResponse.json({ products: filtered });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
