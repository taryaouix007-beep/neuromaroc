import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: Retrieve all approved questions and their expert answers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = supabase
      .from("forum_questions")
      .select(`
        id,
        title,
        description,
        category,
        author_name,
        votes,
        approved,
        created_at,
        forum_answers (
          author_name,
          author_title,
          text
        )
      `)
      .order("votes", { ascending: false });

    // If not in development, only retrieve approved questions
    const isDev = process.env.NODE_ENV === "development";
    if (!isDev) {
      query = query.eq("approved", true);
    }

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ Failed to fetch forum questions:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Map DB schema to Frontend interface
    const questions = (data || []).map((q: any) => {
      // Format date nicely
      const dateObj = new Date(q.created_at);
      const formattedDate = dateObj.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      return {
        id: q.id,
        title: q.title,
        description: q.description || "",
        category: q.category,
        author: q.author_name,
        date: formattedDate,
        votes: q.votes,
        answer: q.forum_answers && q.forum_answers.length > 0 ? {
          authorName: q.forum_answers[0].author_name,
          authorTitle: q.forum_answers[0].author_title,
          text: q.forum_answers[0].text,
        } : null,
      };
    });

    return NextResponse.json({ success: true, questions });
  } catch (error: any) {
    console.error("❌ Exception in GET forum:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Add a new question or record a vote
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // Handle Vote action
    if (action === "vote") {
      const { questionId, isVoted } = body;

      if (!questionId) {
        return NextResponse.json({ success: false, error: "Question ID is required" }, { status: 400 });
      }

      // 1. Fetch current votes
      const { data: qData, error: fetchErr } = await supabase
        .from("forum_questions")
        .select("votes")
        .eq("id", questionId)
        .single();

      if (fetchErr) {
        return NextResponse.json({ success: false, error: "Question not found" }, { status: 404 });
      }

      // 2. Calculate next vote count
      const currentVotes = qData?.votes || 0;
      const nextVotes = isVoted ? Math.max(0, currentVotes - 1) : currentVotes + 1;

      // 3. Update vote count
      const { error: updateErr } = await supabase
        .from("forum_questions")
        .update({ votes: nextVotes })
        .eq("id", questionId);

      if (updateErr) {
        console.error("❌ Failed to update votes:", updateErr);
        return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, votes: nextVotes });
    }

    // Handle Create Question action (default)
    const { title, description, category, author_name, anonymous } = body;

    if (!title || !category) {
      return NextResponse.json({ success: false, error: "Title and Category are required" }, { status: 400 });
    }

    const authorName = anonymous ? "Anonyme" : (author_name || "Parent INFC");
    // Auto-approve in development to allow easy testing
    const approved = process.env.NODE_ENV === "development";

    const { data, error } = await supabase
      .from("forum_questions")
      .insert([
        {
          title,
          description: description || null,
          category,
          author_name: authorName,
          approved,
          votes: 1, // Author is automatically interested
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Failed to insert forum question:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      question: {
        id: data.id,
        title: data.title,
        description: data.description || "",
        category: data.category,
        author: data.author_name,
        date: "Aujourd'hui",
        votes: data.votes,
        answer: null,
      },
    });
  } catch (error: any) {
    console.error("❌ Exception in POST forum:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
