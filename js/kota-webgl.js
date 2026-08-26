/**
 * KOTA Original WebGL Perlin Noise Fluid Shader Engine
 * Extracted directly from KOTA chunk 4143-6b83e17252ec01c2.js
 */

(function () {
  "use strict";

  // Classic Perlin 2D Noise by Stefan Gustavson
  const l = `
    vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
    vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float cnoise21(vec2 P) {
      vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
      vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
      Pi = mod(Pi, 289.0);
      vec4 ix = Pi.xzxz;
      vec4 iy = Pi.yyww;
      vec4 fx = Pf.xzxz;
      vec4 fy = Pf.yyww;
      vec4 i = permute(permute(ix) + iy);
      vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
      vec4 gy = abs(gx) - 0.5;
      vec4 tx = floor(gx + 0.5);
      gx = gx - tx;
      vec2 g00 = vec2(gx.x, gy.x);
      vec2 g10 = vec2(gx.y, gy.y);
      vec2 g01 = vec2(gx.z, gy.z);
      vec2 g11 = vec2(gx.w, gy.w);
      vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
      g00 *= norm.x;
      g01 *= norm.y;
      g10 *= norm.z;
      g11 *= norm.w;
      float n00 = dot(g00, vec2(fx.x, fy.x));
      float n10 = dot(g10, vec2(fx.y, fy.y));
      float n01 = dot(g01, vec2(fx.z, fy.z));
      float n11 = dot(g11, vec2(fx.w, fy.w));
      vec2 fade_xy = fade(Pf.xy);
      vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
      float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
      return 2.3 * n_xy;
    }
  `;

  const m = [
    { nr: 1, mouseEffect: 1, distortionAmount: 0.15, shapeAmount: 0.2, noiseOpacity: 0.4, widthMultiplier: 0.6, heightMultiplier: 2, position: { x: -0.1, y: 0.3 }, rotation: 0.7, speedMultiplier: 1, timeStart: 0, background: 15724527 },
    { nr: 2, mouseEffect: 1, distortionAmount: 0.15, shapeAmount: 0.15, noiseOpacity: 0.4, widthMultiplier: 0.4, heightMultiplier: 2, position: { x: -0.1, y: 0.3 }, rotation: 2.7, speedMultiplier: 1, timeStart: 100, background: 15724527 },
    { nr: 3, mouseEffect: 1, distortionAmount: 0.15, shapeAmount: 0.25, noiseOpacity: 0.4, widthMultiplier: 0.5, heightMultiplier: 2, position: { x: -0.2, y: 0.3 }, rotation: 2.5, speedMultiplier: 1, timeStart: 100, background: 15724527 },
    { nr: 4, mouseEffect: 1, distortionAmount: 0.15, shapeAmount: 0.25, noiseOpacity: 0.4, widthMultiplier: 0.6, heightMultiplier: 2, position: { x: 0.2, y: 0 }, rotation: 3.5, speedMultiplier: 1, timeStart: -100, background: 15724527 },
    { nr: 5, mouseEffect: 1, distortionAmount: 0.15, shapeAmount: 0.25, noiseOpacity: 0.4, widthMultiplier: 0.5, heightMultiplier: 1.9, position: { x: -0.3, y: 0.3 }, rotation: 1.1, speedMultiplier: 1, timeStart: -100, background: 15724527 },
    { nr: 6, mouseEffect: 1, distortionAmount: 0.15, shapeAmount: 0.25, noiseOpacity: 0.4, widthMultiplier: 0.3, heightMultiplier: 2, position: { x: 0.05, y: -0.1 }, rotation: 4.7, speedMultiplier: 1, timeStart: -100, background: 0 }
  ];

  const d = ["#F2E6DB", "#71D9E9", "#8c3dd0", "#D03F83", "#F43FF9", "#8c3dd0"];

  const v = `
    varying vec2 uPos;
    varying vec2 vUv;
    uniform vec2 uRayMouse;
    uniform float uMouseEffect;
    uniform float uRatio;
    float uTrailWidth = 0.15; 
    float PI = 3.141592653589793;

    void main() {
      vUv = uv;
      vec2 direction = normalize(position.xy - uRayMouse);
      float distanceToMouse = length(position.xy - uRayMouse);
      float falloff = smoothstep(0.0, uTrailWidth, distanceToMouse);
      float displacement = uMouseEffect * 0.1 * falloff;
      vec3 newPosition = vec3(position.xy - direction * displacement / 2.0, position.z);
      uPos = direction * displacement * 2.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const f = `
    uniform float uTime;
    uniform vec2 uRayMouse;
    uniform float uMouseEffect;
    uniform float uNoiseAmount;
    uniform float uAmount;
    uniform float uPow;
    uniform float uAlpha;
    varying vec2 vUv;
    varying vec2 uPos;
    uniform vec3 uColor[6];
    float PI = 3.141592653589793;

    ${l}

    void main() {
      vec3 firstColor = uColor[0];
      vec2 seed = (vUv * -uPos) * mix(vUv, uPos, 30.0 * uAmount);
      float ml = pow(6.0, 0.5) * -0.01;
      float n = cnoise21(seed) + 1.0 * uTime;
      vec3 color;
      color = mix(firstColor, firstColor, cnoise21(seed) / 1000.0);

      for (int i = 1; i < 5; i++) {
        float amount = (float(i) + 1.0) * 0.09;
        float n2 = smoothstep(amount * uTime + ml, amount * uTime + ml + amount * uTime, n * uTime);
        color = mix(color, uColor[i], n2);
      }

      float alpha = uAlpha * pow(sin(vUv.x * PI), uPow);
      alpha *= pow((sin(vUv.y * PI)), uPow);
      gl_FragColor = vec4(color, alpha);
    }
  `;

  class KotaWebGL {
    constructor(t) {
      this.scene = new THREE.Scene();
      this.container = t.dom;
      this.darkBackground = t.darkBackground || false;
      this.scrollTriggerOpacity = t.scrollTriggerOpacity || 0.5;
      
      const bgIndex = Number(this.container.dataset.background) || 4;
      this.activeBackground = m[bgIndex] || m[4];

      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor(0xefefef, 1);
      
      this.container.innerHTML = "";
      this.container.appendChild(this.renderer.domElement);

      this.positionZ = 4000;
      this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 10, 10000);
      this.camera.position.z = this.positionZ;
      this.camera.aspect = this.width / this.height;
      this.camera.fov = 2 * Math.atan(this.height / 2 / this.positionZ) * 180 / Math.PI;
      this.camera.updateProjectionMatrix();

      this.time = this.activeBackground.timeStart;
      this.uTime = 0.15;
      this.reverseUTime = false;
      this.uMouse = new THREE.Vector2(0, 0);
      this.rayMouse = new THREE.Vector2(-0.4, -0.4);
      this.allowRayMouse = true;
      this.raycaster = new THREE.Raycaster();

      if (window.gsap && gsap.quickTo) {
        this.rayXTo = gsap.quickTo(this.rayMouse, "x", { duration: 0.75, ease: "power1" });
        this.rayYTo = gsap.quickTo(this.rayMouse, "y", { duration: 0.75, ease: "power1" });
      }

      this.settings = {
        darkBackground: true,
        mouseEffect: this.activeBackground.mouseEffect,
        distortionAmount: this.activeBackground.distortionAmount,
        shapeAmount: this.activeBackground.shapeAmount,
        rotation: this.activeBackground.rotation,
        positionX: this.activeBackground.position.x,
        positionY: this.activeBackground.position.y,
        widthMultiplier: this.activeBackground.widthMultiplier,
        heightMultiplier: this.activeBackground.heightMultiplier,
        speedMultiplier: this.activeBackground.speedMultiplier,
        noiseOpacity: this.activeBackground.noiseOpacity
      };

      this.addObjects();
      this.resize();
      this.setupResize();
      this.followMouse();
      this.animateIn(2, 0.2);
      this.render();
    }

    setupResize() {
      window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.fov = 2 * Math.atan(this.height / 2 / this.positionZ) * 180 / Math.PI;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.initResponsivePositioning();
    }

    followMouse() {
      let t = (window.gsap && gsap.quickTo) ? gsap.quickTo(this.uMouse, "x", { duration: 0.5, ease: "power1" }) : (v => this.uMouse.x = v);
      let e = (window.gsap && gsap.quickTo) ? gsap.quickTo(this.uMouse, "y", { duration: 0.5, ease: "power1" }) : (v => this.uMouse.y = v);

      window.addEventListener("mousemove", i => {
        t(i.clientX / this.width - 0.5);
        e(i.clientY / this.height - 0.5);
        this.checkPositionOnPlane(i);
      });
    }

    checkPositionOnPlane(t) {
      let e = new THREE.Vector2();
      e.x = (t.clientX / window.innerWidth) * 2 - 1;
      e.y = -(t.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(e, this.camera);
      let i = this.raycaster.intersectObject(this.plane);
      if (i.length > 0 && this.allowRayMouse) {
        if (this.rayXTo && this.rayYTo) {
          this.rayXTo(i[0].point.x / this.plane.scale.x);
          this.rayYTo(i[0].point.y / this.plane.scale.y);
        } else {
          this.rayMouse.x = i[0].point.x / this.plane.scale.x;
          this.rayMouse.y = i[0].point.y / this.plane.scale.y;
        }
      }
    }

    addObjects() {
      const colors = d.map(t => new THREE.Color(t));
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0.15 },
          uNoiseAmount: { value: 0 },
          uRayMouse: { value: this.rayMouse },
          uAmount: { value: this.activeBackground.shapeAmount },
          uPow: { value: 1.5 },
          uAlpha: { value: 1.0 },
          uColor: { value: colors },
          uMouseEffect: { value: this.activeBackground.mouseEffect },
          uVelocity: { value: 0 },
          uRatio: { value: 1 }
        },
        side: THREE.DoubleSide,
        transparent: true,
        vertexShader: v,
        fragmentShader: f
      });

      this.geometry = new THREE.PlaneGeometry(1, 1, 128, 128);
      this.plane = new THREE.Mesh(this.geometry, this.material);
      this.camera.rotation.z = this.activeBackground.rotation;
      this.initResponsivePositioning();
      this.scene.add(this.plane);
    }

    initResponsivePositioning() {
      this.plane.scale.x = this.activeBackground.widthMultiplier * this.width;
      this.plane.scale.y = this.activeBackground.heightMultiplier * (1.25 * this.height);
      this.plane.scale.z = this.activeBackground.widthMultiplier * this.width;
      this.camera.position.x = this.activeBackground.position.x * this.width;
      this.camera.position.y = -this.activeBackground.position.y * this.height;
      if (this.plane.material && this.plane.material.uniforms && this.plane.material.uniforms.uRatio) {
        this.plane.material.uniforms.uRatio.value = this.plane.scale.x / this.plane.scale.y;
      }
    }

    animateIn(t, e) {
      if (window.gsap && gsap.to) {
        gsap.to(this.material.uniforms.uPow, { value: 1.5, duration: t, delay: e, ease: "power4.out" });
        gsap.to(this.material.uniforms.uAlpha, { value: 1.0, duration: t, delay: e, ease: "power4.out" });
        this.allowRayMouse = false;
        gsap.to(this.rayMouse, {
          x: -0.4,
          y: -0.4,
          duration: t,
          ease: "power1.out",
          onComplete: () => { this.allowRayMouse = true; }
        });
      } else {
        this.material.uniforms.uPow.value = 1.5;
        this.material.uniforms.uAlpha.value = 1.0;
        this.allowRayMouse = true;
      }
    }

    render() {
      this.time += 0.01;
      if (this.reverseUTime) {
        this.uTime -= 0.001;
        if (this.uTime < 0.1) this.reverseUTime = false;
      } else {
        this.uTime += 0.001;
        if (this.uTime > 0.5) this.reverseUTime = true;
      }

      this.material.uniforms.uTime.value = this.uTime;
      this.material.uniforms.uRayMouse.value = this.rayMouse;

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.render.bind(this));
    }
  }

  function start() {
    let container = document.querySelector(".webgl-background_container__Ojc1v");
    if (!container) {
      container = document.createElement("div");
      container.className = "webgl-background_container__Ojc1v";
      container.dataset.background = "4";
      container.dataset.darkBackground = "false";
      container.dataset.position = "fixed";
      container.dataset.noise = "true";
      document.body.prepend(container);
    }
    if (typeof THREE !== "undefined") {
      new KotaWebGL({ dom: container, darkBackground: false, scrollTriggerOpacity: 0.5 });
    } else {
      setTimeout(start, 30);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
