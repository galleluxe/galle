import { Modules } from "@medusajs/framework/utils";

interface ExecArgs {
  container: any;
}

export default async function seed({ container }: ExecArgs) {
  console.log("Starting GALLE seed...");

  const productModule = container.resolve(Modules.PRODUCT);
  const pricingModule = container.resolve(Modules.PRICING);
  const regionModule = container.resolve(Modules.REGION);
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);
  const remoteLink = container.resolve("remoteLink");
  
  // Resolve fragrance module by its registration name or via container
  let fragranceModule: any;
  try {
    fragranceModule = container.resolve("fragrance");
  } catch {
    console.error("Could not resolve fragrance module service.");
  }

  // 1. Create or update Region
  console.log("Seeding Region...");
  let region = await regionModule.listRegions({ name: "India" }).then((r: any) => r[0]);
  if (!region) {
    region = await regionModule.createRegions({
      name: "India",
      currency_code: "inr",
      countries: ["in"],
    });
  }

  // 2. Resolve default Sales Channel
  console.log("Resolving Sales Channel...");
  let sc = await salesChannelModule.listSalesChannels({ name: "Default Sales Channel" }).then((s: any) => s[0]);
  if (!sc) {
    sc = await salesChannelModule.listSalesChannels().then((s: any) => s[0]);
  }
  if (!sc) {
    sc = await salesChannelModule.createSalesChannels({
      name: "Default Sales Channel",
      description: "Default channel",
    });
  }

  // 3. Define the products to seed
  const productsToSeed = [
    {
      handle: "entice",
      title: "Entice",
      description: "A delicate balance of soft rose and white musk, creating an aura of undeniable allure.",
      thumbnail: "/3.png",
      images: ["/3.png"],
      family: "Floral",
      topNotes: ["Bergamot", "Pink Pepper"],
      heartNotes: ["Rose Centifolia", "White Musk"],
      baseNotes: ["Sandalwood", "Amber"],
      longevity: 8,
      sillage: "Moderate",
      occasion: ["evening", "gifting"],
      pullquote: "Wear a mood of quiet allure.",
      price: 1540000, // INR in paise
    },
    {
      handle: "white-oud",
      title: "White Oud",
      description: "A rare and luminous interpretation of traditional oud, blended with soft white florals.",
      thumbnail: "/1.png",
      images: ["/1.png"],
      family: "Woody",
      topNotes: ["Saffron", "Cardamom"],
      heartNotes: ["White Jasmine", "Rose"],
      baseNotes: ["Agarwood (Oud)", "White Musk", "Amber"],
      longevity: 10,
      sillage: "Strong",
      occasion: ["evening", "special"],
      pullquote: "An ethereal mist of smoky woods and morning light.",
      price: 1450000,
    },
    {
      handle: "adore",
      title: "Adore",
      description: "A bright, joyful burst of sparkling citrus and green leaves, drying down to a clean skin scent.",
      thumbnail: "/2.png",
      images: ["/2.png"],
      family: "Fresh",
      topNotes: ["Mint", "Lemon Verbena", "Green Apple"],
      heartNotes: ["Geranium", "Lavender"],
      baseNotes: ["Tonka Bean", "Vetiver", "Cedarwood"],
      longevity: 6,
      sillage: "Moderate",
      occasion: ["day", "office"],
      pullquote: "A sparkling whisper of morning dew.",
      price: 1280000,
    },
    {
      handle: "day-dream",
      title: "Day Dream",
      description: "An airy, dreamlike concoction of soft white petals floating on a warm cream base.",
      thumbnail: "/5.png",
      images: ["/5.png"],
      family: "Oriental",
      topNotes: ["Jasmine Sambac", "Saffron"],
      heartNotes: ["Amberwood", "Ambergris"],
      baseNotes: ["Fir Resin", "Cedarwood"],
      longevity: 8,
      sillage: "Moderate",
      occasion: ["day", "evening"],
      pullquote: "An olfactory escape into clean skies.",
      price: 1370000,
    },
  ];

  for (const p of productsToSeed) {
    console.log(`Seeding product: ${p.title}...`);

    let product = await productModule.listProducts({ handle: p.handle }).then((res: any) => res[0]);
    if (!product) {
      product = await productModule.createProducts({
        title: p.title,
        handle: p.handle,
        description: p.description,
        thumbnail: p.thumbnail,
        images: p.images.map((url) => ({ url })),
        variants: [
          {
            title: "50ml",
            sku: `${p.handle.toUpperCase()}-50ML`,
            inventory_quantity: 50,
            options: {},
          },
        ],
        sales_channels: [{ id: sc.id }],
      });

      const variant = product.variants[0];

      // Seed the price for this variant
      const priceSet = await pricingModule.createPriceSets({
        prices: [
          {
            currency_code: "inr",
            amount: p.price / 100, // Medusa v2 uses standard units in core API for pricing creation if using pricingModule directly or paise depending on region setup
            rules: {},
          },
        ],
      });

      // Link variant to price set
      await remoteLink.create({
        [Modules.PRODUCT]: { variant_id: variant.id },
        [Modules.PRICING]: { price_set_id: priceSet.id },
      });
    }

    if (fragranceModule) {
      // Seed fragrance profile
      let profile = await fragranceModule.listFragranceProfiles({ product_id: product.id }).then((res: any) => res[0]);
      if (!profile) {
        profile = await fragranceModule.createFragranceProfiles({
          product_id: product.id,
          family: p.family,
          top_notes: p.topNotes,
          heart_notes: p.heartNotes,
          base_notes: p.baseNotes,
          longevity_hours: p.longevity,
          sillage: p.sillage,
          occasion: p.occasion,
          editorial_pullquote: p.pullquote,
        });

        // Create link between product and fragrance profile
        await remoteLink.create({
          [Modules.PRODUCT]: { product_id: product.id },
          fragrance: { fragrance_profile_id: profile.id },
        });
      }
    }
  }

  console.log("GALLE seed completed successfully!");
}
