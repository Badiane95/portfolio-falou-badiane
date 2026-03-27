import { useEffect, useRef, useState } from 'react';
import { mat4, quat, vec2, vec3 } from 'gl-matrix';

/* ─── GLSL shaders ─────────────────────────────────────────────────────────── */

const discVertShaderSource = `#version 300 es

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uCameraPosition;
uniform vec4 uRotationAxisVelocity;
uniform float uFrames;

in vec3 aModelPosition;
in vec3 aModelNormal;
in vec2 aModelUvs;
in mat4 aInstanceMatrix;

out vec2 vUvs;
out float vAlpha;
flat out int vInstanceId;

#define PI 3.141593

void main() {
  vec4 worldPosition = uWorldMatrix * aInstanceMatrix * vec4(aModelPosition, 1.);
  vec3 centerPos = (uWorldMatrix * aInstanceMatrix * vec4(0., 0., 0., 1.)).xyz;
  float radius = length(centerPos.xyz);

  if (gl_VertexID > 0) {
    vec3 rotationAxis = uRotationAxisVelocity.xyz;
    float rotationVelocity = min(.15, uRotationAxisVelocity.w * 15.);
    vec3 stretchDir = normalize(cross(centerPos, rotationAxis));
    vec3 relativeVertexPos = normalize(worldPosition.xyz - centerPos);
    float strength = dot(stretchDir, relativeVertexPos);
    float invAbsStrength = min(0., abs(strength) - 1.);
    strength = rotationVelocity * sign(strength) * abs(invAbsStrength * invAbsStrength * invAbsStrength + 1.);
    worldPosition.xyz += stretchDir * strength;
  }

  worldPosition.xyz = radius * normalize(worldPosition.xyz);
  gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
  vAlpha = smoothstep(0.5, 1., normalize(worldPosition.xyz).z) * .9 + .1;
  vUvs = aModelUvs;
  vInstanceId = gl_InstanceID;
}
`;

const discFragShaderSource = `#version 300 es
precision highp float;

uniform sampler2D uTex;
uniform int uItemCount;
uniform int uAtlasSize;

out vec4 outColor;

in vec2 vUvs;
in float vAlpha;
flat in int vInstanceId;

void main() {
  int itemIndex = vInstanceId % uItemCount;
  int cellsPerRow = uAtlasSize;
  int cellX = itemIndex % cellsPerRow;
  int cellY = itemIndex / cellsPerRow;
  vec2 cellSize = vec2(1.0) / vec2(float(cellsPerRow));
  vec2 cellOffset = vec2(float(cellX), float(cellY)) * cellSize;

  ivec2 texSize = textureSize(uTex, 0);
  float imageAspect = float(texSize.x) / float(texSize.y);
  float containerAspect = 1.0;
  float scale = max(imageAspect / containerAspect, containerAspect / imageAspect);

  vec2 st = vec2(vUvs.x, 1.0 - vUvs.y);
  st = (st - 0.5) * scale + 0.5;
  st = clamp(st, 0.0, 1.0);
  st = st * cellSize + cellOffset;

  outColor = texture(uTex, st);
  outColor.a *= vAlpha;
}
`;

/* ─── Geometry helpers ──────────────────────────────────────────────────────── */

class Face {
  constructor(public a: number, public b: number, public c: number) {}
}

class Vertex {
  position: vec3;
  normal: vec3;
  uv: vec2;
  constructor(x: number, y: number, z: number) {
    this.position = vec3.fromValues(x, y, z);
    this.normal = vec3.create();
    this.uv = vec2.create();
  }
}

class Geometry {
  vertices: Vertex[] = [];
  faces: Face[] = [];

  addVertex(...args: number[]) {
    for (let i = 0; i < args.length; i += 3) {
      this.vertices.push(new Vertex(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  addFace(...args: number[]) {
    for (let i = 0; i < args.length; i += 3) {
      this.faces.push(new Face(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  get lastVertex() { return this.vertices[this.vertices.length - 1]; }

  subdivide(divisions = 1) {
    const midPointCache: Record<string, number> = {};
    let f = this.faces;
    for (let div = 0; div < divisions; ++div) {
      const newFaces = new Array(f.length * 4);
      f.forEach((face, ndx) => {
        const mAB = this.getMidPoint(face.a, face.b, midPointCache);
        const mBC = this.getMidPoint(face.b, face.c, midPointCache);
        const mCA = this.getMidPoint(face.c, face.a, midPointCache);
        const i = ndx * 4;
        newFaces[i + 0] = new Face(face.a, mAB, mCA);
        newFaces[i + 1] = new Face(face.b, mBC, mAB);
        newFaces[i + 2] = new Face(face.c, mCA, mBC);
        newFaces[i + 3] = new Face(mAB, mBC, mCA);
      });
      f = newFaces;
    }
    this.faces = f;
    return this;
  }

  spherize(radius = 1) {
    this.vertices.forEach(vertex => {
      vec3.normalize(vertex.normal, vertex.position);
      vec3.scale(vertex.position, vertex.normal, radius);
    });
    return this;
  }

  get data() {
    return {
      vertices: new Float32Array(this.vertices.flatMap(v => Array.from(v.position))),
      indices: new Uint16Array(this.faces.flatMap(f => [f.a, f.b, f.c])),
      normals: new Float32Array(this.vertices.flatMap(v => Array.from(v.normal))),
      uvs: new Float32Array(this.vertices.flatMap(v => Array.from(v.uv)))
    };
  }

  getMidPoint(ndxA: number, ndxB: number, cache: Record<string, number>) {
    const cacheKey = ndxA < ndxB ? `k_${ndxB}_${ndxA}` : `k_${ndxA}_${ndxB}`;
    if (Object.prototype.hasOwnProperty.call(cache, cacheKey)) return cache[cacheKey];
    const a = this.vertices[ndxA].position;
    const b = this.vertices[ndxB].position;
    const ndx = this.vertices.length;
    cache[cacheKey] = ndx;
    this.addVertex((a[0] + b[0]) * 0.5, (a[1] + b[1]) * 0.5, (a[2] + b[2]) * 0.5);
    return ndx;
  }
}

class IcosahedronGeometry extends Geometry {
  constructor() {
    super();
    const t = Math.sqrt(5) * 0.5 + 0.5;
    this.addVertex(-1,t,0,1,t,0,-1,-t,0,1,-t,0,0,-1,t,0,1,t,0,-1,-t,0,1,-t,t,0,-1,t,0,1,-t,0,-1,-t,0,1)
      .addFace(0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1);
  }
}

class DiscGeometry extends Geometry {
  constructor(steps = 4, radius = 1) {
    super();
    steps = Math.max(4, steps);
    const alpha = (2 * Math.PI) / steps;
    this.addVertex(0, 0, 0);
    this.lastVertex.uv[0] = 0.5;
    this.lastVertex.uv[1] = 0.5;
    for (let i = 0; i < steps; ++i) {
      const x = Math.cos(alpha * i);
      const y = Math.sin(alpha * i);
      this.addVertex(radius * x, radius * y, 0);
      this.lastVertex.uv[0] = x * 0.5 + 0.5;
      this.lastVertex.uv[1] = y * 0.5 + 0.5;
      if (i > 0) this.addFace(0, i, i + 1);
    }
    this.addFace(0, steps, 1);
  }
}

/* ─── WebGL helpers ─────────────────────────────────────────────────────────── */

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(gl: WebGL2RenderingContext, shaderSources: string[], transformFeedbackVaryings: string[] | null, attribLocations: Record<string, number> | null) {
  const program = gl.createProgram()!;
  [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, ndx) => {
    const shader = createShader(gl, type, shaderSources[ndx]);
    if (shader) gl.attachShader(program, shader);
  });
  if (transformFeedbackVaryings) gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.SEPARATE_ATTRIBS);
  if (attribLocations) {
    for (const attrib in attribLocations) gl.bindAttribLocation(program, attribLocations[attrib], attrib);
  }
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

function makeVertexArray(gl: WebGL2RenderingContext, bufLocNumElmPairs: [WebGLBuffer, number, number][], indices?: ArrayLike<number>) {
  const va = gl.createVertexArray()!;
  gl.bindVertexArray(va);
  for (const [buffer, loc, numElem] of bufLocNumElmPairs) {
    if (loc === -1) continue;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, numElem, gl.FLOAT, false, 0, 0);
  }
  if (indices) {
    const indexBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  }
  gl.bindVertexArray(null);
  return va;
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  const dpr = Math.min(2, window.devicePixelRatio);
  const displayWidth = Math.round(canvas.clientWidth * dpr);
  const displayHeight = Math.round(canvas.clientHeight * dpr);
  const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
  if (needResize) { canvas.width = displayWidth; canvas.height = displayHeight; }
  return needResize;
}

function makeBuffer(gl: WebGL2RenderingContext, sizeOrData: Float32Array | number, usage: number) {
  const buf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, sizeOrData as any, usage);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return buf;
}

function createAndSetupTexture(gl: WebGL2RenderingContext, minFilter: number, magFilter: number, wrapS: number, wrapT: number) {
  const texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  return texture;
}

/* ─── ArcballControl ────────────────────────────────────────────────────────── */

class ArcballControl {
  isPointerDown = false;
  orientation = quat.create();
  pointerRotation = quat.create();
  rotationVelocity = 0;
  rotationAxis = vec3.fromValues(1, 0, 0);
  snapDirection = vec3.fromValues(0, 0, -1);
  snapTargetDirection: vec3 | undefined;
  EPSILON = 0.1;
  IDENTITY_QUAT = quat.create();
  pointerPos = vec2.create();
  previousPointerPos = vec2.create();
  _rotationVelocity = 0;
  _combinedQuat = quat.create();

  constructor(private canvas: HTMLCanvasElement, private updateCallback: (dt: number) => void) {
    canvas.addEventListener('pointerdown', e => {
      vec2.set(this.pointerPos, e.clientX, e.clientY);
      vec2.copy(this.previousPointerPos, this.pointerPos);
      this.isPointerDown = true;
    });
    canvas.addEventListener('pointerup', () => { this.isPointerDown = false; });
    canvas.addEventListener('pointerleave', () => { this.isPointerDown = false; });
    canvas.addEventListener('pointermove', e => {
      if (this.isPointerDown) vec2.set(this.pointerPos, e.clientX, e.clientY);
    });
    canvas.style.touchAction = 'none';
  }

  update(deltaTime: number, targetFrameDuration = 16) {
    const timeScale = deltaTime / targetFrameDuration + 0.00001;
    let angleFactor = timeScale;
    const snapRotation = quat.create();

    if (this.isPointerDown) {
      const INTENSITY = 0.3 * timeScale;
      const ANGLE_AMPLIFICATION = 5 / timeScale;
      const midPointerPos = vec2.sub(vec2.create(), this.pointerPos, this.previousPointerPos);
      vec2.scale(midPointerPos, midPointerPos, INTENSITY);
      if (vec2.sqrLen(midPointerPos) > this.EPSILON) {
        vec2.add(midPointerPos, this.previousPointerPos, midPointerPos);
        const p = this.project(midPointerPos);
        const q = this.project(this.previousPointerPos);
        const a = vec3.normalize(vec3.create(), p);
        const b = vec3.normalize(vec3.create(), q);
        vec2.copy(this.previousPointerPos, midPointerPos);
        angleFactor *= ANGLE_AMPLIFICATION;
        this.quatFromVectors(a, b, this.pointerRotation, angleFactor);
      } else {
        quat.slerp(this.pointerRotation, this.pointerRotation, this.IDENTITY_QUAT, INTENSITY);
      }
    } else {
      const INTENSITY = 0.1 * timeScale;
      quat.slerp(this.pointerRotation, this.pointerRotation, this.IDENTITY_QUAT, INTENSITY);
      if (this.snapTargetDirection) {
        const SNAPPING_INTENSITY = 0.2;
        const a = this.snapTargetDirection;
        const b = this.snapDirection;
        const sqrDist = vec3.squaredDistance(a, b);
        const distanceFactor = Math.max(0.1, 1 - sqrDist * 10);
        angleFactor *= SNAPPING_INTENSITY * distanceFactor;
        this.quatFromVectors(a, b, snapRotation, angleFactor);
      }
    }

    const combinedQuat = quat.multiply(quat.create(), snapRotation, this.pointerRotation);
    this.orientation = quat.multiply(quat.create(), combinedQuat, this.orientation);
    quat.normalize(this.orientation, this.orientation);

    const RA_INTENSITY = 0.8 * timeScale;
    quat.slerp(this._combinedQuat, this._combinedQuat, combinedQuat, RA_INTENSITY);
    quat.normalize(this._combinedQuat, this._combinedQuat);

    const rad = Math.acos(this._combinedQuat[3]) * 2.0;
    const s = Math.sin(rad / 2.0);
    let rv = 0;
    if (s > 0.000001) {
      rv = rad / (2 * Math.PI);
      this.rotationAxis[0] = this._combinedQuat[0] / s;
      this.rotationAxis[1] = this._combinedQuat[1] / s;
      this.rotationAxis[2] = this._combinedQuat[2] / s;
    }

    const RV_INTENSITY = 0.5 * timeScale;
    this._rotationVelocity += (rv - this._rotationVelocity) * RV_INTENSITY;
    this.rotationVelocity = this._rotationVelocity / timeScale;
    this.updateCallback(deltaTime);
  }

  quatFromVectors(a: vec3, b: vec3, out: quat, angleFactor = 1) {
    const axis = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), a, b));
    const d = Math.max(-1, Math.min(1, vec3.dot(a, b)));
    const angle = Math.acos(d) * angleFactor;
    quat.setAxisAngle(out, axis, angle);
    return { q: out, axis, angle };
  }

  project(pos: vec2): vec3 {
    const r = 2;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const s = Math.max(w, h) - 1;
    const x = (2 * pos[0] - w - 1) / s;
    const y = (2 * pos[1] - h - 1) / s;
    const xySq = x * x + y * y;
    const rSq = r * r;
    const z = xySq <= rSq / 2.0 ? Math.sqrt(rSq - xySq) : rSq / Math.sqrt(xySq);
    return vec3.fromValues(-x, y, z);
  }
}

/* ─── InfiniteGridMenu ──────────────────────────────────────────────────────── */

export interface MenuItem {
  image: string;
  link: string;
  title: string;
  description: string;
}

class InfiniteGridMenu {
  TARGET_FRAME_DURATION = 1000 / 60;
  SPHERE_RADIUS = 2;
  #time = 0;
  #deltaTime = 0;
  #deltaFrames = 0;
  #frames = 0;
  camera: any;
  smoothRotationVelocity = 0;
  scaleFactor = 1.0;
  movementActive = false;
  gl!: WebGL2RenderingContext;
  viewportSize!: vec2;
  drawBufferSize!: vec2;
  discProgram!: WebGLProgram;
  discLocations!: Record<string, WebGLUniformLocation | number>;
  discGeo!: DiscGeometry;
  discBuffers!: ReturnType<Geometry['data']['constructor']>;
  discVAO!: WebGLVertexArrayObject;
  icoGeo!: IcosahedronGeometry;
  instancePositions!: vec3[];
  DISC_INSTANCE_COUNT!: number;
  discInstances!: { matricesArray: Float32Array; matrices: Float32Array[]; buffer: WebGLBuffer };
  worldMatrix!: mat4;
  tex!: WebGLTexture;
  atlasSize!: number;
  control!: ArcballControl;

  constructor(
    private canvas: HTMLCanvasElement,
    private items: MenuItem[],
    public onActiveItemChange: (index: number) => void,
    public onMovementChange: (isMoving: boolean) => void,
    private onInit: (sketch: InfiniteGridMenu) => void,
    scale = 1.0
  ) {
    this.scaleFactor = scale;
    this.camera = {
      matrix: mat4.create(),
      near: 0.1,
      far: 100,
      fov: Math.PI / 4,
      aspect: 1,
      position: vec3.fromValues(0, 0, 3 * scale),
      up: vec3.fromValues(0, 1, 0),
      matrices: {
        view: mat4.create(),
        projection: mat4.create(),
        inversProjection: mat4.create()
      }
    };
    this.#init();
  }

  async #init() {
    const gl = this.canvas.getContext('webgl2', { antialias: true, alpha: true });
    if (!gl) return;
    this.gl = gl;
    this.viewportSize = vec2.fromValues(this.canvas.clientWidth, this.canvas.clientHeight);
    this.drawBufferSize = vec2.fromValues(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const discProgram = createProgram(gl, [discVertShaderSource, discFragShaderSource], null, {
      aModelPosition: 0, aModelNormal: 1, aModelUvs: 2, aInstanceMatrix: 3
    });
    if (!discProgram) return;
    this.discProgram = discProgram;

    this.discLocations = {
      uWorldMatrix: gl.getUniformLocation(discProgram, 'uWorldMatrix')!,
      uViewMatrix: gl.getUniformLocation(discProgram, 'uViewMatrix')!,
      uProjectionMatrix: gl.getUniformLocation(discProgram, 'uProjectionMatrix')!,
      uCameraPosition: gl.getUniformLocation(discProgram, 'uCameraPosition')!,
      uRotationAxisVelocity: gl.getUniformLocation(discProgram, 'uRotationAxisVelocity')!,
      uTex: gl.getUniformLocation(discProgram, 'uTex')!,
      uItemCount: gl.getUniformLocation(discProgram, 'uItemCount')!,
      uAtlasSize: gl.getUniformLocation(discProgram, 'uAtlasSize')!,
      uFrames: gl.getUniformLocation(discProgram, 'uFrames')!,
      aModelPosition: 0, aModelNormal: 1, aModelUvs: 2, aInstanceMatrix: 3
    };

    this.discGeo = new DiscGeometry(64, 0.44);
    const discData = this.discGeo.data;

    const posBuffer = makeBuffer(gl, discData.vertices, gl.STATIC_DRAW);
    const normalBuffer = makeBuffer(gl, discData.normals, gl.STATIC_DRAW);
    const uvBuffer = makeBuffer(gl, discData.uvs, gl.STATIC_DRAW);

    this.icoGeo = new IcosahedronGeometry();
    this.icoGeo.subdivide(3).spherize(this.SPHERE_RADIUS);
    this.instancePositions = this.icoGeo.vertices.map(v => vec3.clone(v.position));
    this.DISC_INSTANCE_COUNT = this.instancePositions.length;

    const matricesArray = new Float32Array(this.DISC_INSTANCE_COUNT * 16);
    const matrices = Array.from({ length: this.DISC_INSTANCE_COUNT }, (_, i) => {
      return new Float32Array(matricesArray.buffer, i * 16 * 4, 16);
    });

    this.instancePositions.forEach((pos, i) => {
      const m = mat4.create();
      mat4.targetTo(m, pos, [0, 0, 0], [0, 1, 0]);
      mat4.copy(matrices[i], m);
    });

    const instanceBuffer = makeBuffer(gl, matricesArray, gl.STATIC_DRAW);
    this.discInstances = { matricesArray, matrices, buffer: instanceBuffer };

    const instanceLoc = this.discLocations.aInstanceMatrix as number;
    const bufLocPairs: [WebGLBuffer, number, number][] = [
      [posBuffer, 0, 3],
      [normalBuffer, 1, 3],
      [uvBuffer, 2, 2],
    ];

    this.discVAO = makeVertexArray(gl, bufLocPairs, Array.from(discData.indices))!;
    gl.bindVertexArray(this.discVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
    for (let j = 0; j < 4; j++) {
      const loc = instanceLoc + j;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 64, j * 16);
      gl.vertexAttribDivisor(loc, 1);
    }
    gl.bindVertexArray(null);

    this.worldMatrix = mat4.create();
    this.tex = createAndSetupTexture(gl, gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);

    await this.#loadAtlas();

    this.control = new ArcballControl(this.canvas, (dt) => this.#onControlUpdate(dt));
    this.#updateCameraMatrix();
    this.#updateProjectionMatrix(gl);

    this.onInit(this);
  }

  async #loadAtlas() {
    const gl = this.gl;
    const count = this.items.length;
    this.atlasSize = Math.ceil(Math.sqrt(count));
    const cellSize = 256;
    const atlasWidth = this.atlasSize * cellSize;
    const atlasHeight = this.atlasSize * cellSize;
    const offscreenCanvas = new OffscreenCanvas(atlasWidth, atlasHeight);
    const ctx = offscreenCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

    await Promise.all(this.items.map(async (item, i) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = item.image;
      });
      const col = i % this.atlasSize;
      const row = Math.floor(i / this.atlasSize);
      ctx.drawImage(img, col * cellSize, row * cellSize, cellSize, cellSize);
    }));

    const blob = await offscreenCanvas.convertToBlob();
    const bitmap = await createImageBitmap(blob);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
    gl.generateMipmap(gl.TEXTURE_2D);
  }

  run() {
    let lastTime = performance.now();
    const loop = (time: number) => {
      this.#deltaTime = time - lastTime;
      lastTime = time;
      this.#time += this.#deltaTime;
      this.#deltaFrames = this.#deltaTime / this.TARGET_FRAME_DURATION;
      this.#frames += this.#deltaFrames;
      this.control.update(this.#deltaTime, this.TARGET_FRAME_DURATION);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  resize() {
    resizeCanvasToDisplaySize(this.canvas);
    this.#updateProjectionMatrix(this.gl);
    this.#render();
  }

  #render() {
    const gl = this.gl;
    gl.useProgram(this.discProgram);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(this.discLocations.uWorldMatrix as WebGLUniformLocation, false, this.worldMatrix);
    gl.uniformMatrix4fv(this.discLocations.uViewMatrix as WebGLUniformLocation, false, this.camera.matrices.view);
    gl.uniformMatrix4fv(this.discLocations.uProjectionMatrix as WebGLUniformLocation, false, this.camera.matrices.projection);
    gl.uniform3f(this.discLocations.uCameraPosition as WebGLUniformLocation, this.camera.position[0], this.camera.position[1], this.camera.position[2]);
    gl.uniform4f(this.discLocations.uRotationAxisVelocity as WebGLUniformLocation, this.control.rotationAxis[0], this.control.rotationAxis[1], this.control.rotationAxis[2], this.smoothRotationVelocity * 1.1);
    gl.uniform1i(this.discLocations.uItemCount as WebGLUniformLocation, this.items.length);
    gl.uniform1i(this.discLocations.uAtlasSize as WebGLUniformLocation, this.atlasSize);
    gl.uniform1f(this.discLocations.uFrames as WebGLUniformLocation, this.#frames);
    gl.uniform1i(this.discLocations.uTex as WebGLUniformLocation, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.bindVertexArray(this.discVAO);
    gl.drawElementsInstanced(gl.TRIANGLES, this.discGeo.data.indices.length, gl.UNSIGNED_SHORT, 0, this.DISC_INSTANCE_COUNT);
  }

  #updateCameraMatrix() {
    mat4.targetTo(this.camera.matrix, this.camera.position, [0, 0, 0], this.camera.up);
    mat4.invert(this.camera.matrices.view, this.camera.matrix);
  }

  #updateProjectionMatrix(gl: WebGL2RenderingContext) {
    this.camera.aspect = (gl.canvas as HTMLCanvasElement).clientWidth / (gl.canvas as HTMLCanvasElement).clientHeight;
    const height = this.SPHERE_RADIUS * 0.35;
    const distance = this.camera.position[2];
    this.camera.fov = this.camera.aspect > 1
      ? 2 * Math.atan(height / distance)
      : 2 * Math.atan(height / this.camera.aspect / distance);
    mat4.perspective(this.camera.matrices.projection, this.camera.fov, this.camera.aspect, this.camera.near, this.camera.far);
    mat4.invert(this.camera.matrices.inversProjection, this.camera.matrices.projection);
  }

  #onControlUpdate(deltaTime: number) {
    const timeScale = deltaTime / this.TARGET_FRAME_DURATION + 0.0001;
    let damping = 5 / timeScale;
    let cameraTargetZ = 3 * this.scaleFactor;
    const isMoving = this.control.isPointerDown || Math.abs(this.smoothRotationVelocity) > 0.01;
    if (isMoving !== this.movementActive) {
      this.movementActive = isMoving;
      this.onMovementChange(isMoving);
    }

    if (!this.control.isPointerDown) {
      const nearestIdx = this.#findNearestVertexIndex();
      const itemIndex = nearestIdx % Math.max(1, this.items.length);
      this.onActiveItemChange(itemIndex);
      this.control.snapTargetDirection = vec3.normalize(vec3.create(), this.#getVertexWorldPosition(nearestIdx));
    } else {
      cameraTargetZ += this.control.rotationVelocity * 80 + 2.5;
      damping = 7 / timeScale;
    }

    const RV_SMOOTH = 0.3 * timeScale;
    this.smoothRotationVelocity += (this.control.rotationVelocity - this.smoothRotationVelocity) * RV_SMOOTH;
    this.camera.position[2] += (cameraTargetZ - this.camera.position[2]) / damping;
    this.#updateCameraMatrix();
    this.#render();
  }

  #findNearestVertexIndex() {
    const n = this.control.snapDirection;
    const inversOrientation = quat.conjugate(quat.create(), this.control.orientation);
    const nt = vec3.transformQuat(vec3.create(), n, inversOrientation);
    let maxD = -1;
    let nearestVertexIndex = 0;
    for (let i = 0; i < this.instancePositions.length; ++i) {
      const d = vec3.dot(nt, this.instancePositions[i]);
      if (d > maxD) { maxD = d; nearestVertexIndex = i; }
    }
    return nearestVertexIndex;
  }

  #getVertexWorldPosition(index: number) {
    return vec3.transformQuat(vec3.create(), this.instancePositions[index], this.control.orientation);
  }
}

/* ─── React component ───────────────────────────────────────────────────────── */

interface InfiniteMenuProps {
  items?: MenuItem[];
  scale?: number;
}

export default function InfiniteMenu({ items = [], scale = 1.0 }: InfiniteMenuProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleActiveItem = (index: number) => {
      const itemIndex = index % items.length;
      setActiveItem(items[itemIndex]);
    };

    const sketch = new InfiniteGridMenu(canvas, items, handleActiveItem, setIsMoving, sk => sk.run(), scale);

    const handleResize = () => sketch.resize();
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => { window.removeEventListener('resize', handleResize); };
  }, [items, scale]);

  const handleButtonClick = () => {
    if (!activeItem?.link) return;
    if (activeItem.link.startsWith('http')) {
      window.open(activeItem.link, '_blank');
    } else {
      window.location.href = activeItem.link;
    }
  };

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      {activeItem && (
        <>
          <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-center transition-opacity duration-300 ${isMoving ? 'opacity-0' : 'opacity-100'}`}>
            <p className="text-white font-bold text-lg drop-shadow-lg">{activeItem.title}</p>
            <p className="text-white/70 text-sm">{activeItem.description}</p>
          </div>
          <button
            onClick={handleButtonClick}
            className={`absolute bottom-4 right-4 bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-all duration-300 ${isMoving ? 'opacity-0' : 'opacity-100'}`}
          >
            Voir →
          </button>
        </>
      )}
    </div>
  );
}
