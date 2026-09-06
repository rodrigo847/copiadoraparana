"use client";

import { useEffect, useState } from "react";

const serviceLabels = [
  "Impressão Laser",
  "Comunicação Visual",
  "Gráfica Rápida",
  "Adesivos Personalizados",
  "Plotagem",
  "Brindes e DTF",
];

const faceColors = ["blue", "yellow", "red", "green", "orange", "white"];

export function ServiceCube() {
  const [activeLabel, setActiveLabel] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveLabel((currentLabel) => (currentLabel + 1) % serviceLabels.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="service-cube-intro" aria-live="polite">
      <div className="service-cube-scene" aria-hidden="true">
        <div className="service-cube">
          {faceColors.map((color) => (
            <div key={color} className={`service-cube-face service-cube-face-${color}`}>
              {Array.from({ length: 9 }, (_, stickerIndex) => (
                <span key={stickerIndex} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="service-cube-copy">
        <span>Especialidades</span>
        <strong key={serviceLabels[activeLabel]}>{serviceLabels[activeLabel]}</strong>
      </div>
    </div>
  );
}
