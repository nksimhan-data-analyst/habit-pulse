import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useHabits } from '../../context/HabitContext';
import { calculateHabitStats } from '../../utils/dateUtils';
import { Flame, RotateCw, Eye } from 'lucide-react';

export const StreakOrb3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { habits, logs } = useHabits();
  const [autoRotate, setAutoRotate] = useState(true);
  const [interactionTip, setInteractionTip] = useState(false);

  // Compute highest streak and active habits count
  const activeHabits = habits.filter((h) => !h.archived);
  let highestStreak = 0;
  let topHabitName = 'Daily Momentum';

  activeHabits.forEach((h) => {
    const stats = calculateHabitStats(h, logs);
    if (stats.currentStreak > highestStreak) {
      highestStreak = stats.currentStreak;
      topHabitName = h.name;
    }
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 180;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Main 3D Core: TorusKnot or Geodesic Core
    const coreGeo = new THREE.TorusKnotGeometry(0.7, 0.22, 100, 16);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x064e3b,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 0.6,
      clearcoatRoughness: 0.1,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Orbiting Habit Satellites
    const satellitesGroup = new THREE.Group();
    scene.add(satellitesGroup);

    const satelliteColors = [0x10b981, 0x6366f1, 0xf59e0b, 0xec4899, 0x06b6d4, 0x8b5cf6];
    const satellites: THREE.Mesh[] = [];
    const count = Math.max(4, Math.min(activeHabits.length, 8));

    for (let i = 0; i < count; i++) {
      const satGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({
        color: satelliteColors[i % satelliteColors.length],
        roughness: 0.2,
        metalness: 0.7,
        emissive: satelliteColors[i % satelliteColors.length],
        emissiveIntensity: 0.5,
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      satellites.push(sat);
      satellitesGroup.add(sat);
    }

    // Floating Stardust Particles
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 4;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 3;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0x34d399, 3, 30);
    light1.position.set(2, 2, 3);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x818cf8, 2.5, 30);
    light2.position.set(-2, -2, 2);
    scene.add(light2);

    // Pointer Interaction (Drag & Rotate)
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      coreMesh.rotation.y += deltaX * 0.01;
      coreMesh.rotation.x += deltaY * 0.01;
      satellitesGroup.rotation.y += deltaX * 0.01;

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (autoRotate && !isDragging) {
        coreMesh.rotation.y += 0.012;
        coreMesh.rotation.x += 0.007;
        satellitesGroup.rotation.y -= 0.015;
      }

      // Update orbiting satellites positions
      satellites.forEach((sat, idx) => {
        const angle = time * 0.8 + (idx * (Math.PI * 2)) / satellites.length;
        const radius = 1.35;
        sat.position.x = Math.cos(angle) * radius;
        sat.position.z = Math.sin(angle) * radius;
        sat.position.y = Math.sin(angle * 2) * 0.3;
      });

      // Float dust
      dustPoints.rotation.y += 0.002;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      coreGeo.dispose();
      coreMat.dispose();
      satellites.forEach((s) => {
        s.geometry.dispose();
        (s.material as THREE.Material).dispose();
      });
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
    };
  }, [activeHabits.length, autoRotate]);

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/70 border border-emerald-500/30 p-4 text-white shadow-lg overflow-hidden flex flex-col justify-between">
      {/* 3D WebGL Canvas Layer */}
      <div
        ref={mountRef}
        onMouseEnter={() => setInteractionTip(true)}
        onMouseLeave={() => setInteractionTip(false)}
        className="w-full h-44 sm:h-48 cursor-grab active:cursor-grabbing flex items-center justify-center"
        title="Click and drag to rotate the 3D Streak Orb"
      />

      {/* Floating 3D Badge Info */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>3D Momentum Core</span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {highestStreak}d Streak
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
              {topHabitName}
            </p>
          </div>
        </div>

        {/* Rotate Toggle Button */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pause auto-spin' : 'Resume auto-spin'}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {interactionTip && (
        <div className="absolute top-3 right-3 text-[10px] bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded-md backdrop-blur-xs border border-slate-700 pointer-events-none animate-in fade-in">
          Drag to spin 3D core
        </div>
      )}
    </div>
  );
};
