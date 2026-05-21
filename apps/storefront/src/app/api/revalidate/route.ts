import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = process.env.REVALIDATE_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { tags, paths } = body;

    let revalidated = false;

    if (Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag);
      }
      revalidated = true;
    }

    if (Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path);
      }
      revalidated = true;
    }

    if (!revalidated) {
      // General revalidation
      revalidateTag("shop");
      revalidateTag("home");
      revalidatePath("/shop");
      revalidatePath("/");
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
