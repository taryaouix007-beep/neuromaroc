import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, city, message } = body;

    if (!name || !phone || !city) {
      return NextResponse.json(
        { success: false, error: "Tous les champs obligatoires doivent être renseignés" },
        { status: 400 }
      );
    }

    // Save to the dedicated local Supabase database
    const { error } = await supabase
      .from("contact_submissions")
      .insert([{ name, phone, city, message }]);

    if (error) {
      console.error("❌ Failed to save contact submission to local database:", error);
      return NextResponse.json(
        { success: false, error: "Une erreur est survenue lors de l'enregistrement de votre demande" },
        { status: 500 }
      );
    }

    console.log("📞 NEW CONTACT FORM SUBMISSION REGISTERED:", {
      name,
      phone,
      city,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Votre demande a été enregistrée. Un praticien INFC vous recontactera dans les plus brefs délais.",
    });
  } catch (error) {
    console.error("❌ Exception in contact form route:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'envoi de la demande" },
      { status: 500 }
    );
  }
}
