/**
 * KOTA FAQs WebGL Background Engine & Interactive Effects
 * Features:
 * - Three.js WebGL Perlin Noise dynamic mesh deformation & gradient flow
 * - Interactive mouse velocity raycasting & smooth GSAP physics
 * - DotScreenShader / Perlin distortion post-processing
 * - Full preloader transition
 * - Primary navigation menu flyout & submenus
 * - Magnetic button hover physics
 * - FAQ Accordion interactive toggle
 * - Footer copy-to-clipboard email tooltip
 */

(function () {
  'use strict';

  // Remove preloader smoothly on load
  function dismissPreloader() {
    const preloader = document.getElementById('page-preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 700);
    }
    const fixedCovers = document.querySelectorAll('body > div');
    fixedCovers.forEach(el => {
      if (el.style && (el.style.background === 'rgb(239, 239, 239)' || el.style.background === '#efefef') && el.style.position === 'fixed') {
        el.style.transition = 'opacity 0.6s ease';
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        setTimeout(() => {
          if (el.parentElement) el.remove();
        }, 700);
      }
    });
  }

  if (document.readyState === 'complete') {
    dismissPreloader();
  } else {
    window.addEventListener('load', dismissPreloader);
    document.addEventListener('DOMContentLoaded', dismissPreloader);
  }

  // Ensure noise texture opacity CSS variable is applied
  document.querySelectorAll('.webgl-background_container__Ojc1v').forEach(el => {
    el.style.setProperty('--opacity', '0.4');
  });

  // Background configurations matching KOTA spec
  const bgConfigs = [
    { nr: 0, mouseEffect: 1, distortionAmount: 0.15, shapeAmount: 0.2, noiseOpacity: 0.4, widthMultiplier: 0.6, heightMultiplier: 2, position: { x: -0.1, y: 0.3 }, rotation: 0.7, speedMultiplier: 1, timeStart: 0, background: 0xefefef },
    { nr: 1, mouseEffect: 1, distortionAmount: 0.15, shapeAmount: 0.2, noiseOpacity: 0.4, widthMultiplier: 0.6, heightMultiplier: 2, position: { x: -0.1, y: 0.3 }, rotation: 0.7, speedMultiplier: 1, timeStart: 0, background: 0xefefef },
    { nr: 2, mouseEffect: 1, distortionAmount: 0.15, shapeAmount: 0.15, noiseOpacity: 0.4, widthMultiplier: 0.4, heightMultiplier: 2, position: { x: -0.1, y: 0.3 }, rotation: 2.7, speedMultiplier: 1, timeStart: 100, background: 0xefefef },
    { nr: 3, mouseEffect: 1, distortionAmount: 0.15, shapeAmount: 0.25, noiseOpacity: 0.4, widthMultiplier: 0.5, heightMultiplier: 2, position: { x: -0.2, y: 0.3 }, rotation: 2.5, speedMultiplier: 1, timeStart: 100, background: 0xefefef },
    { nr: 4, mouseEffect: 1, distortionAmount: 0.15, shapeAmount: 0.25, noiseOpacity: 0.4, widthMultiplier: 0.6, heightMultiplier: 2, position: { x: 0.2, y: 0 }, rotation: 3.5, speedMultiplier: 1, timeStart: -100, background: 0xefefef },
    { nr: 5, mouseEffect: 1, distortionAmount: 0.15, shapeAmount: 0.25, noiseOpacity: 0.4, widthMultiplier: 0.5, heightMultiplier: 1.9, position: { x: -0.3, y: 0.3 }, rotation: 1.1, speedMultiplier: 1, timeStart: -100, background: 0x000000 },
    { nr: 6, mouseEffect: 1, distortionAmount: 0.15, shapeAmount: 0.25, noiseOpacity: 0.4, widthMultiplier: 0.3, heightMultiplier: 2, position: { x: 0.05, y: -0.1 }, rotation: 4.7, speedMultiplier: 1, timeStart: -100, background: 0x000000 }
  ];

  const paletteHex = ['#F2E6DB', '#71D9E9', '#8c3dd0', '#D03F83', '#F43FF9', '#8c3dd0'];

  const perlinNoiseGLSL = `
    vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
    vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float cnoise21(vec2 P){
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
      vec2 g00 = vec2(gx.x,gy.x);
      vec2 g10 = vec2(gx.y,gy.y);
      vec2 g01 = vec2(gx.z,gy.z);
      vec2 g11 = vec2(gx.w,gy.w);
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

  const vertexShader = `
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
      float falloff = smoothstep(0., uTrailWidth, distanceToMouse);
      float displacement = uMouseEffect * 0.1 * falloff;
      vec3 newPosition = vec3(position.xy - direction * displacement / 2., position.z );
      uPos = direction * displacement * 2.;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
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

    ${perlinNoiseGLSL}

    void main() {
      vec3 firstColor = uColor[0];
      vec2 seed = (vUv * -uPos) * mix(vUv, uPos, 30. * uAmount);
      
      float ml = pow(6., 0.5) * -0.01;
      float n = cnoise21(seed) + 1. * uTime;
      vec3 color;
      color = mix(firstColor, firstColor, cnoise21(seed) / 1000.);

      for (int i = 1; i < 5; i++) {
        float amount = (float(i) + 1.) * 0.09;
        float n2 = smoothstep(amount * uTime + ml, amount * uTime + ml + amount * uTime, n * uTime);
        color = mix(color, uColor[i], n2);
      }
    
      float alpha = uAlpha * pow(sin(vUv.x * PI), uPow);
      alpha *= pow((sin(vUv.y * PI)), uPow);
      gl_FragColor = vec4(color, alpha);
    }
  `;

  class KotaWebGLBackground {
    constructor(container) {
      if (!window.THREE) return;
      this.container = container;
      if (this.container.querySelector('canvas')) return; // Already initialized

      this.bgIndex = parseInt(this.container.dataset.background, 10) || 1;
      this.darkBackground = this.container.dataset.darkBackground === 'true';
      this.activeConfig = bgConfigs[this.bgIndex] || bgConfigs[1];

      this.width = this.container.offsetWidth || window.innerWidth;
      this.height = this.container.offsetHeight || window.innerHeight;

      // THREE Scene
      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor(this.darkBackground ? 0x000000 : 0xefefef, this.darkBackground ? 1 : 0);

      this.container.appendChild(this.renderer.domElement);

      this.positionZ = 4000;
      this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 10, 10000);
      this.camera.position.z = this.positionZ;
      this.camera.rotation.z = this.activeConfig.rotation || 0.7;

      this.time = this.activeConfig.timeStart || 0;
      this.uTime = 0.1;
      this.reverseUTime = false;
      this.uMouse = new THREE.Vector2(0, 0);
      this.rayMouse = new THREE.Vector2(1, 1);
      this.allowRayMouse = true;
      this.raycaster = new THREE.Raycaster();

      this.setupMesh();
      this.resize();
      this.setupEvents();
      this.animateIn();
      this.render();
    }

    setupMesh() {
      const paletteColors = paletteHex.map(hex => new THREE.Color(hex));
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uNoiseAmount: { value: 0 },
          uRayMouse: { value: this.uMouse },
          uAmount: { value: this.activeConfig.shapeAmount || 0.2 },
          uPow: { value: 3.0 },
          uAlpha: { value: 0.0 },
          uColor: { value: paletteColors },
          uMouseEffect: { value: this.activeConfig.mouseEffect || 1.0 },
          uVelocity: { value: 0 },
          uRatio: { value: 1 }
        },
        side: THREE.DoubleSide,
        transparent: true,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      });

      this.geometry = new THREE.PlaneGeometry(1, 1, 128, 128);
      this.plane = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.plane);
      this.updatePlaneScale();
    }

    updatePlaneScale() {
      if (!this.plane) return;
      this.plane.scale.x = (this.activeConfig.widthMultiplier || 0.6) * this.width;
      this.plane.scale.y = (this.activeConfig.heightMultiplier || 2) * (1.25 * this.height);
      this.plane.scale.z = (this.activeConfig.widthMultiplier || 0.6) * this.width;
      this.camera.position.x = (this.activeConfig.position.x || 0) * this.width;
      this.camera.position.y = -(this.activeConfig.position.y || 0) * this.height;
      this.plane.material.uniforms.uRatio.value = this.plane.scale.x / this.plane.scale.y;
    }

    resize() {
      this.width = this.container.offsetWidth || window.innerWidth;
      this.height = this.container.offsetHeight || window.innerHeight;
      if (this.width === 0 || this.height === 0) return;

      this.camera.aspect = this.width / this.height;
      this.camera.fov = (2 * Math.atan(this.height / 2 / this.positionZ) * 180) / Math.PI;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.updatePlaneScale();
    }

    animateIn() {
      if (window.gsap) {
        gsap.to(this.material.uniforms.uPow, { value: 1.5, duration: 2.0, delay: 0.3, ease: 'power4.out' });
        gsap.to(this.material.uniforms.uAlpha, { value: 1.0, duration: 2.0, delay: 0.3, ease: 'power4.out' });
        gsap.to(this.rayMouse, { x: -0.4, y: -0.4, duration: 2.0, ease: 'power1.out' });
      } else {
        this.material.uniforms.uPow.value = 1.5;
        this.material.uniforms.uAlpha.value = 1.0;
        this.rayMouse.set(-0.4, -0.4);
      }
    }

    setupEvents() {
      window.addEventListener('resize', () => this.resize());
      window.addEventListener('mousemove', (e) => {
        const clientX = e.clientX;
        const clientY = e.clientY;
        const normX = (clientX / window.innerWidth) * 2 - 1;
        const normY = -(clientY / window.innerHeight) * 2 + 1;

        this.uMouse.x += (clientX / this.width - 0.5 - this.uMouse.x) * 0.1;
        this.uMouse.y += (clientY / this.height - 0.5 - this.uMouse.y) * 0.1;

        if (this.allowRayMouse && this.plane) {
          const mouseV = new THREE.Vector2(normX, normY);
          this.raycaster.setFromCamera(mouseV, this.camera);
          const intersects = this.raycaster.intersectObject(this.plane);
          if (intersects.length > 0) {
            const pt = intersects[0].point;
            const targetX = pt.x / this.plane.scale.x;
            const targetY = pt.y / this.plane.scale.y;
            this.rayMouse.x += (targetX - this.rayMouse.x) * 0.1;
            this.rayMouse.y += (targetY - this.rayMouse.y) * 0.1;
          }
        }
      });
    }

    render() {
      requestAnimationFrame(() => this.render());

      this.time += 0.01;
      if (this.reverseUTime) {
        this.uTime -= 0.001;
        if (this.uTime < 0.1) this.reverseUTime = false;
      } else {
        this.uTime += 0.001;
        if (this.uTime > 0.5) this.reverseUTime = true;
      }

      if (this.material && this.material.uniforms) {
        this.material.uniforms.uTime.value = this.uTime;
        this.material.uniforms.uRayMouse.value = this.rayMouse;
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  function initWebGLBackgrounds() {
    const containers = document.querySelectorAll('.webgl-background_container__Ojc1v');
    containers.forEach(container => {
      new KotaWebGLBackground(container);
    });
  }

  // Initialize interactive components
  function initInteractions() {
    
    
    
    // Header Scroll Apple Blur Effect
    const headerEl = document.querySelector('.Header_header__KwdYD');
    if (headerEl) {
      const handleHeaderScroll = () => {
        if (window.scrollY > 20) {
          headerEl.classList.add('is-scrolled');
        } else {
          headerEl.classList.remove('is-scrolled');
        }
      };
      window.addEventListener('scroll', handleHeaderScroll, { passive: true });
      handleHeaderScroll();
    }

    
    // Global Navigation Modal Functions
    window.openNavModal = function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }
      const overlay = document.getElementById('nav-modal-overlay');
      if (overlay) {
        overlay.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      }
    };

    window.closeNavModal = function(e) {
      const overlay = document.getElementById('nav-modal-overlay');
      if (overlay) {
        overlay.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    };

    // Event listeners for open trigger and keyboard escape
    const navIcons = document.querySelectorAll('.PrimaryNavigation_icon__qAQCe, #hamburger-btn');
    navIcons.forEach(btn => {
      btn.addEventListener('click', window.openNavModal);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') window.closeNavModal();
    });

    // 2. Magnetic Buttons Effect
    const magneticElements = document.querySelectorAll('.Magnetic_magnetic__LncOy');
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', e => {
        if (window.innerWidth < 850) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * 0.4;
        const y = (e.clientY - (rect.top + rect.height / 2)) * 0.4;
        if (window.gsap) {
          gsap.to(el, { x: x, y: y, duration: 0.4, ease: 'power3.out' });
        } else {
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      });

      el.addEventListener('mouseleave', () => {
        if (window.gsap) {
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        } else {
          el.style.transform = 'translate3d(0, 0, 0)';
        }
      });
    });

    // 3. Footer Email Copy to Clipboard
    const emailButton = document.querySelector('.Footer_email__nLajh');
    const emailTooltip = document.querySelector('.CopyText_tooltip__HuxWa');
    if (emailButton) {
      emailButton.addEventListener('click', () => {
        navigator.clipboard.writeText('inquiry@blackstonemedia.io').then(() => {
          if (emailTooltip) {
            emailTooltip.textContent = 'Copied!';
            emailTooltip.style.opacity = '1';
            emailTooltip.style.visibility = 'visible';
            setTimeout(() => {
              emailTooltip.textContent = 'Copy email address';
              emailTooltip.style.opacity = '';
              emailTooltip.style.visibility = '';
            }, 2500);
          }
        });
      });
    }

    // 4. Hero Video Autoplay Assurance
    const video = document.querySelector('.Hero_hero__WVEC3 video');
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.play().catch(() => {});
    }

    
    // 6. FAQ Accordion Click Handler
    const faqItems = document.querySelectorAll('.FaqsList_faq__Fe40G');
    faqItems.forEach(item => {
      const question = item.querySelector('.FaqsList_question__C1mGL');
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (question && checkbox) {
        question.addEventListener('click', (e) => {
          // If the click is directly on the checkbox, let it handle natively
          if (e.target === checkbox) return;
          e.preventDefault();
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
    });

    // 5. Crosshair rotation on scroll/mouse
    const crosshair = document.querySelector('.Hero_top__8JV3g .FadeInRotate_container__QE9u9');
    if (crosshair && window.gsap) {
      gsap.to(crosshair, { rotation: 360, duration: 20, repeat: -1, ease: 'none' });
    }
  }

  // Load Three.js and GSAP if not already present
  function loadScript(src, callback) {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = callback;
    document.head.appendChild(s);
  }

  function start() {
    if (!window.THREE) {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', () => {
        if (!window.gsap) {
          loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', () => {
            initWebGLBackgrounds();
            initInteractions();
          });
        } else {
          initWebGLBackgrounds();
          initInteractions();
        }
      });
    } else {
      initWebGLBackgrounds();
      initInteractions();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
