import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Box, Sphere, Cylinder, Float, Text, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// --- Transition Stage ---
export const TransitionStage: React.FC = () => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.002;
      group.current.rotation.x += 0.001;
    }
  });

  return (
    <group ref={group}>
      <Torus args={[10, 0.05, 8, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#10b981" transparent opacity={0.1} />
      </Torus>
      <Torus args={[8, 0.02, 6, 24]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#10b981" transparent opacity={0.05} />
      </Torus>
      <Sphere args={[0.1, 6, 6]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
      </Sphere>
    </group>
  );
};

// --- Logo Cloud Stage ---
export const LogoCloud: React.FC<{ active: boolean }> = ({ active }) => {
  const group = useRef<THREE.Group>(null);
  const [voted, setVoted] = useState(false);
  const animStartRef = useRef<number | null>(null);

  useEffect(() => {
    const handleVoted = () => {
      console.log("Retail voted event received!");
      setVoted(true);
    };
    window.addEventListener('retail-voted', handleVoted);
    return () => window.removeEventListener('retail-voted', handleVoted);
  }, []);

  const logos = useMemo(() => [
    { name: "沃尔玛", color: "#ffc220", targetPos: [3, 0, 0] },
    { name: "京东", color: "#e1251b", targetPos: [-3, 1, 2] },
    { name: "淘宝", color: "#ff5000", targetPos: [0, 2, -3] },
    { name: "亚马逊", color: "#ff9900", targetPos: [2, -1, -2] },
    { name: "阿里巴巴", color: "#ff6a00", targetPos: [-2, -2, 1] },
    { name: "开市客", color: "#005da4", targetPos: [4, 2, 1] },
  ], []);

  useFrame((state) => {
    if (voted && animStartRef.current === null) {
      animStartRef.current = state.clock.getElapsedTime();
    }

    if (group.current && animStartRef.current !== null) {
      const elapsed = state.clock.getElapsedTime() - animStartRef.current;
      group.current.children.forEach((child, i) => {
        if (i >= logos.length) return;
        const target = logos[i].targetPos;
        const delay = i * 0.15;
        const t = Math.max(0, Math.min(1, (elapsed - delay) * 1.5));
        
        // Falling effect: from y=10 to target y
        child.position.x = target[0];
        child.position.y = THREE.MathUtils.lerp(10, target[1], t);
        child.position.z = target[2];
        
        // Ensure no rotation
        child.rotation.set(0, 0, 0);
      });
    }
  });

  return (
    <group ref={group} visible={voted}>
      {logos.map((logo, i) => (
        <group key={i} position={[logo.targetPos[0], 10, logo.targetPos[2]]}>
          <Box args={[1.5, 0.8, 0.2]}>
            <meshStandardMaterial color={logo.color} emissive={logo.color} emissiveIntensity={0.5} />
          </Box>
          <Text
            position={[0, 0, 0.11]}
            fontSize={0.3}
            color="white"
          >
            {logo.name}
          </Text>
        </group>
      ))}
    </group>
  );
};

// --- Barter Stage ---
export const BarterStage: React.FC<{ active: boolean }> = ({ active }) => {
  const farmerRef = useRef<THREE.Group>(null);
  const artisanRef = useRef<THREE.Group>(null);
  const woolRef = useRef<THREE.Mesh>(null);
  const potRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (active) {
      const move = Math.sin(t * 1.5) * 1.5;
      if (farmerRef.current) farmerRef.current.position.x = -3 + Math.max(0, move);
      if (artisanRef.current) artisanRef.current.position.x = 3 - Math.max(0, move);
      
      if (move > 1) {
        if (woolRef.current) woolRef.current.position.x = 1.5;
        if (potRef.current) potRef.current.position.x = -1.5;
      } else {
        if (woolRef.current) woolRef.current.position.x = 0;
        if (potRef.current) potRef.current.position.x = 0;
      }
    }
  });

  return (
    <group position={[0, -1, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2d2d1a" />
      </mesh>
      <Box args={[2, 0.1, 2]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>
      <group ref={farmerRef} position={[-3, 0, 0]}>
        <Cylinder args={[0.4, 0.5, 1.5, 6]} position={[0, 0.75, 0]}><meshStandardMaterial color="#228b22" /></Cylinder>
        <Sphere args={[0.3, 8, 8]} position={[0, 1.7, 0]}><meshStandardMaterial color="#ffdbac" /></Sphere>
        <Box ref={woolRef} args={[0.4, 0.4, 0.4]} position={[0.5, 1, 0]}><meshStandardMaterial color="#f5f5f5" /></Box>
      </group>
      <group ref={artisanRef} position={[3, 0, 0]}>
        <Cylinder args={[0.4, 0.5, 1.5, 6]} position={[0, 0.75, 0]}><meshStandardMaterial color="#8b0000" /></Cylinder>
        <Sphere args={[0.3, 8, 8]} position={[0, 1.7, 0]}><meshStandardMaterial color="#ffdbac" /></Sphere>
        <Cylinder ref={potRef} args={[0.2, 0.3, 0.4, 6]} position={[-0.5, 1, 0]}><meshStandardMaterial color="#cd853f" /></Cylinder>
      </group>
    </group>
  );
};

// --- Department Store Stage ---
export const DeptStoreStage: React.FC<{ active: boolean }> = ({ active }) => {
  const gear1 = useRef<THREE.Mesh>(null);
  const gear2 = useRef<THREE.Mesh>(null);
  const customer = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (gear1.current) gear1.current.rotation.z += 0.01;
    if (gear2.current) gear2.current.rotation.z -= 0.015;
    if (active && customer.current) {
      customer.current.position.z = 4 - (Math.sin(t) + 1) * 2;
    }
  });

  return (
    <group position={[0, -1, 0]}>
      <Box args={[8, 6, 4]} position={[0, 3, -4]}>
        <meshStandardMaterial color="#333" />
      </Box>
      <Box args={[2, 3, 0.1]} position={[0, 1.5, -2]}><meshStandardMaterial color="#add8e6" transparent opacity={0.4} /></Box>
      <Cylinder ref={gear1} args={[1.5, 1.5, 0.3, 8]} position={[-5, 5, -3]} rotation={[Math.PI / 2, 0, 0]}><meshStandardMaterial color="#555" /></Cylinder>
      <Cylinder ref={gear2} args={[1, 1, 0.3, 8]} position={[-3.2, 5.5, -3.1]} rotation={[Math.PI / 2, 0, 0]}><meshStandardMaterial color="#666" /></Cylinder>
      <group ref={customer} position={[0, 0, 4]}>
        <Cylinder args={[0.2, 0.2, 1.2, 6]} position={[0, 0.6, 0]}><meshStandardMaterial color="#4f46e5" /></Cylinder>
        <Sphere args={[0.15, 8, 8]} position={[0, 1.3, 0]}><meshStandardMaterial color="#ffdbac" /></Sphere>
      </group>
    </group>
  );
};

// --- Self-service Stage ---
export const SelfServiceStage: React.FC<{ active: boolean }> = ({ active }) => {
  const item = useRef<THREE.Mesh>(null);
  const hand = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (active) {
      const cycle = (t * 0.8) % Math.PI;
      if (hand.current) {
        hand.current.position.z = 2 - Math.sin(cycle) * 1.5;
        hand.current.position.y = 1 + Math.sin(cycle) * 0.5;
      }
      if (item.current) {
        if (Math.sin(cycle) > 0.8) {
          item.current.position.z = hand.current!.position.z;
          item.current.position.y = hand.current!.position.y;
        } else if (Math.sin(cycle) < 0.1) {
          item.current.position.z = 0;
          item.current.position.y = 1.2;
        }
      }
    }
  });

  return (
    <group position={[0, -1, 0]}>
      <Box args={[6, 0.1, 6]} position={[0, 0, 0]}><meshStandardMaterial color="#222" /></Box>
      {/* Shelf */}
      <group position={[0, 0, 0]}>
        <Box args={[4, 0.1, 1]} position={[0, 1, 0]}><meshStandardMaterial color="#444" /></Box>
        <Box args={[4, 0.1, 1]} position={[0, 2, 0]}><meshStandardMaterial color="#444" /></Box>
        <Box args={[0.1, 3, 1]} position={[-2, 1.5, 0]}><meshStandardMaterial color="#333" /></Box>
        <Box args={[0.1, 3, 1]} position={[2, 1.5, 0]}><meshStandardMaterial color="#333" /></Box>
      </group>
      {/* Item to pick */}
      <Box ref={item} args={[0.4, 0.6, 0.4]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.2} />
      </Box>
      {/* Hand/Customer proxy */}
      <group ref={hand} position={[0, 1, 3]}>
        <Box args={[0.3, 0.1, 0.5]} position={[0, 0, 0]}><meshStandardMaterial color="#ffdbac" /></Box>
        <Cylinder args={[0.1, 0.1, 1]} position={[0, 0, 0.5]} rotation={[Math.PI/2, 0, 0]}><meshStandardMaterial color="#334155" /></Cylinder>
      </group>
    </group>
  );
};

// --- Supermarket Stage ---
export const SupermarketStage: React.FC<{ active: boolean }> = ({ active }) => {
  const cart = useRef<THREE.Group>(null);
  const items = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (active) {
      const progress = (t % 4) / 4;
      if (cart.current) cart.current.position.x = -6 + progress * 12;
      items.current?.children.forEach((item, i) => {
        const itemT = (t + i * 0.5) % 2;
        if (itemT < 1) {
          item.position.y = 1.5 + Math.sin(itemT * Math.PI) * 2;
          item.position.x = -1 + itemT * 2;
          item.visible = true;
        } else {
          item.visible = false;
        }
      });
    }
  });

  return (
    <group position={[0, -1, 0]}>
      <Box args={[12, 0.1, 10]} position={[0, 0, 0]}><meshStandardMaterial color="#1e293b" /></Box>
      <Box args={[10, 4, 0.5]} position={[0, 2, -3]}><meshStandardMaterial color="#ccc" /></Box>
      <group ref={cart}>
        <Box args={[1.2, 0.8, 1]} position={[0, 0.6, 0]}><meshStandardMaterial color="#fff" wireframe /></Box>
        <group ref={items} position={[0, 0.6, 0]}>
          <Box args={[0.3, 0.3, 0.3]}><meshStandardMaterial color="red" /></Box>
          <Box args={[0.3, 0.3, 0.3]}><meshStandardMaterial color="blue" /></Box>
        </group>
        <group position={[-1, 0, 0]}>
           <Cylinder args={[0.2, 0.2, 1.4, 6]} position={[0, 0.7, 0]}><meshStandardMaterial color="#334155" /></Cylinder>
           <Sphere args={[0.15, 8, 8]} position={[0, 1.5, 0]}><meshStandardMaterial color="#ffdbac" /></Sphere>
        </group>
      </group>
    </group>
  );
};

// --- E-commerce Stage ---
export const EcommerceStage: React.FC<{ active: boolean }> = ({ active }) => {
  const box = useRef<THREE.Mesh>(null);
  const cursor = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (active) {
      const cycle = t % 5;
      if (cycle < 1) {
        cursor.current?.position.set(-2, 2, 1);
        cursor.current!.scale.setScalar(1 - Math.sin(cycle * Math.PI) * 0.3);
      } else if (cycle < 4) {
        const flyT = (cycle - 1) / 3;
        box.current?.position.set(-2 + flyT * 6, 1 + Math.sin(flyT * Math.PI) * 4, 0);
        box.current?.rotation.set(flyT * 10, flyT * 10, 0);
        box.current!.visible = true;
      } else {
        box.current!.visible = false;
      }
    }
  });

  return (
    <group position={[0, -1, 0]}>
      <Box args={[4, 0.1, 3]} position={[-2, 0.05, 0]}><meshStandardMaterial color="#222" /></Box>
      <Box args={[4, 3, 0.1]} position={[-2, 1.5, -1.5]} rotation={[-0.2, 0, 0]}><meshStandardMaterial color="#111" /></Box>
      <Box args={[3.5, 2.5, 0.01]} position={[-2, 1.6, -1.4]} rotation={[-0.2, 0, 0]}><meshStandardMaterial color="#1e3a8a" emissive="#1e3a8a" emissiveIntensity={0.5} /></Box>
      <Box args={[2.5, 2.5, 2.5]} position={[4, 1.25, 0]}><meshStandardMaterial color="#8b4513" /></Box>
      <group ref={cursor} position={[-2, 2, 1]}>
        <Box args={[0.1, 0.6, 0.1]} rotation={[0, 0, 0.5]}><meshStandardMaterial color="white" /></Box>
      </group>
      <Box ref={box} args={[0.8, 0.8, 0.8]}><meshStandardMaterial color="#d2b48c" /></Box>
    </group>
  );
};

// --- New Retail Stage ---
export const NewRetailStage: React.FC<{ active: boolean }> = ({ active }) => {
  const drone = useRef<THREE.Group>(null);
  const particles = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (drone.current) {
      drone.current.position.y = 4 + Math.sin(t * 3) * 0.3;
      if (active) {
        const move = (t % 8) / 8;
        drone.current.position.x = -4 + move * 8;
      }
      drone.current.rotation.y = Math.sin(t) * 0.2;
    }
    particles.current?.children.forEach((p, i) => {
      p.position.y = (p.position.y + 0.03) % 5;
    });
  });

  return (
    <group position={[0, -1, 0]}>
      <Box args={[3, 4, 3]} position={[-4, 2, 0]}>
        <meshStandardMaterial color="#0ff" transparent opacity={0.2} wireframe />
      </Box>
      <group ref={particles} position={[-4, 0, 0]}>
        {Array.from({ length: 15 }).map((_, i) => (
          <Sphere key={i} args={[0.04, 6, 6]} position={[(Math.random()-0.5)*2, Math.random()*5, (Math.random()-0.5)*2]}>
            <meshStandardMaterial color="#0ff" emissive="#0ff" />
          </Sphere>
        ))}
      </group>
      <group ref={drone} position={[-4, 4, 0]}>
        <Box args={[1, 0.1, 0.1]}><meshStandardMaterial color="#111" /></Box>
        <Box args={[0.1, 0.1, 1]}><meshStandardMaterial color="#111" /></Box>
        <Box args={[0.5, 0.5, 0.5]} position={[0, -0.4, 0]}><meshStandardMaterial color="#d2b48c" /></Box>
      </group>
      <group position={[4, 0, 0]}>
        <Cylinder args={[0.3, 0.3, 1.6, 6]} position={[0, 0.8, 0]}><meshStandardMaterial color="#312e81" /></Cylinder>
        <Sphere args={[0.2, 8, 8]} position={[0, 1.8, 0]}><meshStandardMaterial color="#ffdbac" /></Sphere>
        <Box args={[0.1, 0.2, 0.05]} position={[-0.3, 1.3, 0.3]} rotation={[0.6, 0, 0]}><meshStandardMaterial color="#0ff" emissive="#0ff" /></Box>
      </group>
    </group>
  );
};

// --- Impact Stage ---
export const ImpactStage: React.FC<{ type: 'industry' | 'logistics' | 'employment' | 'economy' }> = ({ type }) => {
  const lines = useRef<THREE.Group>(null);
  const bars = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (type === 'economy' && bars.current) {
      bars.current.children.forEach((bar, i) => {
        bar.scale.y = 1.5 + Math.sin(t * 2 + i) * 1;
        bar.position.y = bar.scale.y / 2;
      });
    }
    if (type === 'industry' && lines.current) {
      lines.current.children.forEach((line, i) => {
        line.position.x = ((t + i) % 6) - 3;
      });
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {type === 'industry' && (
        <>
          <Box args={[2, 1, 2]} position={[-4, 0.5, 0]}><meshStandardMaterial color="#166534" /></Box>
          <Box args={[2, 2, 2]} position={[4, 1, 0]}><meshStandardMaterial color="#1e293b" /></Box>
          <group ref={lines}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Sphere key={i} args={[0.1]} position={[0, 1, 0]}><meshStandardMaterial color="#fbbf24" emissive="#fbbf24" /></Sphere>
            ))}
          </group>
        </>
      )}
      {type === 'logistics' && (
        <group>
          <Box args={[3, 1.5, 1.5]} position={[0, 2, 0]}><meshStandardMaterial color="#ea580c" /></Box>
          <Cylinder args={[0.05, 0.05, 10, 4]} position={[0, 0.1, 0]} rotation={[0, 0, Math.PI/2]}><meshStandardMaterial color="#444" /></Cylinder>
        </group>
      )}
      {type === 'employment' && (
        <group>
          {Array.from({ length: 8 }).map((_, i) => (
            <group key={i} position={[(i - 3.5) * 1.2, 0, Math.sin(i) * 2]}>
              <Cylinder args={[0.2, 0.2, 1.2, 6]} position={[0, 0.6, 0]}>
                <meshStandardMaterial color={new THREE.Color().setHSL(i / 8, 0.6, 0.5)} />
              </Cylinder>
              <Sphere args={[0.15, 8, 8]} position={[0, 1.4, 0]}><meshStandardMaterial color="#ffdbac" /></Sphere>
            </group>
          ))}
        </group>
      )}
      {type === 'economy' && (
        <group ref={bars}>
          {Array.from({ length: 7 }).map((_, i) => (
            <Box key={i} args={[0.8, 1, 0.8]} position={[(i - 3) * 1.5, 0.5, 0]}>
              <meshStandardMaterial color="#fbbf24" />
            </Box>
          ))}
        </group>
      )}
    </group>
  );
};

// --- Theory Stage ---
export const TheoryStage: React.FC<{ type: 'wheel' | 'accordion' }> = ({ type }) => {
  const wheel = useRef<THREE.Group>(null);
  const accordion = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (type === 'wheel' && wheel.current) {
      wheel.current.rotation.y += 0.01;
      wheel.current.children.forEach((child, i) => {
        if (child.type === 'Mesh' && child.name === 'indicator') {
           child.scale.setScalar(1 + Math.sin(t * 3) * 0.2);
        }
      });
    }
    if (type === 'accordion' && accordion.current) {
      const scale = 1.5 + Math.sin(t * 1.5) * 1;
      accordion.current.scale.x = scale;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {type === 'wheel' && (
        <group ref={wheel}>
          <Torus args={[4, 0.1, 8, 32]} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.5} />
          </Torus>
          <Text position={[0, 0, 4.5]} fontSize={0.4} color="white">LOW PRICE</Text>
          <Text position={[4.5, 0, 0]} fontSize={0.4} color="white" rotation={[0, Math.PI/2, 0]}>LOW STATUS</Text>
          <Text position={[0, 0, -4.5]} fontSize={0.4} color="white" rotation={[0, Math.PI, 0]}>HIGH COST</Text>
          <Text position={[-4.5, 0, 0]} fontSize={0.4} color="white" rotation={[0, -Math.PI/2, 0]}>HIGH PRICE</Text>
          <Sphere name="indicator" args={[0.3, 8, 8]} position={[0, 0, 4]}>
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" />
          </Sphere>
        </group>
      )}
      {type === 'accordion' && (
        <group ref={accordion}>
          {Array.from({ length: 10 }).map((_, i) => (
            <Box key={i} args={[0.2, 4, 3]} position={[(i - 4.5) * 0.5, 0, 0]}>
              <meshStandardMaterial color="#9333ea" transparent opacity={0.5} />
            </Box>
          ))}
          <Text position={[0, 2.5, 0]} fontSize={0.5} color="white">COMPREHENSIVE ↔ SPECIALIZED</Text>
        </group>
      )}
    </group>
  );
};

// --- Future Stage ---
export const FutureStage: React.FC = () => {
  const particles = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    particles.current?.children.forEach((p, i) => {
      p.position.y += Math.sin(t + i) * 0.02;
      p.position.x += Math.cos(t + i) * 0.02;
      p.rotation.y += 0.01;
    });
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[2, 16, 16]} />
        <MeshDistortMaterial color="#020617" speed={2} distort={0.5} />
      </mesh>
      <Text position={[0, 0, 2.1]} fontSize={3} color="#fff">?</Text>
      <group ref={particles}>
        {Array.from({ length: 20 }).map((_, i) => (
          <Sphere key={i} args={[0.05, 4, 4]} position={[(Math.random()-0.5)*15, (Math.random()-0.5)*15, (Math.random()-0.5)*15]}>
            <meshStandardMaterial color={new THREE.Color().setHSL(Math.random(), 0.8, 0.6)} emissive="white" emissiveIntensity={0.3} />
          </Sphere>
        ))}
      </group>
    </group>
  );
};
