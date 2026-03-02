import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Text, Float, Html } from "@react-three/drei";
import { PAGES } from "../constants";
import * as THREE from "three";
import { FallbackScene } from "./FallbackScene";
import { 
  BarterStage, 
  DeptStoreStage, 
  SupermarketStage, 
  EcommerceStage, 
  NewRetailStage, 
  ImpactStage, 
  TheoryStage, 
  FutureStage,
  LogoCloud,
  TransitionStage,
  SelfServiceStage
} from "./Stages";

interface ExperienceProps {
  currentPage: number;
  forceFallback?: boolean;
}

const Loader = () => (
  <Html center>
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-emerald-500 font-mono text-xs tracking-widest uppercase">Initializing 3D Assets...</p>
    </div>
  </Html>
);

const SceneContent: React.FC<ExperienceProps> = ({ currentPage }) => {
  const page = PAGES[currentPage];
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame((state) => {
    // Background color transition
    const targetColor = new THREE.Color(page.bgColor);
    state.scene.background = (state.scene.background as THREE.Color || new THREE.Color()).lerp(targetColor, 0.05);

    // Dynamic Camera Positioning
    if (cameraRef.current) {
      let targetPos = new THREE.Vector3(0, 2, 10);
      if (page.isTransition) targetPos.set(0, 0, 20);
      else if (currentPage >= 14 && currentPage <= 15) targetPos.set(0, 5, 12); // Theory stages
      else if (currentPage === 17) targetPos.set(0, 0, 15); // Future stage
      
      cameraRef.current.position.lerp(targetPos, 0.05);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 2, 10]} fov={50} />
      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.8} 
        autoRotate={currentPage === 16 || page.isTransition}
        autoRotateSpeed={0.5}
      />
      
      <ambientLight intensity={1.0} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      
      <Suspense fallback={<Loader />}>
        <group>
          {page.isTransition && <TransitionStage />}
          
          {currentPage === 0 && (
            <>
              <group>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                    <planeGeometry args={[30, 30]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
                <Text position={[0, 1, 0]} fontSize={1.5} color="white">
                  RETAIL EXPLORATION
                </Text>
                <Text position={[0, 0, 0]} fontSize={0.5} color="#10b981" fillOpacity={0.8}>
                  商业文明的时光穿梭机
                </Text>
              </group>
              <LogoCloud active={true} />
            </>
          )}

          {/* History Stages */}
          {currentPage === 2 && <BarterStage active={true} />}
          {currentPage === 3 && <DeptStoreStage active={true} />}
          {currentPage === 4 && <SelfServiceStage active={true} />}
          {currentPage === 5 && <SupermarketStage active={true} />}
          {currentPage === 6 && <EcommerceStage active={true} />}
          {currentPage === 7 && <NewRetailStage active={true} />}
          
          {/* Impact Stages */}
          {currentPage === 9 && <ImpactStage type="industry" />}
          {currentPage === 10 && <ImpactStage type="logistics" />}
          {currentPage === 11 && <ImpactStage type="employment" />}
          {currentPage === 12 && <ImpactStage type="economy" />}
          
          {/* Theory Stages */}
          {currentPage === 14 && <TheoryStage type="wheel" />}
          {currentPage === 15 && <TheoryStage type="accordion" />}
          
          {/* Future Stage */}
          {currentPage === 17 && <FutureStage />}
        </group>
      </Suspense>
    </>
  );
};

export const Scene: React.FC<ExperienceProps> = ({ currentPage, forceFallback }) => {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    // WebGL support detection
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(!!gl);
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  if (webglSupported === false || contextLost || forceFallback) {
    return <FallbackScene currentPage={currentPage} />;
  }

  // Still detecting
  if (webglSupported === null) {
    return <div className="fixed inset-0 bg-black" />;
  }

  return (
    <div className="fixed inset-0 bg-black">
      <Canvas 
        dpr={1} // Fixed DPR 1 for maximum performance
        gl={{ 
          antialias: false, 
          alpha: false,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: true,
          stencil: false, // Disable stencil for performance
          depth: true
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', () => setContextLost(true));
        }}
        onError={() => setWebglSupported(false)}
      >
        <SceneContent currentPage={currentPage} />
      </Canvas>
    </div>
  );
};
