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
      category: searchParams.get("category") || null,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
    };

    // Validate pagination
    if (filters.page < 1) filters.page = 1;
    if (filters.limit < 1 || filters.limit > 100) filters.limit = 10;

    const offset = (filters.page - 1) * filters.limit;

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
      .range(offset, offset + filters.limit - 1);

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

    const totalPages = Math.ceil((count || 0) / filters.limit);

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: count || 0,
        totalPages,
        hasNextPage: filters.page < totalPages,
        hasPrevPage: filters.page > 1,
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
