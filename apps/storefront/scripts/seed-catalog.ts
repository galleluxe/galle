/**
 * Seed GALLE products + variants into Payload (Neon).
 * Run: pnpm --filter @galle/storefront seed:catalog
 */
import { getPayload } from "payload";
import config from "@payload-config";

const IK = "https://ik.imagekit.io/galleluxe";

type NoteRow = { note: string };
type ProductSeed = {
  title: string;
  handle: string;
  subtitle: string;
  description: string;
  noteLine: string;
  thumbnailUrl: string;
  imageUrls: { url: string }[];
  featured: boolean;
  fragranceFamily: "Floral" | "Woody" | "Fresh" | "Amber" | "Oriental" | "Citrus";
  topNotes: NoteRow[];
  heartNotes: NoteRow[];
  baseNotes: NoteRow[];
  longevityHours: number;
  sillage: "Intimate" | "Moderate" | "Strong";
  occasion: { label: string }[];
  editorialPullquote: string;
  variant: {
    title: string;
    sku: string;
    pricePaise: number;
    inventory: number;
  };
};

const CATALOG: ProductSeed[] = [
  {
    title: "White Oud",
    handle: "white-oud",
    subtitle: "Luminous woods · white floral lift",
    description:
      "Smoky agarwood softened by white florals and a creamy sandalwood trail. An luminous oud for evenings that feel both grounded and ethereal.",
    noteLine: "Oud · White Floral · Sandalwood",
    thumbnailUrl: `${IK}/1.png`,
    imageUrls: [{ url: `${IK}/1.png` }, { url: `${IK}/5.png` }, { url: `${IK}/3.png` }],
    featured: true,
    fragranceFamily: "Woody",
    topNotes: [
      { note: "Warm Spicy" },
      { note: "Agarwood (Oud)" },
      { note: "Woody" },
      { note: "Citrus" }
    ],
    heartNotes: [
      { note: "Rose" },
      { note: "White Flower" },
      { note: "Saffron" },
      { note: "Agarwood (Oud)" },
      { note: "Sandal" },
      { note: "Amber" },
      { note: "Jasmine" }
    ],
    baseNotes: [
      { note: "Agarwood (Oud)" },
      { note: "Amber" },
      { note: "Musk" },
      { note: "Vanilla" }
    ],
    longevityHours: 10,
    sillage: "Strong",
    occasion: [{ label: "Evening" }, { label: "Special occasion" }],
    editorialPullquote:
      "Smoky woods with a white-floral lift — unlike any oud we have crafted before.",
    variant: { title: "50ml", sku: "WHITE-OUD-50", pricePaise: 850000, inventory: 100 },
  },
  {
    title: "Winsen",
    handle: "winsen",
    subtitle: "Zesty citrus · rose & earthy patchouli",
    description:
      "A crisp, invigorating opening of zesty lemon and bergamot, layered with a heart of Rose and cardamom on a base of warm earthy patchouli.",
    noteLine: "Lemon · Cardamom · Patchouli",
    thumbnailUrl: `${IK}/4.png`,
    imageUrls: [{ url: `${IK}/4.png` }, { url: `${IK}/2.png` }, { url: `${IK}/3.png` }],
    featured: true,
    fragranceFamily: "Citrus",
    topNotes: [
      { note: "Zesty Lemon" },
      { note: "Mandarin" },
      { note: "Bergamot" }
    ],
    heartNotes: [
      { note: "Rose" },
      { note: "Cardamom" },
      { note: "Ylang-Ylang" }
    ],
    baseNotes: [
      { note: "Woody Notes" },
      { note: "Earthy Patchouli" }
    ],
    longevityHours: 8,
    sillage: "Moderate",
    occasion: [{ label: "Daywear" }, { label: "Office" }],
    editorialPullquote:
      "A vibrant, sparkling citrus with an earthy patchouli undertone that stays crisp all day.",
    variant: { title: "50ml", sku: "WINSEN-50", pricePaise: 650000, inventory: 100 },
  },
  {
    title: "Entice",
    handle: "entice",
    subtitle: "Kannauj rose · peony · white musk",
    description:
      "Soft rose and musk that stays close to the skin. An intimate floral built around Kannauj rose, peony, and a veil of white musk.",
    noteLine: "Rose · Peony · White Musk",
    thumbnailUrl: `${IK}/3.png`,
    imageUrls: [{ url: `${IK}/3.png` }, { url: `${IK}/2.png` }, { url: `${IK}/1.png` }],
    featured: true,
    fragranceFamily: "Floral",
    topNotes: [
      { note: "Grapefruit" },
      { note: "Lemon" },
      { note: "Mint" },
      { note: "Pink Pepper" }
    ],
    heartNotes: [
      { note: "Ginger" },
      { note: "Nutmeg" },
      { note: "Jasmine" }
    ],
    baseNotes: [
      { note: "Incense" },
      { note: "Vetiver" },
      { note: "Cedar" },
      { note: "Sandalwood" },
      { note: "Patchouli" },
      { note: "Labdanum" },
      { note: "White Musk" }
    ],
    longevityHours: 8,
    sillage: "Intimate",
    occasion: [{ label: "Evening" }, { label: "Romantic" }],
    editorialPullquote:
      "A whisper of rose that lingers like a shadow on the skin.",
    variant: { title: "50ml", sku: "ENTICE-50", pricePaise: 650000, inventory: 100 },
  },
  {
    title: "Day Dream",
    handle: "day-dream",
    subtitle: "Jasmine · amberwood · creamy musk",
    description:
      "A dreamlike composition of jasmine and amberwood on a creamy base. Comforting yet refined — made for slow mornings and golden-hour reveries.",
    noteLine: "Jasmine · Amberwood · Creamy Musk",
    thumbnailUrl: `${IK}/5.png`,
    imageUrls: [{ url: `${IK}/5.png` }, { url: `${IK}/3.png` }, { url: `${IK}/2.png` }],
    featured: true,
    fragranceFamily: "Floral",
    topNotes: [
      { note: "Fresh Citruses" },
      { note: "Orange Blossom" }
    ],
    heartNotes: [
      { note: "White Floral" }
    ],
    baseNotes: [
      { note: "Vanilla" },
      { note: "Woody" },
      { note: "Musky" }
    ],
    longevityHours: 8,
    sillage: "Moderate",
    occasion: [{ label: "Daywear" }, { label: "Date night" }],
    editorialPullquote:
      "Jasmine and amberwood on a creamy base — comforting yet unmistakably GALLE.",
    variant: { title: "50ml", sku: "DAY-DREAM-50", pricePaise: 650000, inventory: 100 },
  },
  {
    title: "Pizazz",
    handle: "pizazz",
    subtitle: "Green mint · lavender & warm balsamic amber",
    description:
      "An energetic burst of mint and colognish green notes, softening into lavender and violet, with a comforting trail of balsamic amber and clean musk.",
    noteLine: "Mint · Lavender · Balsamic Amber",
    thumbnailUrl: `${IK}/6.png`,
    imageUrls: [{ url: `${IK}/6.png` }, { url: `${IK}/1.png` }, { url: `${IK}/5.png` }],
    featured: true,
    fragranceFamily: "Fresh",
    topNotes: [
      { note: "Green" },
      { note: "Slightly Spicy" },
      { note: "Colognish" },
      { note: "Mint" }
    ],
    heartNotes: [
      { note: "Lavender" },
      { note: "Violet" },
      { note: "Rose" },
      { note: "White Floral" }
    ],
    baseNotes: [
      { note: "Amber" },
      { note: "Woody Balsamic" },
      { note: "Musky" }
    ],
    longevityHours: 8,
    sillage: "Moderate",
    occasion: [{ label: "Daywear" }, { label: "Summer" }],
    editorialPullquote:
      "An energetic green explosion that dries down to a rich, warm, and sophisticated lavender-balsamic sign-off.",
    variant: { title: "50ml", sku: "PIZAZZ-50", pricePaise: 650000, inventory: 100 },
  },
  {
    title: "Adore",
    handle: "adore",
    subtitle: "Citrus · green notes · clean musk",
    description:
      "Crisp citrus and green notes that feel fresh and clean. A daily signature with quiet confidence — polished enough for the office, easy enough for every day.",
    noteLine: "Citrus · Green Notes · Musk",
    thumbnailUrl: `${IK}/2.png`,
    imageUrls: [{ url: `${IK}/2.png` }, { url: `${IK}/1.png` }, { url: `${IK}/5.png` }],
    featured: true,
    fragranceFamily: "Fresh",
    topNotes: [
      { note: "Green" },
      { note: "Lemonish" }
    ],
    heartNotes: [
      { note: "Rose" },
      { note: "White Flower" }
    ],
    baseNotes: [
      { note: "Woody" },
      { note: "Musky" },
      { note: "Balsamic" }
    ],
    longevityHours: 7,
    sillage: "Moderate",
    occasion: [{ label: "Office" }, { label: "Daywear" }],
    editorialPullquote: "Morning freshness woven into a signature you never tire of.",
    variant: { title: "50ml", sku: "ADORE-50", pricePaise: 550000, inventory: 100 },
  },
];

async function upsertProduct(payload: Awaited<ReturnType<typeof getPayload>>, seed: ProductSeed) {
  const existing = await payload.find({
    collection: "products",
    where: { handle: { equals: seed.handle } },
    limit: 1,
  });

  const productData = {
    title: seed.title,
    handle: seed.handle,
    subtitle: seed.subtitle,
    description: seed.description,
    noteLine: seed.noteLine,
    thumbnailUrl: seed.thumbnailUrl,
    imageUrls: seed.imageUrls,
    featured: seed.featured,
    bentoSize: "standard" as const,
    status: "published" as const,
    fragranceFamily: seed.fragranceFamily,
    topNotes: seed.topNotes,
    heartNotes: seed.heartNotes,
    baseNotes: seed.baseNotes,
    longevityHours: seed.longevityHours,
    sillage: seed.sillage,
    occasion: seed.occasion,
    editorialPullquote: seed.editorialPullquote,
  };

  let productId: number | string;

  if (existing.docs.length > 0) {
    const doc = existing.docs[0]!;
    productId = doc.id;
    await payload.update({
      collection: "products",
      id: productId,
      data: productData,
    });
    console.log(`  ↻ updated product: ${seed.title}`);
  } else {
    const created = await payload.create({
      collection: "products",
      data: productData,
    });
    productId = created.id;
    console.log(`  ✓ created product: ${seed.title}`);
  }

  const variantExisting = await payload.find({
    collection: "product-variants",
    where: { sku: { equals: seed.variant.sku } },
    limit: 1,
  });

  const variantData = {
    product: productId,
    title: seed.variant.title,
    sku: seed.variant.sku,
    pricePaise: seed.variant.pricePaise,
    inventory: seed.variant.inventory,
    isAvailable: true,
  };

  if (variantExisting.docs.length > 0) {
    await payload.update({
      collection: "product-variants",
      id: variantExisting.docs[0]!.id,
      data: variantData,
    });
    console.log(`    ↻ variant ${seed.variant.sku}`);
  } else {
    await payload.create({
      collection: "product-variants",
      data: variantData,
    });
    console.log(`    ✓ variant ${seed.variant.sku}`);
  }
}

const payload = await getPayload({ config });

console.log("\nSeeding GALLE catalog into Payload…\n");

for (const seed of CATALOG) {
  await upsertProduct(payload, seed);
}

console.log("\nDone. Refresh http://localhost:3000/shop\n");

process.exit(0);
