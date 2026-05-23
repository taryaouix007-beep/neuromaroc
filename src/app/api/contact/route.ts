import { NextResponse } from "next/server";

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

    // Log the submission to console for easy debugging and future integration
    console.log("📞 NEW CONTACT FORM SUBMISSION:", {
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
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'envoi de la demande" },
      { status: 500 }
    );
  }
}
