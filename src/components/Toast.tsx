"use client";

import React, { useEffect } from "react";

interface ToastProps {
  show: boolean;
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ show, title, message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideInToast {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}} />
      <div
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          background: "#0A1628",
          color: "#fff",
          padding: "16px 24px",
          borderRadius: "10px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
          borderLeft: "4px solid #D4AF37",
          zIndex: 9999,
          fontFamily: "Inter, sans-serif",
          fontSize: "0.9rem",
          fontWeight: 600,
          animation: "slideInToast 0.3s ease forwards",
        }}
      >
        <span style={{ color: "#D4AF37", marginRight: "8px" }}>★</span>
        <strong>{title}</strong> — {message}
      </div>
    </>
  );
}
