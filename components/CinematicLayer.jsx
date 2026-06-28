'use client';

import { useEffect, useRef } from 'react';

export default function CinematicLayer() {
  const canvasRef = useRef(null);
  const stateRef = useRef({});

  useEffect(() => {
    let THREE;
    let animId;
    let renderer, scene, camera;
    let particles;
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    async function init() {
      THREE = await import('three');

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Scene
      scene = new THREE.Scene();

      // Camera
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      // Renderer
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);

      // Particles
      const count = 280;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const phases = new Float32Array(count);
      const speeds = new Float32Array(count);

      // Warm orange palette
      const palette = [
        new THREE.Color(0xff8c42), // warm orange
        new THREE.Color(0xffb347), // amber
        new THREE.Color(0xffd280), // pale gold
        new THREE.Color(0xffffff), // white
        new THREE.Color(0xff6b35), // deep orange
        new THREE.Color(0x4a9eff), // monitor blue
      ];

      for (let i = 0; i < count; i++) {
        // Spread across viewport with depth
        positions[i * 3 + 0] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;

        const col = palette[Math.floor(Math.random() * palette.length)];
        // Heavy bias toward warm orange
        const warmBias = Math.random();
        if (warmBias > 0.15) {
          const warmCol = palette[Math.floor(Math.random() * 3)];
          colors[i * 3 + 0] = warmCol.r;
          colors[i * 3 + 1] = warmCol.g;
          colors[i * 3 + 2] = warmCol.b;
        } else {
          colors[i * 3 + 0] = col.r;
          colors[i * 3 + 1] = col.g;
          colors[i * 3 + 2] = col.b;
        }

        sizes[i] = Math.random() * 18 + 3;
        phases[i] = Math.random() * Math.PI * 2;
        speeds[i] = Math.random() * 0.3 + 0.08;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Bokeh circle sprite
      const sprite = createBokehSprite(THREE);

      const mat = new THREE.PointsMaterial({
        size: 0.25,
        map: sprite,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      particles = new THREE.Points(geo, mat);
      scene.add(particles);

      stateRef.current = { positions, phases, speeds, count };

      // Mouse parallax
      const onMouse = (e) => {
        targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      const onTouch = (e) => {
        if (e.touches[0]) {
          targetMouse.x = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
          targetMouse.y = -(e.touches[0].clientY / window.innerHeight - 0.5) * 2;
        }
      };
      window.addEventListener('mousemove', onMouse);
      window.addEventListener('touchmove', onTouch, { passive: true });

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      stateRef.current.cleanup = () => {
        window.removeEventListener('mousemove', onMouse);
        window.removeEventListener('touchmove', onTouch);
        window.removeEventListener('resize', onResize);
        geo.dispose();
        mat.dispose();
        sprite.dispose();
        renderer.dispose();
      };

      animate(THREE);
    }

    function createBokehSprite(THREE) {
      const size = 128;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      const half = size / 2;

      // Soft radial gradient for bokeh glow
      const grd = ctx.createRadialGradient(half, half, 0, half, half, half);
      grd.addColorStop(0, 'rgba(255,255,255,1)');
      grd.addColorStop(0.2, 'rgba(255,200,100,0.8)');
      grd.addColorStop(0.5, 'rgba(255,140,50,0.3)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, size, size);

      const tex = new THREE.CanvasTexture(c);
      return tex;
    }

    function animate(THREE) {
      const clock = new THREE.Clock();

      function loop() {
        animId = requestAnimationFrame(loop);
        const t = clock.getElapsedTime();
        const { positions, phases, speeds, count } = stateRef.current;

        // Update particle positions (sine wave float)
        if (particles && positions) {
          const pos = particles.geometry.attributes.position.array;
          for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const phase = phases[i];
            const speed = speeds[i];
            // Gentle sine oscillation on Y
            pos[ix + 1] = positions[i * 3 + 1] + Math.sin(t * speed + phase) * 0.35;
            // Slight drift on X
            pos[ix + 0] = positions[i * 3 + 0] + Math.cos(t * speed * 0.5 + phase) * 0.12;
          }
          particles.geometry.attributes.position.needsUpdate = true;
          particles.rotation.y = t * 0.008;
        }

        // Smooth mouse parallax on camera
        mouse.x += (targetMouse.x - mouse.x) * 0.04;
        mouse.y += (targetMouse.y - mouse.y) * 0.04;
        camera.position.x = mouse.x * 0.6;
        camera.position.y = mouse.y * 0.35;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      }

      loop();
    }

    init();

    return () => {
      cancelAnimationFrame(animId);
      if (stateRef.current.cleanup) stateRef.current.cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3,
      }}
    />
  );
}

