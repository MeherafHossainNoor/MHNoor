import * as THREE from "three";

export function mountThreeScene(container, { variant = "ambient", theme } = {}) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const themeStyles = getComputedStyle(document.documentElement);
  const themeColor = (property, fallback) => themeStyles.getPropertyValue(property).trim() || fallback;
  const sceneWire = variant === "showcase" && theme === "aurora"
    ? "#9a83ff"
    : themeColor("--scene-wire", "#8175ff");
  const sceneKnot = themeColor("--scene-knot", "#48c8df");
  const sceneOrbit = themeColor("--scene-orbit", "#e56bcb");
  const particleA = new THREE.Color(themeColor("--scene-particle-a", "#8978ff"));
  const particleB = new THREE.Color(themeColor("--scene-particle-b", "#5ee3e7"));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.z = variant === "showcase" ? 6.2 : 8;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
  } catch (error) {
    container.classList.add("scene-unavailable");
    return () => {};
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  const wireGeometry = variant === "showcase"
    ? new THREE.IcosahedronGeometry(1.45, 1)
    : new THREE.IcosahedronGeometry(1.45, 1);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: sceneWire,
    wireframe: true,
    transparent: true,
    opacity: variant === "showcase" ? 0.68 : 0.22,
  });
  const wireShape = new THREE.Mesh(wireGeometry, wireMaterial);
  group.add(wireShape);

  const innerShape = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.82, 0.025, 100, 8, 2, 3),
    new THREE.MeshBasicMaterial({
      color: sceneKnot,
      transparent: true,
      opacity: variant === "showcase" ? 0.75 : 0.36,
    }),
  );
  group.add(innerShape);

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(2.05, 0.008, 6, 120),
    new THREE.MeshBasicMaterial({ color: sceneOrbit, transparent: true, opacity: 0.4 }),
  );
  halo.rotation.x = 1.14;
  halo.rotation.y = 0.35;
  group.add(halo);

  const count = variant === "showcase" ? 100 : 200;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * (variant === "showcase" ? 8 : 15);
    positions[index * 3 + 1] = (Math.random() - 0.5) * (variant === "showcase" ? 6 : 10);
    positions[index * 3 + 2] = (Math.random() - 0.5) * 4;
    const color = particleA.clone().lerp(particleB, Math.random());
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const particles = new THREE.Points(
    particlesGeometry,
    new THREE.PointsMaterial({
      size: variant === "showcase" ? 0.035 : 0.025,
      vertexColors: true,
      transparent: true,
      opacity: variant === "showcase" ? 0.8 : 0.46,
      sizeAttenuation: true,
    }),
  );
  scene.add(particles);

  const pointer = new THREE.Vector2();
  const targetRotation = new THREE.Vector2();
  let dragging = false;
  let dragPoint = { x: 0, y: 0 };
  let lastInteraction = 0;
  let visible = true;
  let frame = 0;
  const setPointerTarget = (event) => {
    const rect = container.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    pointer.y = -(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1);
    targetRotation.set(pointer.y * 0.18, pointer.x * 0.24);
  };
  const onPointerMove = (event) => {
    if (variant !== "showcase") {
      setPointerTarget(event);
      return;
    }
    if (!dragging) {
      setPointerTarget(event);
      return;
    }

    group.rotation.y += (event.clientX - dragPoint.x) * 0.008;
    group.rotation.x += (event.clientY - dragPoint.y) * 0.008;
    dragPoint = { x: event.clientX, y: event.clientY };
    lastInteraction = performance.now();
  };
  const startDrag = (event) => {
    if (variant !== "showcase") return;
    dragging = true;
    dragPoint = { x: event.clientX, y: event.clientY };
    lastInteraction = performance.now();
    container.setPointerCapture(event.pointerId);
  };
  const stopDrag = () => {
    dragging = false;
    lastInteraction = performance.now();
  };

  const resize = () => {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  observer.observe(container);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  if (variant === "showcase") {
    container.addEventListener("pointerdown", startDrag);
    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerup", stopDrag);
    container.addEventListener("pointercancel", stopDrag);
  } else {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  }

  const render = (time) => {
    if (!visible || document.hidden) {
      frame = requestAnimationFrame(render);
      return;
    }
    const elapsed = time * 0.00016;
    if (!reducedMotion) {
      if (variant === "showcase") {
        group.rotation.x += (targetRotation.x - group.rotation.x) * 0.012;
        if (!dragging && time - lastInteraction > 1400) group.rotation.y += 0.0013;
      } else {
        group.rotation.y += (targetRotation.y + elapsed - group.rotation.y) * 0.018;
        group.rotation.x += (targetRotation.x + Math.sin(elapsed * 1.1) * 0.08 - group.rotation.x) * 0.018;
      }
      innerShape.rotation.x += 0.0016;
      innerShape.rotation.y -= 0.0011;
      halo.rotation.z += 0.00045;
      particles.rotation.y -= 0.00008;
    }
    renderer.render(scene, camera);
    if (!reducedMotion) frame = requestAnimationFrame(render);
  };
  render(0);

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    resizeObserver.disconnect();
    if (variant === "showcase") {
      container.removeEventListener("pointerdown", startDrag);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", stopDrag);
      container.removeEventListener("pointercancel", stopDrag);
    } else {
      window.removeEventListener("pointermove", onPointerMove);
    }
    wireGeometry.dispose();
    wireMaterial.dispose();
    innerShape.geometry.dispose();
    innerShape.material.dispose();
    halo.geometry.dispose();
    halo.material.dispose();
    particlesGeometry.dispose();
    particles.material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

export default { mountThreeScene };
