import { useState, useEffect } from "react";
import { Scene } from "./components/Scene";
import { Overlay } from "./components/Overlay";

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLowPower, setIsLowPower] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('retail_low_power') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('retail_low_power', String(isLowPower));
  }, [isLowPower]);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Background */}
      <Scene currentPage={currentPage} forceFallback={isLowPower} />

      {/* UI Overlay */}
      <Overlay 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isLowPower={isLowPower}
        setIsLowPower={setIsLowPower}
      />
    </main>
  );
}
