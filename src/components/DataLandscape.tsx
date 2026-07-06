"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Futuristic shader grid terrain with binary rain and click-triggered energy pulse.
// Cinematic camera glide; reduced-motion safe.

const TERRAIN_SIZE = 90;
const TERRAIN_SEGMENTS = 160;
const RAIN_COUNT = 20000;
const PULSE_SPEED = 16;
const PULSE_MAX_RANGE = TERRAIN_SIZE * 1.3 * (2 / 3);

const terrainVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPulseOrigin;
  uniform float uPulseTime;
  uniform float uPulseStrength;

  varying vec2 vUv;
  varying float vElevation;
  varying float vPulse;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float waveA = sin(pos.x * 0.22 + uTime * 0.9) * cos(pos.z * 0.18 + uTime * 0.7) * 1.1;
    float waveB = sin(pos.x * 0.11 - pos.z * 0.14 + uTime * 0.55) * 0.65;
    float waveC = cos(pos.x * 0.08 + pos.z * 0.26 + uTime * 0.35) * 0.45;

    float dist = length(pos.xz - uPulseOrigin);
    float ringPos = uPulseTime * 16.0;
    float pulseRing = exp(-pow(dist - ringPos, 2.0) / 16.0) * uPulseStrength;
    float pulseWave = sin((dist - ringPos) * 0.75 - uTime * 5.0) * pulseRing * 2.4;
    vPulse = pulseRing;

    float elevation = waveA + waveB + waveC + pulseWave;
    pos.y += elevation;
    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const terrainFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uCameraPos;

  varying vec2 vUv;
  varying float vElevation;
  varying float vPulse;

  void main() {
    float gridScale = 36.0;
    vec2 grid = abs(fract(vUv * gridScale - 0.5) - 0.5) / fwidth(vUv * gridScale);
    float line = 1.0 - min(min(grid.x, grid.y), 1.0);

    vec3 cyan = vec3(0.13, 0.82, 0.93);
    vec3 deep = vec3(0.02, 0.05, 0.12);
    vec3 navy = vec3(0.04, 0.12, 0.28);

    float heightGlow = smoothstep(-1.2, 2.0, vElevation) * 0.35;
    float pulseGlow = vPulse * 1.4;
    float scan = 0.08 + 0.06 * sin(vUv.x * 80.0 + uTime * 2.5);

    float glow = line * (0.45 + heightGlow + pulseGlow + scan);
    vec3 color = mix(deep, navy, 0.55);
    color = mix(color, cyan, clamp(glow, 0.0, 1.0));

    float edge = smoothstep(0.0, 0.12, vUv.x) * smoothstep(0.0, 0.12, vUv.y);
    edge *= smoothstep(0.0, 0.12, 1.0 - vUv.x) * smoothstep(0.0, 0.12, 1.0 - vUv.y);
    color *= edge;

    gl_FragColor = vec4(color, 0.92);
  }
`;

const rainVertexShader = /* glsl */ `
  attribute float aChar;
  attribute float aSpeed;
  attribute float aPhase;

  uniform float uTime;
  uniform float uHeight;

  varying float vChar;
  varying float vAlpha;
  varying float vFlicker;

  void main() {
    vChar = aChar;
    vec3 pos = position;
    float fall = mod(pos.y - uTime * aSpeed + aPhase, uHeight) - uHeight * 0.5;
    pos.y = fall;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float depth = clamp(-mv.z / 45.0, 0.0, 1.0);
    vAlpha = (1.0 - depth) * 0.85;
    vFlicker = 0.7 + 0.3 * sin(uTime * 8.0 + aPhase * 3.0);
    gl_PointSize = (42.0 + aSpeed * 12.0) * (1.0 / -mv.z);
  }
`;

const rainFragmentShader = /* glsl */ `
  uniform sampler2D uDigits;

  varying float vChar;
  varying float vAlpha;
  varying float vFlicker;

  void main() {
    vec2 uv = gl_PointCoord;
    uv.x = uv.x * 0.5 + (vChar > 0.5 ? 0.5 : 0.0);
    vec4 tex = texture2D(uDigits, uv);
    if (tex.a < 0.1) discard;
    vec3 cyan = vec3(0.55, 0.92, 1.0);
    gl_FragColor = vec4(cyan * tex.rgb, tex.a * vAlpha * vFlicker);
  }
`;

function makeDigitTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  ctx.clearRect(0, 0, 128, 64);
  ctx.font = "bold 44px ui-monospace, monospace";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("0", 10, 34);
  ctx.fillText("1", 74, 34);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function DataLandscape() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030810, 0.028);
    scene.background = new THREE.Color(0x030810);

    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 220);
    camera.position.set(0, 14, 22);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x030810, 1);
    container.appendChild(renderer.domElement);

    const terrainUniforms = {
      uTime: { value: 0 },
      uPulseOrigin: { value: new THREE.Vector2(0, 0) },
      uPulseTime: { value: 0 },
      uPulseStrength: { value: 0 },
      uCameraPos: { value: camera.position.clone() },
    };

    const terrainGeo = new THREE.PlaneGeometry(
      TERRAIN_SIZE,
      TERRAIN_SIZE,
      TERRAIN_SEGMENTS,
      TERRAIN_SEGMENTS
    );
    terrainGeo.rotateX(-Math.PI / 2);

    const terrainMat = new THREE.ShaderMaterial({
      uniforms: terrainUniforms,
      vertexShader: terrainVertexShader,
      fragmentShader: terrainFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    scene.add(terrain);

    const digitTex = makeDigitTexture();
    const rainPositions = new Float32Array(RAIN_COUNT * 3);
    const rainChars = new Float32Array(RAIN_COUNT);
    const rainSpeeds = new Float32Array(RAIN_COUNT);
    const rainPhases = new Float32Array(RAIN_COUNT);

    for (let i = 0; i < RAIN_COUNT; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * TERRAIN_SIZE * 0.95;
      rainPositions[i * 3 + 1] = (Math.random() - 0.5) * 28;
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * TERRAIN_SIZE * 0.95;
      rainChars[i] = Math.random() < 0.5 ? 0 : 1;
      rainSpeeds[i] = 4 + Math.random() * 10;
      rainPhases[i] = Math.random() * 40;
    }

    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));
    rainGeo.setAttribute("aChar", new THREE.BufferAttribute(rainChars, 1));
    rainGeo.setAttribute("aSpeed", new THREE.BufferAttribute(rainSpeeds, 1));
    rainGeo.setAttribute("aPhase", new THREE.BufferAttribute(rainPhases, 1));

    const rainUniforms = {
      uTime: { value: 0 },
      uHeight: { value: 28 },
      uDigits: { value: digitTex },
    };

    const rainMat = new THREE.ShaderMaterial({
      uniforms: rainUniforms,
      vertexShader: rainVertexShader,
      fragmentShader: rainFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const rain = new THREE.Points(rainGeo, rainMat);
    scene.add(rain);

    const ambient = new THREE.AmbientLight(0x0a1a2e, 0.55);
    const key = new THREE.DirectionalLight(0x67e8f9, 0.85);
    key.position.set(12, 24, 8);
    const rim = new THREE.DirectionalLight(0x22d3ee, 0.35);
    rim.position.set(-18, 10, -12);
    scene.add(ambient, key, rim);

    let W = 0;
    let H = 0;
    let raf = 0;
    let time = reduce ? 2.4 : 0;
    let pulseTime = 0;
    let pulseStrength = 0;
    let pulseActive = false;
    const pulseOrigin = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    const mouseNdc = new THREE.Vector2();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hitPoint = new THREE.Vector3();

    const triggerPulse = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return;
      }

      mouseNdc.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(mouseNdc, camera);

      const hits = raycaster.intersectObject(terrain);
      if (hits.length > 0) {
        hitPoint.copy(hits[0].point);
      } else if (!raycaster.ray.intersectPlane(groundPlane, hitPoint)) {
        return;
      }

      pulseOrigin.set(hitPoint.x, hitPoint.z);
      pulseTime = 0;
      pulseStrength = 1.35;
      pulseActive = true;
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select, label, form")) return;
      triggerPulse(e.clientX, e.clientY);
    };

    let camX = 0;
    let camY = 14;
    let camZ = 22;
    let smoothCamX = 0;
    let smoothCamY = 14;
    let smoothCamZ = 22;

    const resize = () => {
      W = container.clientWidth;
      H = container.clientHeight;
      camera.aspect = W / Math.max(H, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(W, H, false);
    };
    resize();

    const render = () => {
      if (!reduce) time += 0.016;

      if (pulseActive && !reduce) {
        pulseTime += 0.016;
        pulseStrength *= 0.988;
        if (pulseTime * PULSE_SPEED > PULSE_MAX_RANGE || pulseStrength < 0.04) {
          pulseActive = false;
          pulseStrength = 0;
        }
      }

      terrainUniforms.uTime.value = time;
      terrainUniforms.uPulseOrigin.value.copy(pulseOrigin);
      terrainUniforms.uPulseTime.value = pulseTime;
      terrainUniforms.uPulseStrength.value = pulseStrength;
      rainUniforms.uTime.value = time;

      if (!reduce) {
        camX = Math.sin(time * 0.14) * 10;
        camY = 13 + Math.sin(time * 0.09) * 2.2;
        camZ = 21 + Math.cos(time * 0.11) * 5;
        smoothCamX += (camX - smoothCamX) * 0.04;
        smoothCamY += (camY - smoothCamY) * 0.04;
        smoothCamZ += (camZ - smoothCamZ) * 0.04;
      }

      camera.position.set(smoothCamX, smoothCamY, smoothCamZ);
      camera.lookAt(0, 0, 0);
      terrainUniforms.uCameraPos.value.copy(camera.position);

      renderer.render(scene, camera);
      if (!reduce) raf = requestAnimationFrame(render);
    };

    render();
    window.addEventListener("resize", resize);
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      terrainGeo.dispose();
      terrainMat.dispose();
      rainGeo.dispose();
      rainMat.dispose();
      digitTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-hidden"
    />
  );
}
