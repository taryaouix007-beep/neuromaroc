import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "fr";

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }

    // Fetch the blog post
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("locale", locale)
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .single();

    if (error || !data) {
      console.error("❌ Error fetching blog post:", error);
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Fetch related posts (same category, different slug)
    const { data: relatedPosts } = await supabase
      .from("blog_posts")
      .select("id,slug,title,description,icon,category,author_name,published_at")
      .eq("locale", locale)
      .eq("category", data.category)
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .neq("slug", slug)
      .order("published_at", { ascending: false })
      .limit(3);

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        relatedPosts: relatedPosts || [],
      },
    });
  } catch (error: any) {
    console.error("❌ Exception in blog detail route:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
