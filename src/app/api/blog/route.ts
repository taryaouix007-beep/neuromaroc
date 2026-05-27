import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface BlogFilters {
  locale?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters: BlogFilters = {
      locale: searchParams.get("locale") || "fr",
      category: searchParams.get("category") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
    };

    // Validate pagination
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const validatedPage = page < 1 ? 1 : page;
    const validatedLimit = limit < 1 || limit > 100 ? 10 : limit;
    const offset = (validatedPage - 1) * validatedLimit;

    // Build query
    let query = supabase
      .from("blog_posts")
      .select("id,slug,icon,category,title,description,locale,published_at,author_name,author_avatar,created_at", {
        count: "exact",
      })
      .eq("locale", filters.locale)
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .range(offset, offset + validatedLimit - 1);

    // Add category filter if provided
    if (filters.category) {
      query = query.eq("category", filters.category);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error("❌ Error fetching blog posts:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch blog posts" },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / validatedLimit);

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page: validatedPage,
        limit: validatedLimit,
        total: count || 0,
        totalPages,
        hasNextPage: validatedPage < totalPages,
        hasPrevPage: validatedPage > 1,
      },
    });
  } catch (error: any) {
    console.error("❌ Exception in blog list route:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
