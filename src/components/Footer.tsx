"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/context/LanguageContext";

export default function Footer() {
  const { t, locale } = useTranslation();

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Image
              src="/assets/logos/logowhite.png"
              alt="INFC Logo"
              width={156}
              height={40}
              unoptimized
              style={{ height: "40px", width: "auto", marginBottom: "1rem" }}
            />
            <p>{t("footer.desc")}</p>
          </div>
          <div className="footer-col">
            <h3>{t("footer.programmes")}</h3>
            <ul>
              <li>
                <Link href={`/${locale}/programmes#persona-parents`} prefetch={false}>
                  {t("footer.programmesList.parents")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/programmes#persona-performers`} prefetch={false}>
                  {t("footer.programmesList.performers")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/programmes#persona-adults`} prefetch={false}>
                  {t("footer.programmesList.adults")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/programmes#persona-trauma`} prefetch={false}>
                  {t("footer.programmesList.trauma")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>{t("footer.centres")}</h3>
            <ul>
              <li>
                <Link href={`/${locale}/centres#centre-casablanca`} prefetch={false}>
                  {t("footer.centresList.casablanca")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/centres#centre-marrakech`} prefetch={false}>
                  {t("footer.centresList.marrakech")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/centres#centre-kenitra`} prefetch={false}>
                  {t("footer.centresList.kenitra")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/centres#centre-tanger`} prefetch={false}>
                  {t("footer.centresList.tanger")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>{t("footer.contact")}</h3>
            <p style={{ marginBottom: "0.5rem" }}>
              📍 {t("footer.address")}
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              📞 <a href="tel:0522991783">0522991783</a>
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              ✉️ <a href="mailto:contact@neurofeedback.ma">contact@neurofeedback.ma</a>
            </p>
            <p style={{ marginTop: "1rem" }}>
              <Link href={`/${locale}/contact`} prefetch={false} style={{ color: "var(--color-gold)", fontWeight: 600 }}>
                {t("footer.contactLink")}
              </Link>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} International Neurofeedback Center. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
