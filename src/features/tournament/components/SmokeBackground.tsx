'use client';

import React, { useEffect } from 'react';
import * as THREE from 'three';

const SmokeBackground = () => {
  useEffect(() => {
    const $bkg = document.getElementById('smoke-bkg');
    if (!$bkg) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, w / h, 1, 1000);
    camera.position.z = 10;

    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0.2);

    $bkg.appendChild(renderer.domElement);

    const smokeParticles: THREE.Mesh[] = [];
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = ''; // <- en local no pasa nada, pero si desplegamos en servidor puede ser necesario

    loader.load('/smoke.webp', (texture) => {
      const smokeGo = new THREE.PlaneGeometry(220, 220);
      const smokeMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      });

      const NUM_OF_PARTICLES = 100;
      for (let i = 0; i < NUM_OF_PARTICLES; i++) {
        const particle = new THREE.Mesh(smokeGo, smokeMaterial);
        particle.position.set(
          Math.random() * 500 - 250,
          Math.random() * 500 - 250,
          Math.random() * 1000 - 100
        );
        //aleatoriedad la z
        particle.rotation.z = Math.random() * 360;

        scene.add(particle);
        //Añadimos la particula al array
        smokeParticles.push(particle);
      }
    });

    function animate() {
      requestAnimationFrame(animate);
      smokeParticles.forEach((particle) => {
        particle.rotation.z += 0.001;
      });
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 0, 1).normalize();
    scene.add(directionalLight);

    // 👇 cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      $bkg.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div id="smoke-bkg" className="fixed left-0 top-0 h-full w-full"></div>;
};

export default SmokeBackground;
