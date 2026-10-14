import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { X, Award, Flame, RotateCw } from 'lucide-react';
import { Milestone } from '../../types';

interface Milestone3DModalProps {
  milestone: Milestone;
  onClose: () => void;
}

export const Milestone3DModal: React.FC<Milestone3DModalProps> = ({ milestone, onClose }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3D Trophy Base & Cup Group
    const trophyGroup = new THREE.Group();
    scene.add(trophyGroup);

    // Golden metallic material
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });

    // Dark pedestal material
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.6,
    });

    // Pedestal base
    const baseGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.35, 32);
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.2;
    trophyGroup.add(baseMesh);

    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.18, 0.28, 0.6, 24);
    const stemMesh = new THREE.Mesh(stemGeo, goldMat);
    stemMesh.position.y = -0.75;
    trophyGroup.add(stemMesh);

    // Trophy cup bowl
    const cupGeo = new THREE.CylinderGeometry(0.85, 0.35, 1.1, 32, 1, true);
    const cupMesh = new THREE.Mesh(cupGeo, goldMat);
    cupMesh.position.y = 0.05;
    trophyGroup.add(cupMesh);

    // Gem / Medallion floating in the cup
    const gemGeo = new THREE.OctahedronGeometry(0.42, 0);
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.8,
      transmission: 0.4,
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    gemMesh.position.y = 0.2;
    trophyGroup.add(gemMesh);

    // Rings around trophy
    const ringGeo = new THREE.TorusGeometry(0.88, 0.04, 16, 50);
    const ringMesh = new THREE.Mesh(ringGeo, goldMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.6;
    trophyGroup.add(ringMesh);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 3.5);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    rimLight.position.set(-3, -2, -3);
    scene.add(rimLight);

    // Drag to inspect
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      trophyGroup.rotation.y += dx * 0.012;
      trophyGroup.rotation.x += dy * 0.012;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (!isDragging) {
        trophyGroup.rotation.y += 0.01;
      }
      gemMesh.rotation.y += 0.02;
      gemMesh.position.y = 0.2 + Math.sin(time * 3) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      baseGeo.dispose();
      stemGeo.dispose();
      cupGeo.dispose();
      gemGeo.dispose();
      ringGeo.dispose();
      goldMat.dispose();
      baseMat.dispose();
      gemMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 text-center text-white shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 3D WebGL Canvas */}
        <div
          ref={mountRef}
          className="w-full h-64 flex items-center justify-center cursor-grab active:cursor-grabbing"
          title="Drag to rotate 3D trophy"
        />

        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/70 border border-amber-800 px-2.5 py-1 rounded-full inline-block mb-2">
          3D Achievement Trophy
        </span>

        <h3 className="text-xl font-extrabold">{milestone.title}</h3>
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
          {milestone.description}
        </p>

        <div className="mt-4 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-amber-300 flex items-center justify-center gap-1.5">
          <Flame className="w-4 h-4 fill-amber-500/30" />
          <span>{milestone.streakRequirement} Days Consecutive Streak</span>
        </div>

        <p className="text-[11px] text-slate-500 mt-3">
          Click and drag in any direction to spin in 3D space
        </p>
      </div>
    </div>
  );
};
