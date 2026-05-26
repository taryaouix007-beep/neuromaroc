import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Adresse email invalide" },
        { status: 400 }
      );
    }

    // Save to the dedicated local Supabase database
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);

    if (error) {
      // Handle unique constraint violation gracefully
      if (error.code === "23505") {
        return NextResponse.json({
          success: true,
          message: "Vous êtes déjà inscrit à la Lettre Neuro-Sensible INFC.",
        });
      }

      console.error("❌ Failed to save newsletter subscription to local database:", error);
      return NextResponse.json(
        { success: false, error: "Une erreur est survenue lors de l'inscription" },
        { status: 500 }
      );
    }

    console.log("📬 NEW NEWSLETTER SUBSCRIBER REGISTERED:", {
      email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Bienvenue dans la Lettre Neuro-Sensible INFC.",
    });
  } catch (error) {
    console.error("❌ Exception in newsletter route:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'inscription" },
      { status: 500 }
    );
  }
}
