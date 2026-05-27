"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { useTranslation } from "@/context/LanguageContext";

// Local storage token key
const TOKEN_KEY = "xpria_portal_token";

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  branchName?: string;
  serviceName?: string;
  providerName?: string;
}

interface Patient {
  name: string;
  phone?: string;
  email?: string;
}

export default function PatientPortalPage() {
  const { locale } = useTranslation();
  
  // App State
  const [view, setView] = useState<"login" | "otp" | "dashboard" | "intake" | "loading">("loading");
  const [activeTab, setActiveTab] = useState<"phone" | "email" | "booking_ref">("phone");
  
  // Toast Notification State
  const [toast, setToast] = useState({ show: false, title: "", message: "" });
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Form inputs
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [bookingRefApptId, setBookingRefApptId] = useState("");
  const [bookingRefPhoneSuffix, setBookingRefPhoneSuffix] = useState("");
  
  // Session data
  const [token, setToken] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [practiceInfo, setPracticeInfo] = useState<any>(null);
  
  // Reschedule state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleApptId, setRescheduleApptId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Intake state
  const [intakeStep, setIntakeStep] = useState(1);
  const [intakeSleep, setIntakeSleep] = useState("moyen");
  const [intakeStress, setIntakeStress] = useState("5");
  const [intakeHistory, setIntakeHistory] = useState("");
  const [intakeConsent, setIntakeConsent] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_XPRIA_API_URL || "http://localhost:3000";
  const apiKey = process.env.NEXT_PUBLIC_XPRIA_API_KEY || "xpk_1111111111111111111111111111111111111111111111111111111111111111";

  // Display Toast helper
  const showToast = (title: string, message: string) => {
    setToast({ show: true, title, message });
  };

  // Restore session on mount
  useEffect(() => {
    // 1. Check URL fragment for token (magic link return)
    if (typeof window !== "undefined") {
      if (window.location.hash) {
        const match = window.location.hash.match(/token=([^&]+)/);
        if (match) {
          const extractedToken = match[1];
          setToken(extractedToken);
          sessionStorage.setItem(TOKEN_KEY, extractedToken);
          window.location.hash = ""; // Clean fragment
          fetchDashboardData(extractedToken);
          return;
        }
      }

      // 2. Check session storage
      const savedToken = sessionStorage.getItem(TOKEN_KEY);
      if (savedToken) {
        setToken(savedToken);
        fetchDashboardData(savedToken);
      } else {
        setView("login");
      }
    }
  }, []);

  // Fetch Dashboard data using token
  const fetchDashboardData = async (jwtToken: string) => {
    setView("loading");
    try {
      // Get Appointments
      const resAppts = await fetch(`${apiBaseUrl}/api/v1/portal/appointments`, {
        headers: {
          "X-API-KEY": apiKey,
          "Authorization": `Bearer ${jwtToken}`,
        },
      });
      const dataAppts = await resAppts.json();
      
      // Get Practice details
      const resPractice = await fetch(`${apiBaseUrl}/api/v1/portal/practice`, {
        headers: { "X-API-KEY": apiKey },
      });
      const dataPractice = await resPractice.json();

      if (dataAppts.success) {
        setAppointments(dataAppts.data || []);
        setPatient(dataAppts.patient || { name: "Patient INFC" });
        if (dataPractice.success) {
          setPracticeInfo(dataPractice.data);
        }
        setView("dashboard");
      } else {
        // Token might be expired
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setView("login");
        showToast("⚠️ Session expirée", "Veuillez vous reconnecter.");
      }
    } catch (err) {
      console.error("Error loading portal dashboard:", err);
      setView("login");
      showToast("❌ Erreur de connexion", "Impossible de charger vos données.");
    }
  };

  // Auth: Start challenge
  const handleAuthInit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAction(true);

    try {
      const payload: any = { method: activeTab };
      if (activeTab === "phone") {
        if (!phone.trim()) return;
        payload.phone = phone.trim();
      } else if (activeTab === "email") {
        if (!email.trim()) return;
        payload.email = email.trim();
        // Determine callback return url
        payload.returnUrl = typeof window !== "undefined" ? window.location.href : "/portal";
      }

      const res = await fetch(`${apiBaseUrl}/api/v1/portal/auth/init`, {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIsLoadingAction(false);

      if (data.success) {
        if (activeTab === "phone") {
          setChallengeId(data.challengeId);
          setView("otp");
          showToast("📲 Code Envoyé", "Un code de vérification a été envoyé sur votre téléphone.");
        } else {
          showToast("📧 Lien Envoyé", "Un lien d'accès a été envoyé sur votre boîte email.");
        }
      } else {
        showToast("⚠️ Échec de connexion", data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      setIsLoadingAction(false);
      showToast("❌ Erreur", "Impossible de se connecter au serveur d'authentification.");
    }
  };

  // Auth: Verify challenge (Phone OTP or Booking Ref)
  const handleAuthVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAction(true);

    try {
      let payload: any = {};
      if (view === "otp") {
        payload = {
          method: "phone",
          challengeId,
          code: otpCode.trim(),
        };
      } else if (activeTab === "booking_ref") {
        payload = {
          method: "booking_ref",
          appointmentId: bookingRefApptId.trim(),
          phoneLast4: bookingRefPhoneSuffix.trim(),
        };
      }

      const res = await fetch(`${apiBaseUrl}/api/v1/portal/auth/verify`, {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIsLoadingAction(false);

      if (data.success && data.token) {
        setToken(data.token);
        sessionStorage.setItem(TOKEN_KEY, data.token);
        setPatient(data.patient || { name: "Patient INFC" });
        showToast("✅ Authentifié", `Ravi de vous revoir, ${data.patient?.name || "Patient"}.`);
        fetchDashboardData(data.token);
      } else {
        showToast("⚠️ Code ou identifiant incorrect", data.error || "La vérification a échoué.");
      }
    } catch (err) {
      setIsLoadingAction(false);
      showToast("❌ Erreur", "Impossible de valider vos identifiants.");
    }
  };

  // Action: Logout
  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setPatient(null);
    setAppointments([]);
    setView("login");
    showToast("👋 Déconnecté", "Vous vous êtes déconnecté avec succès.");
  };

  // Action: Cancel Appointment
  const handleCancelAppointment = async (apptId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) return;
    setIsLoadingAction(true);

    try {
      const res = await fetch(`${apiBaseUrl}/api/v1/portal/appointments`, {
        method: "PATCH",
        headers: {
          "X-API-KEY": apiKey,
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: apptId,
          action: "cancel",
        }),
      });

      const data = await res.json();
      setIsLoadingAction(false);

      if (data.success) {
        showToast("✅ Annulé", "Votre séance a été annulée avec succès.");
        if (token) fetchDashboardData(token);
      } else {
        showToast("⚠️ Erreur", data.error || "Impossible d'annuler la séance.");
      }
    } catch (err) {
      setIsLoadingAction(false);
      showToast("❌ Erreur", "Une erreur est survenue lors de l'annulation.");
    }
  };

  // Action: Load Rescheduling Slots
  const handleSelectRescheduleDate = async (dateStr: string) => {
    setRescheduleDate(dateStr);
    setSelectedSlot(null);
    try {
      const res = await fetch(`${apiBaseUrl}/api/v1/portal/availability?date=${dateStr}`, {
        headers: { "X-API-KEY": apiKey },
      });
      const data = await res.json();
      if (data.success) {
        setAvailableSlots(data.slots || []);
      } else {
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error("Failed to load availability slots:", err);
      setAvailableSlots([]);
    }
  };

  // Action: Open Rescheduling Modal
  const openRescheduleModal = (apptId: string) => {
    setRescheduleApptId(apptId);
    setShowRescheduleModal(true);
    setSelectedSlot(null);
    setAvailableSlots([]);
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    handleSelectRescheduleDate(dateStr);
  };

  // Action: Submit Rescheduling
  const handleRescheduleSubmit = async () => {
    if (!rescheduleApptId || !rescheduleDate || !selectedSlot) return;
    setIsLoadingAction(true);

    try {
      const res = await fetch(`${apiBaseUrl}/api/v1/portal/appointments`, {
        method: "PATCH",
        headers: {
          "X-API-KEY": apiKey,
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: rescheduleApptId,
          action: "reschedule",
          newDate: rescheduleDate,
          newTime: selectedSlot,
        }),
      });

      const data = await res.json();
      setIsLoadingAction(false);

      if (data.success) {
        showToast("✅ Séance Déplacée", "Votre entraînement a été reprogrammé avec succès.");
        setShowRescheduleModal(false);
        if (token) fetchDashboardData(token);
      } else {
        showToast("⚠️ Erreur", data.error || "Impossible de déplacer la séance.");
      }
    } catch (err) {
      setIsLoadingAction(false);
      showToast("❌ Erreur", "Une erreur est survenue lors du déplacement.");
    }
  };

  // Action: Submit Intake Form
  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intakeConsent) {
      alert("Vous devez accepter les conditions pour soumettre le bilan.");
      return;
    }
    setIsLoadingAction(true);

    try {
      const res = await fetch(`${apiBaseUrl}/api/v1/portal/intake`, {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sleepQuality: intakeSleep,
          stressLevel: intakeStress,
          medicalHistory: intakeHistory,
          consent: true,
        }),
      });

      const data = await res.json();
      setIsLoadingAction(false);

      if (data.success) {
        showToast("✅ Bilan Enregistré", "Vos réponses ont été transmises à votre praticien certifié.");
        setView("dashboard");
        if (token) fetchDashboardData(token);
      } else {
        showToast("⚠️ Échec", data.error || "Erreur de soumission du formulaire.");
      }
    } catch (err) {
      setIsLoadingAction(false);
      showToast("❌ Erreur", "Erreur réseau lors de la soumission.");
    }
  };

  // Helper: Get next 7 days formatted for reschedule buttons
  const getNext7Days = () => {
    const list = [];
    const weekdays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];
    
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      
      list.push({
        dateStr: `${yyyy}-${mm}-${dd}`,
        dayName: weekdays[d.getDay()],
        dayNum: d.getDate(),
        monthName: months[d.getMonth()],
      });
    }
    return list;
  };

  // Localized wording logic
  const word = (fr: string, ar: string, en: string = fr) => {
    return locale === "ar" ? ar : locale === "en" ? en : fr;
  };

  // 1. Loading View
  if (view === "loading") {
    return (
      <>
        <Header />
        <main className="section bg-creme" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div className="spinner" style={{
              width: "50px",
              height: "50px",
              border: "5px solid rgba(212,175,55,0.1)",
              borderTop: "5px solid var(--color-gold)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px"
            }} />
            <p style={{ fontWeight: 600, color: "var(--color-navy)" }}>{word("Chargement de votre espace sécurisé...", "جاري تحميل فضائكم الآمن...")}</p>
          </div>
          <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }` }} />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-creme" style={{ minHeight: "85vh", padding: "40px 0" }}>
        
        {/* CSS STYLING ENHANCEMENT */}
        <style dangerouslySetInnerHTML={{ __html: `
          .portal-card {
            background: #fff;
            border-radius: var(--radius-lg);
            padding: 30px;
            box-shadow: var(--shadow-soft);
            border: 1px solid rgba(10, 22, 40, 0.03);
          }
          .portal-title {
            font-family: var(--font-heading);
            font-size: 2.2rem;
            color: var(--color-navy);
            font-weight: 800;
            margin-bottom: 8px;
          }
          .portal-subtitle {
            color: var(--color-grey-text);
            margin-bottom: 30px;
            font-size: 1rem;
          }
          .auth-tabs {
            display: flex;
            background: rgba(10, 22, 40, 0.04);
            border-radius: 30px;
            padding: 4px;
            margin-bottom: 25px;
          }
          .auth-tab {
            flex: 1;
            padding: 10px 15px;
            border-radius: 25px;
            border: none;
            background: transparent;
            font-weight: 600;
            font-size: 0.88rem;
            cursor: pointer;
            color: var(--color-navy);
            transition: all 0.3s ease;
            text-align: center;
          }
          .auth-tab.active {
            background: var(--color-navy);
            color: #fff;
            box-shadow: 0 4px 10px rgba(10, 22, 40, 0.1);
          }
          .form-group {
            margin-bottom: 20px;
          }
          .form-group label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 0.88rem;
            color: var(--color-navy);
          }
          .form-control {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid rgba(10, 22, 40, 0.12);
            border-radius: var(--radius-sm);
            font-size: 0.95rem;
            outline: none;
            transition: all 0.3s;
          }
          .form-control:focus {
            border-color: var(--color-gold);
            box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
          }
          .dashboard-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
            max-width: var(--container-max);
            margin: 0 auto;
            padding: 0 var(--spacing-md);
          }
          @media (max-width: 992px) {
            .dashboard-grid {
              grid-template-columns: 1fr;
            }
          }
          .session-card {
            background: #fff;
            border: 1px solid rgba(10,22,40,0.06);
            border-radius: var(--radius-md);
            padding: 20px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .session-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.02);
          }
          .session-date {
            background: rgba(212, 175, 55, 0.08);
            color: #b45309;
            padding: 10px 15px;
            border-radius: var(--radius-sm);
            text-align: center;
            font-weight: 700;
            min-width: 80px;
          }
          .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(10,22,40,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
          }
          .modal-box {
            background: #fff;
            border-radius: var(--radius-lg);
            width: 100%;
            max-width: 500px;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            position: relative;
          }
          .slots-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 10px;
            margin-top: 15px;
          }
          .slot-btn {
            background: var(--color-creme);
            border: 1px solid rgba(10,22,40,0.08);
            border-radius: 8px;
            padding: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
          }
          .slot-btn:hover {
            border-color: var(--color-gold);
            background: rgba(212,175,55,0.05);
          }
          .slot-btn.active {
            background: var(--color-gold);
            color: var(--color-navy);
            border-color: var(--color-gold);
          }
          .wizard-steps {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            position: relative;
          }
          .wizard-steps::before {
            content: "";
            position: absolute;
            top: 20px; left: 0; right: 0; height: 2px;
            background: rgba(10,22,40,0.08);
            z-index: 1;
          }
          .wizard-step {
            width: 40px; height: 40px;
            border-radius: 50%;
            background: #fff;
            border: 2px solid rgba(10,22,40,0.08);
            display: flex; align-items: center; justify-content: center;
            font-weight: 700; z-index: 2;
            transition: all 0.3s;
          }
          .wizard-step.active {
            background: var(--color-gold);
            border-color: var(--color-gold);
            color: var(--color-navy);
            box-shadow: 0 4px 10px rgba(212,175,55,0.2);
          }
        `}} />

        {/* 2. Login View */}
        {view === "login" && (
          <div className="container" style={{ maxWidth: "550px" }}>
            <div className="portal-card">
              <h1 className="portal-title" style={{ textAlign: "center" }}>
                {word("Espace Patient INFC", "فضاء المريض INFC")}
              </h1>
              <p className="portal-subtitle" style={{ textAlign: "center" }}>
                {word("Accédez à vos rendez-vous de neurofeedback et complétez vos questionnaires.", "الولوج إلى مواعيد النيوروفيدباك الخاصة بكم وملء استبياناتكم.")}
              </p>

              {/* Login Tabs */}
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${activeTab === "phone" ? "active" : ""}`}
                  onClick={() => setActiveTab("phone")}
                >
                  💬 {word("Téléphone", "الهاتف")}
                </button>
                <button
                  className={`auth-tab ${activeTab === "email" ? "active" : ""}`}
                  onClick={() => setActiveTab("email")}
                >
                  ✉️ Email
                </button>
                <button
                  className={`auth-tab ${activeTab === "booking_ref" ? "active" : ""}`}
                  onClick={() => setActiveTab("booking_ref")}
                >
                  🔑 {word("Référence", "المرجع")}
                </button>
              </div>

              {/* Auth Initial challenge Form */}
              {(activeTab === "phone" || activeTab === "email") && (
                <form onSubmit={handleAuthInit}>
                  {activeTab === "phone" ? (
                    <div className="form-group">
                      <label htmlFor="phoneNum">{word("Numéro de Téléphone (avec code pays)", "رقم الهاتف (مع رمز البلد)")}</label>
                      <input
                        type="tel"
                        id="phoneNum"
                        className="form-control"
                        placeholder="Ex: +212661234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                      <small style={{ color: "var(--color-grey-text)", display: "block", marginTop: "5px" }}>
                        {word("Nous vous enverrons un code d'accès temporaire par SMS ou WhatsApp.", "سنرسل لكم رمز ولوج مؤقت عبر رسالة قصيرة أو الواتساب.")}
                      </small>
                    </div>
                  ) : (
                    <div className="form-group">
                      <label htmlFor="emailAddr">Adresse Email</label>
                      <input
                        type="email"
                        id="emailAddr"
                        className="form-control"
                        placeholder="Ex: patient@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <small style={{ color: "var(--color-grey-text)", display: "block", marginTop: "5px" }}>
                        {word("Nous vous enverrons un lien magique d'accès rapide.", "سنرسل لكم رابطًا سحريًا للولوج السريع.")}
                      </small>
                    </div>
                  )}

                  <button type="submit" className="btn btn-navy" style={{ width: "100%", marginTop: "10px" }} disabled={isLoadingAction}>
                    {isLoadingAction ? word("Envoi en cours...", "جاري الإرسال...") : word("Recevoir mes identifiants ➔", "الحصول على بيانات الولوج ➔")}
                  </button>
                </form>
              )}

              {/* Booking Ref login Form */}
              {activeTab === "booking_ref" && (
                <form onSubmit={handleAuthVerify}>
                  <div className="form-group">
                    <label htmlFor="apptId">{word("Numéro ou ID du Rendez-vous", "رقم أو معرف الموعد")}</label>
                    <input
                      type="text"
                      id="apptId"
                      className="form-control"
                      placeholder="Ex: appt_abc123"
                      value={bookingRefApptId}
                      onChange={(e) => setBookingRefApptId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phoneLast4">{word("4 derniers chiffres de votre téléphone", "آخر 4 أرقام من هاتفكم")}</label>
                    <input
                      type="text"
                      id="phoneLast4"
                      className="form-control"
                      placeholder="Ex: 4567"
                      maxLength={4}
                      value={bookingRefPhoneSuffix}
                      onChange={(e) => setBookingRefPhoneSuffix(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-navy" style={{ width: "100%", marginTop: "10px" }} disabled={isLoadingAction}>
                    {isLoadingAction ? word("Vérification...", "جاري التحقق...") : word("Accéder au rendez-vous ➔", "الولوج إلى الموعد ➔")}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 3. OTP Code Verification View */}
        {view === "otp" && (
          <div className="container" style={{ maxWidth: "450px" }}>
            <div className="portal-card">
              <h1 className="portal-title" style={{ textAlign: "center" }}>
                {word("Saisir le Code", "أدخل الرمز")}
              </h1>
              <p className="portal-subtitle" style={{ textAlign: "center" }}>
                {word("Entrez le code de sécurité reçu sur votre téléphone.", "أدخل رمز الأمان المستلم على هاتفكم.")}
              </p>

              <form onSubmit={handleAuthVerify}>
                <div className="form-group">
                  <label htmlFor="otpInput" style={{ textAlign: "center", display: "block" }}>{word("Code à 6 chiffres", "الرمز المكون من 6 أرقام")}</label>
                  <input
                    type="text"
                    id="otpInput"
                    className="form-control"
                    placeholder="123456"
                    maxLength={6}
                    style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "8px", fontWeight: "bold" }}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-navy" style={{ width: "100%", marginTop: "10px" }} disabled={isLoadingAction}>
                  {isLoadingAction ? word("Validation...", "جاري التحقق...") : word("Valider le code ➔", "تأكيد الرمز ➔")}
                </button>
                <button type="button" className="btn btn-outline" style={{ width: "100%", marginTop: "10px" }} onClick={() => setView("login")}>
                  {word("Retour", "العودة")}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 4. Dashboard View */}
        {view === "dashboard" && (
          <div className="dashboard-grid">
            
            {/* Main panel */}
            <div>
              <div className="portal-card" style={{ marginBottom: "25px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem" }}>
                      {word("Bonjour,", "مرحباً،")} <span className="text-gold">{patient?.name}</span>
                    </h2>
                    <p style={{ color: "var(--color-grey-text)", fontSize: "0.95rem" }}>
                      {word("Consultez et modifiez les horaires de vos prochains entraînements cérébraux.", "اطلع وعدل أوقات حصص تدريب الدماغ القادمة.")}
                    </p>
                  </div>
                  <button className="btn btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }} onClick={handleLogout}>
                    🚪 {word("Déconnexion", "تسجيل الخروج")}
                  </button>
                </div>
              </div>

              {/* Appointments list */}
              <div className="portal-card">
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  🗓️ {word("Vos Séances", "حصصكم المبرمجة")}
                </h3>
                
                {appointments.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "45px 20px", color: "var(--color-grey-text)" }}>
                    <p style={{ marginBottom: "15px" }}>{word("Vous n'avez aucun rendez-vous planifié.", "ليس لديكم أي موعد مبرمج حالياً.")}</p>
                    <a href="/fr/centres" className="btn btn-gold">
                      ➕ {word("Prendre rendez-vous", "حجز موعد جديد")}
                    </a>
                  </div>
                ) : (
                  appointments.map((appt) => {
                    const isCancelled = appt.status === "cancelled";
                    const isPast = new Date(`${appt.date}T${appt.time}`) < new Date();
                    
                    return (
                      <div key={appt.id} className="session-card" style={{ opacity: isCancelled ? 0.6 : 1 }}>
                        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                          <div className="session-date">
                            {appt.date.split("-")[2]}
                            <div style={{ fontSize: "0.7rem", fontWeight: "normal", textTransform: "uppercase" }}>
                              {new Date(appt.date).toLocaleDateString("fr-FR", { month: "short" })}
                            </div>
                          </div>
                          <div>
                            <h4 style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                              {appt.serviceName || "Séance Neurofeedback"}
                            </h4>
                            <p style={{ fontSize: "0.85rem", color: "var(--color-grey-text)" }}>
                              🕒 <strong>{appt.time}</strong> • 📍 {appt.branchName || "INFC Casablanca"}
                            </p>
                            {appt.providerName && (
                              <p style={{ fontSize: "0.8rem", color: "var(--color-grey-text)" }}>
                                👤 Praticien: {appt.providerName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="btn-group" style={{ display: "flex", gap: "8px" }}>
                          {!isCancelled && !isPast && (
                            <>
                              <button className="btn btn-outline" style={{ padding: "8px 16px", fontSize: "0.8rem" }} onClick={() => openRescheduleModal(appt.id)}>
                                🔄 {word("Déplacer", "تعديل الوقت")}
                              </button>
                              <button className="btn btn-navy" style={{ padding: "8px 16px", fontSize: "0.8rem", background: "#ef4444" }} onClick={() => handleCancelAppointment(appt.id)}>
                                🗑️ {word("Annuler", "إلغاء")}
                              </button>
                            </>
                          )}
                          {isCancelled && (
                            <span style={{ fontSize: "0.8rem", color: "#ef4444", fontWeight: "bold", textTransform: "uppercase" }}>
                              ❌ {word("Annulé", "ملغي")}
                            </span>
                          )}
                          {isPast && !isCancelled && (
                            <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: "bold", textTransform: "uppercase" }}>
                              ✓ {word("Effectué", "منجز")}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside>
              {/* Profile details */}
              <div className="portal-card" style={{ marginBottom: "25px" }}>
                <h3 style={{ fontSize: "1.15rem", marginBottom: "15px" }}>👤 {word("Dossier Patient", "ملف المريض")}</h3>
                <div style={{ fontSize: "0.9rem", lineHeight: "1.8" }}>
                  <p><strong>{word("Nom :", "الاسم :")}</strong> {patient?.name}</p>
                  {patient?.phone && <p><strong>{word("Tél :", "الهاتف :")}</strong> {patient.phone}</p>}
                  {patient?.email && <p><strong>{word("Email :", "البريد :")}</strong> {patient.email}</p>}
                </div>
              </div>

              {/* Intake form promo */}
              <div className="portal-card" style={{ background: "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)", color: "#fff" }}>
                <h3 style={{ fontSize: "1.15rem", color: "var(--color-gold)", marginBottom: "10px" }}>🧠 {word("Bilan Neuro-Sensible", "التقييم العصبي الحسي")}</h3>
                <p style={{ fontSize: "0.85rem", opacity: 0.9, marginBottom: "20px", color: "#fff" }}>
                  {word("Complétez votre bilan de santé cérébrale initial pour permettre à votre praticien d'adapter vos séances.", "أكمل تقييمك الأولي لمساعدة الأخصائي على ملاءمة حصصك.")}
                </p>
                <button className="btn btn-gold" style={{ width: "100%", fontSize: "0.9rem" }} onClick={() => { setView("intake"); setIntakeStep(1); }}>
                  📋 {word("Remplir le bilan ➔", "ملء التقييم ➔")}
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* 5. Intake Form Wizard View */}
        {view === "intake" && (
          <div className="container" style={{ maxWidth: "700px" }}>
            <div className="portal-card">
              <h1 className="portal-title" style={{ textAlign: "center" }}>
                {word("Bilan Initial Neuro-Sensible", "التقييم الأولي العصبي الحسي")}
              </h1>
              <p className="portal-subtitle" style={{ textAlign: "center" }}>
                {word("Ces questions confidentielles aident à structurer vos séances de régulation.", "تساعد هذه الأسئلة السرية على تخطيط حصصكم.")}
              </p>

              {/* Steps Progress bar */}
              <div className="wizard-steps">
                <div className={`wizard-step ${intakeStep >= 1 ? "active" : ""}`}>1</div>
                <div className={`wizard-step ${intakeStep >= 2 ? "active" : ""}`}>2</div>
                <div className={`wizard-step ${intakeStep >= 3 ? "active" : ""}`}>3</div>
              </div>

              <form onSubmit={handleIntakeSubmit}>
                
                {/* Step 1: Sleep & Fatigue */}
                {intakeStep === 1 && (
                  <div>
                    <h3 style={{ marginBottom: "15px" }}>💤 {word("Qualité de Sommeil & Somatisation", "جودة النوم")}</h3>
                    <div className="form-group">
                      <label>{word("Comment qualifiez-vous le sommeil de votre enfant ?", "كيف تقيمون نوم طفلكم؟")}</label>
                      <select className="form-control" value={intakeSleep} onChange={(e) => setIntakeSleep(e.target.value)}>
                        <option value="tres_bon">{word("Très bon", "ممتاز")}</option>
                        <option value="moyen">{word("Moyen / Réveils fréquents", "متوسط / استيقاظ متكرر")}</option>
                        <option value="mauvais">{word("Difficile / Insomnies", "صعب / أرق")}</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>{word("Niveau de stress scolaire estimé (1-10)", "مستوى القلق المدرسي المتوقع (1-10)")}</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        className="form-control"
                        value={intakeStress}
                        onChange={(e) => setIntakeStress(e.target.value)}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--color-grey-text)" }}>
                        <span>1 - Calme</span>
                        <span style={{ fontWeight: "bold", color: "var(--color-gold)", fontSize: "1.1rem" }}>{intakeStress} / 10</span>
                        <span>10 - Anxiété Intense</span>
                      </div>
                    </div>
                    <button type="button" className="btn btn-navy" style={{ width: "100%", marginTop: "15px" }} onClick={() => setIntakeStep(2)}>
                      {word("Étape Suivante ➔", "الخطوة التالية ➔")}
                    </button>
                  </div>
                )}

                {/* Step 2: History & Objectives */}
                {intakeStep === 2 && (
                  <div>
                    <h3 style={{ marginBottom: "15px" }}>🎯 {word("Symptômes & Objectifs d'Entraînement", "الأعراض والأهداف")}</h3>
                    <div className="form-group">
                      <label htmlFor="historyInput">{word("Quelles difficultés souhaitez-vous réguler en priorité ? (Concentration, tics, anxiété...)", "ما هي الصعوبات التي ترغبون في تنظيمها كأولوية؟ (التركيز، التوتر، الأرق...)")}</label>
                      <textarea
                        id="historyInput"
                        rows={5}
                        className="form-control"
                        placeholder="Ex: Difficultés à s'endormir la veille de contrôles, manque de confiance lors des examens..."
                        value={intakeHistory}
                        onChange={(e) => setIntakeHistory(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIntakeStep(1)}>
                        {word("Retour", "العودة")}
                      </button>
                      <button type="button" className="btn btn-navy" style={{ flex: 1 }} onClick={() => setIntakeStep(3)}>
                        {word("Suivant", "التالي")}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Consent */}
                {intakeStep === 3 && (
                  <div>
                    <h3 style={{ marginBottom: "15px" }}>⚖️ {word("Consentement & Engagement", "الموافقة والالتزام")}</h3>
                    <p style={{ fontSize: "0.9rem", color: "var(--color-grey-text)", marginBottom: "20px" }}>
                      {word("Le Neurofeedback NeurOptimal® est un entraînement cérébral d'auto-régulation. Il ne constitue pas un acte médical et ne remplace aucun traitement prescrit par votre médecin.", "التدريب بالنيوروفيدباك هو تمرين لتنظيم الدماغ الذاتي. لا يعد إجراء طبياً ولا يعوض أي علاج طبي.")}
                    </p>
                    <div className="form-group">
                      <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          style={{ marginTop: "4px", transform: "scale(1.2)" }}
                          checked={intakeConsent}
                          onChange={(e) => setIntakeConsent(e.target.checked)}
                          required
                        />
                        <span>{word("J'accepte et confirme l'exactitude des informations fournies.", "أوافق وأؤكد صحة المعلومات المقدمة.")}</span>
                      </label>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIntakeStep(2)}>
                        {word("Retour", "العودة")}
                      </button>
                      <button type="submit" className="btn btn-navy" style={{ flex: 1 }} disabled={isLoadingAction}>
                        {isLoadingAction ? word("Enregistrement...", "جاري الحفظ...") : word("Soumettre le bilan ✓", "إرسال التقييم ✓")}
                      </button>
                    </div>
                  </div>
                )}

                <button type="button" className="btn btn-outline" style={{ width: "100%", marginTop: "20px", border: "none" }} onClick={() => setView("dashboard")}>
                  {word("Annuler et retourner au tableau de bord", "إلغاء والعودة لفضائي")}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 6. Reschedule Appointment Modal */}
        {showRescheduleModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", marginBottom: "15px" }}>
                🔄 {word("Déplacer la Séance", "تعديل وقت الحصة")}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--color-grey-text)", marginBottom: "20px" }}>
                {word("Sélectionnez une nouvelle date pour charger les créneaux disponibles.", "اختر تاريخاً جديداً لرؤية الأوقات المتوفرة.")}
              </p>

              {/* Day selection chips */}
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "20px" }}>
                {getNext7Days().map((day) => (
                  <button
                    key={day.dateStr}
                    style={{
                      background: rescheduleDate === day.dateStr ? "var(--color-gold)" : "#fff",
                      border: "1px solid " + (rescheduleDate === day.dateStr ? "var(--color-gold)" : "rgba(10,22,40,0.1)"),
                      borderRadius: "8px",
                      padding: "8px 12px",
                      textAlign: "center",
                      cursor: "pointer",
                      minWidth: "60px",
                      transition: "all 0.2s"
                    }}
                    onClick={() => handleSelectRescheduleDate(day.dateStr)}
                  >
                    <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: rescheduleDate === day.dateStr ? "var(--color-navy)" : "var(--color-grey-text)" }}>{day.dayName}</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-navy)" }}>{day.dayNum}</div>
                    <div style={{ fontSize: "0.6rem", color: rescheduleDate === day.dateStr ? "var(--color-navy)" : "var(--color-grey-text)" }}>{day.monthName}</div>
                  </button>
                ))}
              </div>

              {/* Slots display */}
              {availableSlots.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--color-grey-text)", padding: "20px 0", fontSize: "0.9rem" }}>
                  🚫 {word("Aucun créneau libre à cette date.", "لا توجد أوقات متوفرة في هذا التاريخ.")}
                </div>
              ) : (
                <div className="slots-grid">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      className={`slot-btn ${selectedSlot === slot ? "active" : ""}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowRescheduleModal(false)}>
                  {word("Retour", "إلغاء")}
                </button>
                <button
                  className="btn btn-navy"
                  style={{ flex: 1 }}
                  disabled={!selectedSlot || isLoadingAction}
                  onClick={handleRescheduleSubmit}
                >
                  {isLoadingAction ? word("Enregistrement...", "جاري الحفظ...") : word("Confirmer ✓", "حفظ التعديل ✓")}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Toast popup */}
      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <Footer />
    </>
  );
}
