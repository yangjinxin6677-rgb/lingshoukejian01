import { useState } from "react";
import { Scene } from "./components/Scene";
import { Overlay } from "./components/Overlay";

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Background */}
      <Scene currentPage={currentPage} />

      {/* UI Overlay */}
      <Overlay currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </main>
  );
}
