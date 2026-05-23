import { NextResponse } from "next/server";

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

    // Log the submission to console
    console.log("🧬 NEW CLINICAL ACCESS REQUEST:", {
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
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'enregistrement de votre demande" },
      { status: 500 }
    );
  }
}
