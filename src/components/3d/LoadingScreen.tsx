import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Flame, Sparkles, ArrowRight } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing HabitPulse Core...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Three.js 3D Scene Animation
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Inner glowing crystal (Icosahedron)
    const innerGeo = new THREE.IcosahedronGeometry(1.1, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: false,
      emissive: 0x059669,
      emissiveIntensity: 0.35,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Outer wireframe cage
    const outerGeo = new THREE.IcosahedronGeometry(1.45, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x6ee7b7,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // Swirling particle cloud around the crystal
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.6 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
        z: (Math.random() - 0.5) * 0.005,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    scene.add(particleCloud);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x34d399, 2.5, 50);
    pointLight1.position.set(3, 3, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x6366f1, 2.0, 50);
    pointLight2.position.set(-3, -2, 3);
    scene.add(pointLight2);

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.001;
      mouseY = (e.clientY - windowHalfY) * 0.001;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Rotate objects
      innerMesh.rotation.x += 0.015;
      innerMesh.rotation.y += 0.02;

      outerMesh.rotation.x -= 0.01;
      outerMesh.rotation.y -= 0.012;

      particleCloud.rotation.y += 0.008;

      // Gentle floating bob
      innerMesh.position.y = Math.sin(time * 2) * 0.08;
      outerMesh.position.y = Math.sin(time * 2) * 0.08;

      // Mouse inertia tracking
      targetRotationY = mouseX * 2;
      targetRotationX = mouseY * 2;
      scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.05;
      scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      innerGeo.dispose();
      innerMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Loading progress ticker simulation
  useEffect(() => {
    const startTime = Date.now();
    const duration = 1800; // 1.8 seconds loading experience

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 25) {
        setStatusText('Calibrating habit momentum engine...');
      } else if (pct < 55) {
        setStatusText('Restoring persistent localStorage records...');
      } else if (pct < 85) {
        setStatusText('Synthesizing audio chimes & heatmaps...');
      } else if (pct < 100) {
        setStatusText('Finalizing consistency metrics...');
      } else {
        setStatusText('System Ready!');
        clearInterval(interval);
        // Start smooth fade out
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 350);
        }, 150);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Main 3D Container & Brand Presentation */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        {/* 3D WebGL Crystal Canvas */}
        <div
          ref={mountRef}
          className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center cursor-grab active:cursor-grabbing"
          title="Move cursor to interact with 3D Core"
        />

        {/* Brand Name */}
        <div className="flex items-center gap-2.5 mt-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <Flame className="w-4.5 h-4.5 fill-current" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
            HabitPulse
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            3D Pro
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-2 font-medium">
          Interactive Habit & Skill Tracker
        </p>

        {/* Progress Bar & Status Text */}
        <div className="w-full mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400 text-[11px] truncate">{statusText}</span>
            <span className="font-mono text-emerald-400">{progress}%</span>
          </div>

          <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 rounded-full transition-all duration-75 shadow-xs shadow-emerald-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 200);
          }}
          className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 group"
        >
          <span>Skip introduction</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="absolute bottom-6 text-[11px] text-slate-600 font-medium">
        Powered by Three.js WebGL & React 19
      </div>
    </div>
  );
};
