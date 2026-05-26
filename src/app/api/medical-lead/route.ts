import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, specialty, email, phone, objective } = body;

    if (!name || !specialty || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Tous les champs obligatoires doivent être renseignés" },
        { status: 400 }
      );
    }

    // Save to the dedicated local Supabase database
    const { error } = await supabase
      .from("medical_leads")
      .insert([{ name, specialty, email, phone, objective }]);

    if (error) {
      console.error("❌ Failed to save clinical lead to local database:", error);
      return NextResponse.json(
        { success: false, error: "Une erreur est survenue lors de l'enregistrement de votre demande" },
        { status: 500 }
      );
    }

    console.log("🧬 NEW CLINICAL ACCESS REQUEST REGISTERED:", {
      name,
      specialty,
      email,
      phone,
      objective,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Votre demande a été enregistrée avec succès. Nos équipes vous contacteront sous 24h avec la documentation complète.",
    });
  } catch (error) {
    console.error("❌ Exception in clinical lead route:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'enregistrement de votre demande" },
      { status: 500 }
    );
  }
}
