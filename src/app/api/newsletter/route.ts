import { NextResponse } from "next/server";

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

    // Logging the subscription details so the user can see it in terminal logs
    console.log("📬 NEW NEWSLETTER SUBSCRIBER:", {
      email,
      timestamp: new Date().toISOString(),
    });

    // Easily integrated with external database or mailing services (e.g. Mailchimp, SendGrid)
    return NextResponse.json({
      success: true,
      message: "Bienvenue dans la Lettre Neuro-Sensible INFC.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'inscription" },
      { status: 500 }
    );
  }
}
