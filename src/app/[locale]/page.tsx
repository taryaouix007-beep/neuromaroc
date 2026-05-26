import { Metadata } from "next";
import HomeClient from "./home-client";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;

  const seoData: Record<string, { title: string; description: string }> = {
    fr: {
      title: "NeuroMaroc | Centre de Neurofeedback et Optimisation Cérébrale à Casablanca",
      description: "Découvrez le potentiel de votre cerveau avec NeuroMaroc. Experts en neurofeedback, optimisation cognitive et santé mentale pour booster vos performances et votre bien-être.",
    },
    en: {
      title: "NeuroMaroc | Neurofeedback & Brain Optimization Center in Casablanca",
      description: "Unlock your brain's full potential with NeuroMaroc. Experts in neurofeedback, cognitive optimization, and mental health to enhance your performance and well-being.",
    },
    ar: {
      title: "نيورو ماروك | مركز النيوروفيدباك وتحسين وظائف الدماغ بالدار البيضاء",
      description: "اكتشف إمكانيات دماغك مع نيورو ماروك. خبراء في التغذية الراجعة العصبية والتحسين المعرفي والصحة النفسية لتعزيز أدائك ورفاهيتك.",
    },
  };

  const { title, description } = seoData[locale] || seoData["fr"];

  return {
    title,
    description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}`,
      languages: {
        "fr-FR": `${process.env.NEXT_PUBLIC_APP_URL}/fr`,
        "en-US": `${process.env.NEXT_PUBLIC_APP_URL}/en`,
        "ar-MA": `${process.env.NEXT_PUBLIC_APP_URL}/ar`,
      },
    },
  };
}

export default function Page() {
  return <HomeClient />;
}
