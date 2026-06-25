// Component inspired by Kevin Levron:
// https://x.com/soju22/status/1858925191671271801

import { useEffect, useRef } from 'react';
import {
  Vector3,
  Euler,
  MeshPhysicalMaterial,
  InstancedMesh,
  Timer,
  AmbientLight,
  SphereGeometry,
  Scene,
  Color,
  Object3D,
  SRGBColorSpace,
  MathUtils,
  PMREMGenerator,
  Vector2,
  WebGLRenderer,
  PerspectiveCamera,
  PointLight,
  ACESFilmicToneMapping,
  Plane,
  Raycaster
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

class ThreeBase {
  #props;
  canvas!: HTMLCanvasElement;
  camera!: PerspectiveCamera;
  cameraMinAspect?: number;
  cameraMaxAspect?: number;
  cameraFov!: number;
  maxPixelRatio?: number;
  minPixelRatio?: number;
  scene!: Scene;
  renderer!: WebGLRenderer;
  #postprocessing: any;
  size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  render = this.#defaultRender;
  onBeforeRender: (t: { elapsed: number; delta: number }) => void = () => {};
  onAfterRender: (t: { elapsed: number; delta: number }) => void = () => {};
  onAfterResize: (size: any) => void = () => {};
  #isVisible = false;
  #isAnimating = false;
  isDisposed = false;
  #resizeTimeout: any;
  #resizeObserver: ResizeObserver | null = null;
  #intersectionObserver: IntersectionObserver | null = null;
  #timer = new Timer();
  #time = { elapsed: 0, delta: 0 };
  #animationId: number | undefined;

  constructor(props: any) {
    this.#props = { ...props };
    this.#setupScene();
    this.#setupCamera();
    this.#setupRenderer();
    this.resize();
    this.#setupObservers();
  }

  #setupScene() {
    this.scene = new Scene();
  }

  #setupCamera() {
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
  }

  #setupRenderer() {
    if (this.#props.canvas) {
      this.canvas = this.#props.canvas;
    } else if (this.#props.id) {
      this.canvas = document.getElementById(this.#props.id) as HTMLCanvasElement;
    } else {
      console.error('Three: Missing canvas or id parameter');
      throw new Error('Missing canvas or id parameter');
    }
    this.canvas.style.display = 'block';
    const options = {
      canvas: this.canvas,
      powerPreference: 'high-performance' as WebGLPowerPreference,
      ...(this.#props.rendererOptions ?? {})
    };
    this.renderer = new WebGLRenderer(options);
    this.renderer.outputColorSpace = SRGBColorSpace;
  }

  #setupObservers() {
    if (!(this.#props.size instanceof Object)) {
      window.addEventListener('resize', this.#handleResize.bind(this));
      if (this.#props.size === 'parent' && this.canvas.parentNode) {
        this.#resizeObserver = new ResizeObserver(this.#handleResize.bind(this));
        this.#resizeObserver.observe(this.canvas.parentNode as Element);
      }
    }
    this.#intersectionObserver = new IntersectionObserver(this.#handleVisibility.bind(this), {
      root: null,
      rootMargin: '0px',
      threshold: 0
    });
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener('visibilitychange', this.#handleVisibilityChange.bind(this));
  }

  #removeObservers() {
    window.removeEventListener('resize', this.#handleResize.bind(this));
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.#handleVisibilityChange.bind(this));
  }

  #handleVisibility(entries: IntersectionObserverEntry[]) {
    this.#isVisible = entries[0].isIntersecting;
    this.#isVisible ? this.#start() : this.#stop();
  }

  #handleVisibilityChange() {
    if (this.#isVisible) {
      document.hidden ? this.#stop() : this.#start();
    }
  }

  #handleResize() {
    if (this.#resizeTimeout) clearTimeout(this.#resizeTimeout);
    this.#resizeTimeout = setTimeout(this.resize.bind(this), 100);
  }

  resize() {
    let width: number, height: number;
    if (this.#props.size instanceof Object) {
      width = this.#props.size.width;
      height = this.#props.size.height;
    } else if (this.#props.size === 'parent' && this.canvas.parentNode) {
      width = (this.canvas.parentNode as HTMLElement).offsetWidth;
      height = (this.canvas.parentNode as HTMLElement).offsetHeight;
    } else {
      width = window.innerWidth;
      height = window.innerHeight;
    }
    this.size.width = width;
    this.size.height = height;
    this.size.ratio = width / height;
    this.#updateCamera();
    this.#updateRendererSize();
    this.onAfterResize(this.size);
  }

  #updateCamera() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.#adjustFov(this.cameraMinAspect);
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.#adjustFov(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }

  #adjustFov(targetAspect: number) {
    const halfFov = Math.tan(MathUtils.degToRad(this.cameraFov / 2)) / (this.camera.aspect / targetAspect);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(halfFov));
  }

  updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const fovRad = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    }
  }

  #updateRendererSize() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.#postprocessing?.setSize(this.size.width, this.size.height);
    let pixelRatio = window.devicePixelRatio;
    if (this.maxPixelRatio && pixelRatio > this.maxPixelRatio) {
      pixelRatio = this.maxPixelRatio;
    } else if (this.minPixelRatio && pixelRatio < this.minPixelRatio) {
      pixelRatio = this.minPixelRatio;
    }
    this.renderer.setPixelRatio(pixelRatio);
    this.size.pixelRatio = pixelRatio;
  }

  get postprocessing() {
    return this.#postprocessing;
  }

  set postprocessing(pp: any) {
    this.#postprocessing = pp;
    this.render = pp.render.bind(pp);
  }

  #start() {
    if (this.#isAnimating) return;
    const animate = () => {
      this.#animationId = requestAnimationFrame(animate);
      this.#timer.update();
      this.#time.delta = this.#timer.getDelta();
      this.#time.elapsed += this.#time.delta;
      this.onBeforeRender(this.#time);
      this.render();
      this.onAfterRender(this.#time);
    };
    this.#isAnimating = true;
    this.#timer.reset();
    animate();
  }

  #stop() {
    if (this.#isAnimating) {
      cancelAnimationFrame(this.#animationId!);
      this.#isAnimating = false;
    }
  }

  #defaultRender() {
    this.renderer.render(this.scene, this.camera);
  }

  clear() {
    this.scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        if (mat.map) mat.map.dispose();
        if (mat.envMap) mat.envMap.dispose();
        mat.dispose();
        child.geometry.dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    this.#removeObservers();
    this.#stop();
    this.#timer.dispose();
    this.clear();
    this.#postprocessing?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.isDisposed = true;
  }
}

// --- Pointer Interaction ---
const interactionMap = new Map<HTMLElement, any>();
const globalMouse = new Vector2();
let isListening = false;

interface InteractionState {
  position: Vector2;
  nPosition: Vector2;
  hover: boolean;
  touching: boolean;
  onEnter: (state: any) => void;
  onMove: (state: any) => void;
  onClick: (state: any) => void;
  onLeave: () => void;
  dispose: () => void;
}

function setupInteraction(domElement: HTMLElement, config: any): InteractionState {
  const state: InteractionState = {
    position: new Vector2(),
    nPosition: new Vector2(),
    hover: false,
    touching: false,
    onEnter: config.onEnter || (() => {}),
    onMove: config.onMove || (() => {}),
    onClick: config.onClick || (() => {}),
    onLeave: config.onLeave || (() => {}),
    dispose: () => {}
  };

  if (!interactionMap.has(domElement)) {
    interactionMap.set(domElement, state);
    if (!isListening) {
      document.body.addEventListener('pointermove', onPointerMove);
      document.body.addEventListener('pointerleave', onPointerLeave);
      document.body.addEventListener('click', onClick);
      document.body.addEventListener('touchstart', onTouchStart, { passive: false });
      document.body.addEventListener('touchmove', onTouchMove, { passive: false });
      document.body.addEventListener('touchend', onTouchEnd, { passive: false });
      document.body.addEventListener('touchcancel', onTouchEnd, { passive: false });
      isListening = true;
    }
  }

  state.dispose = () => {
    interactionMap.delete(domElement);
    if (interactionMap.size === 0) {
      document.body.removeEventListener('pointermove', onPointerMove);
      document.body.removeEventListener('pointerleave', onPointerLeave);
      document.body.removeEventListener('click', onClick);
      document.body.removeEventListener('touchstart', onTouchStart);
      document.body.removeEventListener('touchmove', onTouchMove);
      document.body.removeEventListener('touchend', onTouchEnd);
      document.body.removeEventListener('touchcancel', onTouchEnd);
      isListening = false;
    }
  };

  return state;
}

function updateInteractionPosition(state: any, rect: DOMRect) {
  state.position.x = globalMouse.x - rect.left;
  state.position.y = globalMouse.y - rect.top;
  state.nPosition.x = (state.position.x / rect.width) * 2 - 1;
  state.nPosition.y = (-state.position.y / rect.height) * 2 + 1;
}

function isInside(rect: DOMRect) {
  return (
    globalMouse.x >= rect.left &&
    globalMouse.x <= rect.left + rect.width &&
    globalMouse.y >= rect.top &&
    globalMouse.y <= rect.top + rect.height
  );
}

function processInteraction() {
  for (const [elem, state] of interactionMap) {
    const rect = elem.getBoundingClientRect();
    if (isInside(rect)) {
      updateInteractionPosition(state, rect);
      if (!state.hover) {
        state.hover = true;
        state.onEnter(state);
      }
      state.onMove(state);
    } else if (state.hover && !state.touching) {
      state.hover = false;
      state.onLeave(state);
    }
  }
}

function onPointerMove(e: PointerEvent) {
  globalMouse.x = e.clientX;
  globalMouse.y = e.clientY;
  processInteraction();
}

function onClick(e: MouseEvent) {
  globalMouse.x = e.clientX;
  globalMouse.y = e.clientY;
  for (const [elem, state] of interactionMap) {
    const rect = elem.getBoundingClientRect();
    updateInteractionPosition(state, rect);
    if (isInside(rect)) state.onClick(state);
  }
}

function onPointerLeave() {
  for (const state of interactionMap.values()) {
    if (state.hover) {
      state.hover = false;
      state.onLeave(state);
    }
  }
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length > 0) {
    e.preventDefault();
    globalMouse.x = e.touches[0].clientX;
    globalMouse.y = e.touches[0].clientY;
    for (const [elem, state] of interactionMap) {
      const rect = elem.getBoundingClientRect();
      if (isInside(rect)) {
        state.touching = true;
        updateInteractionPosition(state, rect);
        if (!state.hover) {
          state.hover = true;
          state.onEnter(state);
        }
        state.onMove(state);
      }
    }
  }
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length > 0) {
    e.preventDefault();
    globalMouse.x = e.touches[0].clientX;
    globalMouse.y = e.touches[0].clientY;
    for (const [elem, state] of interactionMap) {
      const rect = elem.getBoundingClientRect();
      updateInteractionPosition(state, rect);
      if (isInside(rect)) {
        if (!state.hover) {
          state.hover = true;
          state.touching = true;
          state.onEnter(state);
        }
        state.onMove(state);
      } else if (state.hover && state.touching) {
        state.onMove(state);
      }
    }
  }
}

function onTouchEnd() {
  for (const state of interactionMap.values()) {
    if (state.touching) {
      state.touching = false;
      if (state.hover) {
        state.hover = false;
        state.onLeave(state);
      }
    }
  }
}

// --- Physics ---
const _F = new Vector3();
const _I = new Vector3();
const _O = new Vector3();
const _V = new Vector3();
const _B = new Vector3();
const _N = new Vector3();
const __ = new Vector3();
const _j = new Vector3();
const _H = new Vector3();
const _T = new Vector3();

class BallPhysics {
  config: any;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center = new Vector3();

  constructor(config: any) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.#initPositions();
    this.setSizes();
  }

  #initPositions() {
    const { config, positionData } = this;
    this.center.toArray(positionData, 0);
    for (let i = 1; i < config.count; i++) {
      const base = 3 * i;
      positionData[base] = MathUtils.randFloatSpread(2 * config.maxX);
      positionData[base + 1] = MathUtils.randFloatSpread(2 * config.maxY);
      positionData[base + 2] = MathUtils.randFloatSpread(2 * config.maxZ);
    }
  }

  setSizes() {
    const { config, sizeData } = this;
    sizeData[0] = config.size0;
    for (let i = 1; i < config.count; i++) {
      sizeData[i] = MathUtils.randFloat(config.minSize, config.maxSize);
    }
  }

  update(time: { delta: number }) {
    const { config, center, positionData, sizeData, velocityData } = this;
    let startIdx = 0;
    if (config.controlSphere0) {
      startIdx = 1;
      _F.fromArray(positionData, 0);
      _F.lerp(center, 0.1).toArray(positionData, 0);
      _V.set(0, 0, 0).toArray(velocityData, 0);
    }
    for (let idx = startIdx; idx < config.count; idx++) {
      const base = 3 * idx;
      _I.fromArray(positionData, base);
      _B.fromArray(velocityData, base);
      _B.y -= time.delta * config.gravity * sizeData[idx];
      _B.multiplyScalar(config.friction);
      _B.clampLength(0, config.maxVelocity);
      _I.add(_B);
      _I.toArray(positionData, base);
      _B.toArray(velocityData, base);
    }
    for (let idx = startIdx; idx < config.count; idx++) {
      const base = 3 * idx;
      _I.fromArray(positionData, base);
      _B.fromArray(velocityData, base);
      const radius = sizeData[idx];
      for (let jdx = idx + 1; jdx < config.count; jdx++) {
        const otherBase = 3 * jdx;
        _O.fromArray(positionData, otherBase);
        _N.fromArray(velocityData, otherBase);
        const otherRadius = sizeData[jdx];
        __.copy(_O).sub(_I);
        const dist = __.length();
        const sumRadius = radius + otherRadius;
        if (dist < sumRadius) {
          const overlap = sumRadius - dist;
          _j.copy(__).normalize().multiplyScalar(0.5 * overlap);
          _H.copy(_j).multiplyScalar(Math.max(_B.length(), 1));
          _T.copy(_j).multiplyScalar(Math.max(_N.length(), 1));
          _I.sub(_j);
          _B.sub(_H);
          _I.toArray(positionData, base);
          _B.toArray(velocityData, base);
          _O.add(_j);
          _N.add(_T);
          _O.toArray(positionData, otherBase);
          _N.toArray(velocityData, otherBase);
        }
      }
      if (config.controlSphere0) {
        __.copy(_F).sub(_I);
        const dist = __.length();
        const sumRadius0 = radius + sizeData[0];
        if (dist < sumRadius0) {
          const diff = sumRadius0 - dist;
          _j.copy(__.normalize()).multiplyScalar(diff);
          _H.copy(_j).multiplyScalar(Math.max(_B.length(), 2));
          _I.sub(_j);
          _B.sub(_H);
        }
      }
      if (Math.abs(_I.x) + radius > config.maxX) {
        _I.x = Math.sign(_I.x) * (config.maxX - radius);
        _B.x = -_B.x * config.wallBounce;
      }
      if (config.gravity === 0) {
        if (Math.abs(_I.y) + radius > config.maxY) {
          _I.y = Math.sign(_I.y) * (config.maxY - radius);
          _B.y = -_B.y * config.wallBounce;
        }
      } else if (_I.y - radius < -config.maxY) {
        _I.y = -config.maxY + radius;
        _B.y = -_B.y * config.wallBounce;
      }
      const maxBoundary = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(_I.z) + radius > maxBoundary) {
        _I.z = Math.sign(_I.z) * (config.maxZ - radius);
        _B.z = -_B.z * config.wallBounce;
      }
      _I.toArray(positionData, base);
      _B.toArray(velocityData, base);
    }
  }
}

// --- Simple Material (no custom shader) ---
function makeMaterial(envTexture: any) {
  const mat = new MeshPhysicalMaterial({
    envMap: envTexture,
    metalness: 0.5,
    roughness: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
  });
  mat.defines = mat.defines || {};
  mat.defines.USE_UV = '';
  mat.envMapRotation = new Euler(-Math.PI / 2, 0, 0);
  return mat;
}

// --- Default Config ---
const defaultConfig = {
  count: 100,
  colors: [0x0052CC, 0x06B6D4, 0x3B82F6],
  ambientColor: 0xffffff,
  ambientIntensity: 1,
  lightIntensity: 200,
  materialParams: {},
  minSize: 0.3,
  maxSize: 0.8,
  size0: 1,
  gravity: 0.005,
  friction: 0.995,
  wallBounce: 0.9,
  maxVelocity: 0.4,
  maxX: 15,
  maxY: 10,
  maxZ: 8,
  controlSphere0: false,
  followCursor: false
};

const _dummy = new Object3D();

// --- Instanced Mesh with Physics ---
class BallInstancedMesh extends InstancedMesh {
  config: any;
  physics: BallPhysics;
  ambientLight: AmbientLight;
  light: PointLight;

  constructor(renderer: WebGLRenderer, config: any = {}) {
    const cfg = { ...defaultConfig, ...config };
    const pmremGenerator = new PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment()).texture;
    pmremGenerator.dispose();

    const geometry = new SphereGeometry();
    const material = makeMaterial(envTexture);

    super(geometry, material, cfg.count);
    this.config = cfg;
    this.physics = new BallPhysics(cfg);
    this.ambientLight = new AmbientLight(cfg.ambientColor, cfg.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new PointLight(cfg.colors[0], cfg.lightIntensity);
    this.add(this.light);
    this.setColors(cfg.colors);
  }

  setColors(colors: number[]) {
    if (Array.isArray(colors) && colors.length > 1) {
      const colorObjs = colors.map(c => new Color(c));
      for (let idx = 0; idx < this.count; idx++) {
        const ratio = idx / this.count;
        const scaled = Math.max(0, Math.min(1, ratio)) * (colors.length - 1);
        const colorIdx = Math.floor(scaled);
        const alpha = scaled - colorIdx;
        const start = colorObjs[colorIdx];
        const end = colorObjs[Math.min(colorIdx + 1, colors.length - 1)];
        const out = new Color();
        out.r = start.r + alpha * (end.r - start.r);
        out.g = start.g + alpha * (end.g - start.g);
        out.b = start.b + alpha * (end.b - start.b);
        this.setColorAt(idx, out);
        if (idx === 0) {
          this.light.color.copy(out);
        }
      }
      this.instanceColor!.needsUpdate = true;
    }
  }

  update(time: { delta: number }) {
    this.physics.update(time);
    for (let idx = 0; idx < this.count; idx++) {
      _dummy.position.fromArray(this.physics.positionData, 3 * idx);
      if (idx === 0 && !this.config.followCursor) {
        _dummy.scale.setScalar(0);
      } else {
        _dummy.scale.setScalar(this.physics.sizeData[idx]);
      }
      _dummy.updateMatrix();
      this.setMatrixAt(idx, _dummy.matrix);
      if (idx === 0) this.light.position.copy(_dummy.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

// --- Factory ---
function createBallpit(canvas: HTMLCanvasElement, config: any = {}) {
  const three = new ThreeBase({
    canvas,
    rendererOptions: { antialias: true, alpha: true }
  });
  let spheres: BallInstancedMesh;
  three.renderer.toneMapping = ACESFilmicToneMapping;
  three.camera.position.set(0, 0, 20);
  three.camera.lookAt(0, 0, 0);
  three.cameraMaxAspect = 1.5;

  three.onAfterResize = (size: any) => {
    if (spheres) {
      spheres.config.maxX = size.wWidth / 2;
      spheres.config.maxY = size.wHeight / 2;
    }
  };

  three.resize();

  function initialize(cfg: any) {
    if (spheres) {
      three.clear();
      three.scene.remove(spheres);
    }
    spheres = new BallInstancedMesh(three.renderer, cfg);
    spheres.config.maxX = three.size.wWidth / 2;
    spheres.config.maxY = three.size.wHeight / 2;
    three.scene.add(spheres);
  }

  initialize(config);

  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const intersectPoint = new Vector3();
  let paused = false;

  canvas.style.touchAction = 'none';
  canvas.style.userSelect = 'none';
  (canvas.style as any).webkitUserSelect = 'none';

  const interaction = setupInteraction(canvas, {
    onMove(state: any) {
      raycaster.setFromCamera(state.nPosition, three.camera);
      three.camera.getWorldDirection(plane.normal);
      raycaster.ray.intersectPlane(plane, intersectPoint);
      if (intersectPoint) {
        spheres.physics.center.copy(intersectPoint);
        spheres.config.controlSphere0 = true;
      }
    },
    onLeave() {
      spheres.config.controlSphere0 = false;
    }
  });

  three.onBeforeRender = (time: { delta: number }) => {
    if (!paused) spheres.update(time);
  };

  return {
    three,
    get spheresInst() {
      return spheres;
    },
    setCount(count: number) {
      initialize({ ...spheres.config, count });
    },
    togglePause() {
      paused = !paused;
    },
    dispose() {
      interaction.dispose();
      three.dispose();
    }
  };
}

// --- React Component ---
interface BallpitProps {
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  followCursor?: boolean;
  className?: string;
}

export default function Ballpit({
  className = '',
  followCursor = true,
  ...props
}: BallpitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<ReturnType<typeof createBallpit> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    instanceRef.current = createBallpit(canvas, { followCursor, ...props });

    return () => {
      instanceRef.current?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        zIndex: -1
      }}
    />
  );
}
