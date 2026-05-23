"use client";

import React from "react";

type CenterName = "Tanger" | "Kénitra" | "Casablanca" | "Marrakech";

const idMap: Record<CenterName, string> = {
  Tanger: "centre-tanger",
  Kénitra: "centre-kenitra",
  Casablanca: "centre-casablanca",
  Marrakech: "centre-marrakech",
};

export default function MoroccoMap() {
  const handlePinClick = (name: CenterName) => {
    const targetId = idMap[name];
    const element = document.getElementById(targetId);

    if (element) {
      // Smooth scroll to the centre details block
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      // Add highlight animation class
      element.classList.add("highlighted");

      // Remove highlight animation class after 2.5s
      setTimeout(() => {
        element.classList.remove("highlighted");
      }, 2500);
    }
  };

  return (
    <div className="custom-map-wrapper">
      <div className="morocco-map-container">
        <img
          src="/assets/images/morocco-map.jpg"
          alt="Carte du Maroc INFC"
          className="morocco-map-img"
        />

        {/* Tanger Marker */}
        <div
          className="map-marker"
          style={{ top: "10%", left: "68%" }}
          onClick={() => handlePinClick("Tanger")}
        >
          <span className="marker-pulse"></span>
          <span className="marker-dot"></span>
          <span className="marker-label">Tanger</span>
        </div>

        {/* Kénitra Marker */}
        <div
          className="map-marker"
          style={{ top: "21%", left: "63%" }}
          onClick={() => handlePinClick("Kénitra")}
        >
          <span className="marker-pulse"></span>
          <span className="marker-dot"></span>
          <span className="marker-label">Kénitra</span>
        </div>

        {/* Casablanca Marker */}
        <div
          className="map-marker"
          style={{ top: "29%", left: "54%" }}
          onClick={() => handlePinClick("Casablanca")}
        >
          <span className="marker-pulse"></span>
          <span className="marker-dot"></span>
          <span className="marker-label">Casablanca</span>
        </div>

        {/* Marrakech Marker */}
        <div
          className="map-marker"
          style={{ top: "44%", left: "45%" }}
          onClick={() => handlePinClick("Marrakech")}
        >
          <span className="marker-pulse"></span>
          <span className="marker-dot"></span>
          <span className="marker-label">Marrakech</span>
        </div>
      </div>
    </div>
  );
}
