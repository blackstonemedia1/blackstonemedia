/**
 * KOTA Brand Strategy & Identity - High Performance Motion Engine
 * - Apple-Style Seamless Feathered Fade-Blur Header Scroll Effect
 * - Floating Card Navigation Modal Controller
 * - Robust Unrestricted 60fps Video Autoplay Engine
 * - Signature Stacked Card Deck Testimonials Slider
 * - Guaranteed Interactive FAQ Question Popup Accordion
 * - Solid Black Discover More Interactive Horizontal Pills & Smooth Scroll
 * - Live WebGL Moving Dark Aurora Noise Shader Background for CTA
 * - Card 3D Tilt & Parallax Zoom
 * - Elastic Magnetic Buttons & Arrow Glide Physics
 * - Viewport Video Autoplay & Scroll Text Reveals
 * - Footer Email Copy Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScrollAndModal();
  initVideoAutoplay();
  initFaqAccordion();
  initTestimonialsStackedDeck();
  initWebGLMovingBackground();
  initMagneticAndArrowMotion();
  initCardTiltMotion();
  initDiscoverMorePills();
  initScrollAnimations();
  initFooterEmailCopy();
});

/* ==========================================================================
   1. Header Feathered Fade-Blur & Floating Card Navigation Modal
   ========================================================================== */
function initHeaderScrollAndModal() {
  const header = document.querySelector('.Header_header__KwdYD');
  const hamburgerBtn = document.getElementById('hamburger-btn') || document.querySelector('.PrimaryNavigation_icon__qAQCe');
  const modalOverlay = document.getElementById('nav-modal-overlay');
  const modalClose = document.getElementById('nav-modal-close');
  const modalLinks = document.querySelectorAll('.nav-modal-links a, .nav-modal-cta');

  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  function openModal() {
    if (modalOverlay) {
      modalOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal();
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  modalLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeModal();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   2. Robust Video Autoplay Engine
   ========================================================================== */
function initVideoAutoplay() {
  const videos = document.querySelectorAll('video');

  function tryPlayVideo(v) {
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('autoplay', '');
    v.setAttribute('loop', '');

    const promise = v.play();
    if (promise !== undefined) {
      promise.catch(() => {
        const startPlay = () => {
          v.play().catch(() => {});
          window.removeEventListener('touchstart', startPlay);
          window.removeEventListener('scroll', startPlay);
          window.removeEventListener('click', startPlay);
        };
        window.addEventListener('touchstart', startPlay, { once: true, passive: true });
        window.addEventListener('scroll', startPlay, { once: true, passive: true });
        window.addEventListener('click', startPlay, { once: true, passive: true });
      });
    }
  }

  videos.forEach((v) => {
    tryPlayVideo(v);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      }
    });
  }, { threshold: 0.05 });

  videos.forEach((v) => {
    observer.observe(v);
  });
}

/* ==========================================================================
   3. Guaranteed Interactive FAQ Question Popup Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.FaqsList_faq__k2u7Q');

  faqItems.forEach((faq) => {
    const label = faq.querySelector('.FaqsList_question__Dd04C');
    const checkbox = faq.querySelector('input[type="checkbox"]');
    const answer = faq.querySelector('.FaqsList_answer__xPq_g');
    const icon = faq.querySelector('.FaqsList_icon__Jq0d_ svg') || faq.querySelector('.FaqsList_icon__Jq0d_');
    if (!label || !answer) return;

    label.style.cursor = 'pointer';
    label.style.pointerEvents = 'auto';

    label.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = faq.classList.contains('is-open');

      if (isOpen) {
        faq.classList.remove('is-open');
        if (checkbox) checkbox.checked = false;
        answer.style.setProperty('max-height', '0px', 'important');
        answer.style.setProperty('opacity', '0', 'important');
        answer.style.setProperty('margin-top', '0px', 'important');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        faq.classList.add('is-open');
        if (checkbox) checkbox.checked = true;
        const scrollH = answer.scrollHeight;
        const targetHeight = Math.max(scrollH, 160) + 50;
        answer.style.setProperty('max-height', targetHeight + 'px', 'important');
        answer.style.setProperty('opacity', '1', 'important');
        answer.style.setProperty('margin-top', '1.25rem', 'important');
        answer.style.setProperty('display', 'block', 'important');
        if (icon) icon.style.transform = 'rotate(45deg)';
      }
    };
  });
}

/* ==========================================================================
   4. Signature Stacked Card Deck Testimonials Slider (Exact Clone of Image 3)
   ========================================================================== */
function initTestimonialsStackedDeck() {
  const container = document.querySelector('.TestimonialsCarousel_container__sBMji');
  const slides = document.querySelectorAll('.TestimonialsCarousel_swiperSlide__xzlOt');
  if (!container || slides.length === 0) return;

  let activeIndex = 0;
  const total = slides.length;
  let isAnimating = false;

  function updateStack() {
    slides.forEach((slide, i) => {
      let diff = (i - activeIndex + total) % total;

      if (diff === 0) {
        // Active front card
        slide.style.transform = 'translate3d(0, 0, 0) scale(1)';
        slide.style.zIndex = '30';
        slide.style.opacity = '1';
        slide.style.pointerEvents = 'auto';
        slide.style.visibility = 'visible';
      } else if (diff === 1) {
        // 1st stacked card behind on the left
        slide.style.transform = 'translate3d(-18px, 0, 0) scale(0.96)';
        slide.style.zIndex = '25';
        slide.style.opacity = '1';
        slide.style.pointerEvents = 'none';
        slide.style.visibility = 'visible';
      } else if (diff === 2) {
        // 2nd stacked card behind on the left
        slide.style.transform = 'translate3d(-34px, 0, 0) scale(0.92)';
        slide.style.zIndex = '20';
        slide.style.opacity = '1';
        slide.style.pointerEvents = 'none';
        slide.style.visibility = 'visible';
      } else if (diff === 3) {
        // 3rd stacked card behind on the left
        slide.style.transform = 'translate3d(-48px, 0, 0) scale(0.88)';
        slide.style.zIndex = '15';
        slide.style.opacity = '1';
        slide.style.pointerEvents = 'none';
        slide.style.visibility = 'visible';
      } else {
        // Remaining stacked cards
        slide.style.transform = 'translate3d(-60px, 0, 0) scale(0.84)';
        slide.style.zIndex = '10';
        slide.style.opacity = '0.9';
        slide.style.pointerEvents = 'none';
        slide.style.visibility = 'visible';
      }
    });
  }

  function nextCard() {
    if (isAnimating) return;
    isAnimating = true;

    const currentSlide = slides[activeIndex];
    currentSlide.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease';
    currentSlide.style.transform = 'translate3d(100px, 0, 0) rotate(3deg) scale(0.96)';
    currentSlide.style.opacity = '0';

    setTimeout(() => {
      activeIndex = (activeIndex + 1) % total;
      slides.forEach((s) => {
        s.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
      });
      updateStack();
      setTimeout(() => {
        isAnimating = false;
      }, 350);
    }, 200);
  }

  function prevCard() {
    if (isAnimating) return;
    isAnimating = true;

    activeIndex = (activeIndex - 1 + total) % total;
    const newActiveSlide = slides[activeIndex];
    newActiveSlide.style.transition = 'none';
    newActiveSlide.style.transform = 'translate3d(100px, 0, 0) rotate(3deg) scale(0.96)';
    newActiveSlide.style.opacity = '0';
    newActiveSlide.style.zIndex = '35';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        newActiveSlide.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
        slides.forEach((s) => {
          s.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';
        });
        updateStack();
        setTimeout(() => {
          isAnimating = false;
        }, 500);
      });
    });
  }

  // Bind next button click on all buttons
  document.querySelectorAll('.swiper-panel-next, .TestimonialsCarousel_swiperNavNext__jvv3x').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      nextCard();
    });
  });

  // Swipe gesture support (Touch & Mouse drag)
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - startX;
    const diffY = endY - startY;

    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextCard();
      } else {
        prevCard();
      }
    }
  }, { passive: true });

  container.addEventListener('mousedown', (e) => {
    if (e.target.closest('.swiper-panel-next')) return;
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = e.clientX - startX;
    const diffY = e.clientY - startY;

    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextCard();
      } else {
        prevCard();
      }
    }
  });

  updateStack();
}

/* ==========================================================================
   5. Live WebGL Moving Dark Aurora Noise Shader Background
   ========================================================================== */
function initWebGLMovingBackground() {
  const canvas = document.getElementById('cta-webgl-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  const vertexShaderSrc = `
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = (position + 1.0) * 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSrc = `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      float aspect = uResolution.x / uResolution.y;
      vec2 p = uv;
      p.x *= aspect;

      vec2 mouseOffset = (uMouse - 0.5) * 0.12;
      float t = uTime * 0.28;

      float n1 = snoise(vec2(p.x * 1.1 + t * 0.35, p.y * 1.4 - t * 0.2) + mouseOffset);
      float n2 = snoise(vec2(p.x * 1.8 - t * 0.28 + n1 * 0.5, p.y * 1.6 + t * 0.3));
      float n3 = snoise(vec2(p.x * 0.9 + t * 0.18, p.y * 2.0 + n2 * 0.45));

      float distFromCenter = abs(uv.y - 0.5 + (n1 * 0.22 + n2 * 0.14));

      vec3 deepBlack = vec3(0.0, 0.0, 0.0);
      vec3 electricPurple = vec3(0.42, 0.18, 0.85);
      vec3 hotMagenta = vec3(0.88, 0.14, 0.68);
      vec3 azureCyan = vec3(0.1, 0.68, 0.92);
      vec3 darkViolet = vec3(0.18, 0.06, 0.44);

      vec3 col = deepBlack;
      col = mix(col, darkViolet, smoothstep(0.75, 0.12, distFromCenter) * 0.75);
      col = mix(col, electricPurple, smoothstep(0.52, 0.06, abs(uv.y - 0.48 + n1 * 0.2)) * 0.88);
      col = mix(col, hotMagenta, smoothstep(0.42, 0.03, abs(uv.y - 0.53 + n2 * 0.22)) * 0.92);
      col = mix(col, azureCyan, smoothstep(0.36, 0.01, abs(uv.y - 0.44 + n3 * 0.18)) * 0.85);

      col += vec3(0.015, 0.015, 0.03);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
  const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]),
    gl.STATIC_DRAW
  );

  const posAttr = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posAttr);
  gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

  const uTimeLoc = gl.getUniformLocation(program, 'uTime');
  const uResLoc = gl.getUniformLocation(program, 'uResolution');
  const uMouseLoc = gl.getUniformLocation(program, 'uMouse');

  let mouseX = 0.5, mouseY = 0.5;
  let targetMouseX = 0.5, targetMouseY = 0.5;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX / window.innerWidth;
    targetMouseY = 1.0 - (e.clientY / window.innerHeight);
  }, { passive: true });

  function resize() {
    const parent = canvas.parentElement;
    const w = parent ? parent.offsetWidth : window.innerWidth;
    const h = parent ? parent.offsetHeight : 580;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  let startTime = performance.now();
  function render() {
    const currentTime = (performance.now() - startTime) * 0.001;

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    gl.uniform1f(uTimeLoc, currentTime);
    gl.uniform2f(uResLoc, canvas.width, canvas.height);
    gl.uniform2f(uMouseLoc, mouseX, mouseY);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   6. Discover More Interactive Pills with Smooth Scroll
   ========================================================================== */
function initDiscoverMorePills() {
  const pills = document.querySelectorAll('.DiscoverMore_pillLink, .DiscoverMore_linksInner__Vgx11 a');
  pills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      pills.forEach((p) => {
        p.classList.remove('is-active');
        p.classList.remove('DiscoverMoreLink_active__6IF37');
      });
      pill.classList.add('is-active');
      pill.classList.add('DiscoverMoreLink_active__6IF37');

      const targetId = pill.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });
}

/* ==========================================================================
   7. Signature Magnetic Buttons & Arrow Motion
   ========================================================================== */
function initMagneticAndArrowMotion() {
  const magneticElements = document.querySelectorAll(
    '.Magnetic_magnetic__LncOy, .Button_button__JJiqJ, .Header_button__yG4_K, .FloatingStartButton_button__Ncnrf, .TestimonialsCarousel_swiperNavNext__jvv3x'
  );

  magneticElements.forEach((btn) => {
    let bounds = btn.getBoundingClientRect();
    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;
    let isHovered = false;
    let rafId = null;

    function onResize() {
      bounds = btn.getBoundingClientRect();
    }
    window.addEventListener('resize', onResize, { passive: true });

    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    function animate() {
      currentX = lerp(currentX, targetX, 0.2);
      currentY = lerp(currentY, targetY, 0.2);

      const normX = currentX / (bounds.width / 2);
      const normY = currentY / (bounds.height / 2);

      btn.style.setProperty('--magnet-x', normX.toFixed(3));
      btn.style.setProperty('--magnet-y', normY.toFixed(3));

      btn.style.transform = `translate3d(${currentX * 0.4}px, ${currentY * 0.4}px, 0)`;

      if (isHovered || Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
        rafId = requestAnimationFrame(animate);
      } else {
        btn.style.transform = 'translate3d(0, 0, 0)';
        btn.style.removeProperty('--magnet-x');
        btn.style.removeProperty('--magnet-y');
        rafId = null;
      }
    }

    btn.addEventListener('mouseenter', () => {
      bounds = btn.getBoundingClientRect();
      isHovered = true;
      if (!rafId) rafId = requestAnimationFrame(animate);
    });

    btn.addEventListener('mousemove', (e) => {
      targetX = e.clientX - (bounds.left + bounds.width / 2);
      targetY = e.clientY - (bounds.top + bounds.height / 2);
    });

    btn.addEventListener('mouseleave', () => {
      isHovered = false;
      targetX = 0;
      targetY = 0;
    });
  });

  const heroArrow = document.querySelector('.Hero_arrow__CVNIo');
  if (heroArrow) {
    heroArrow.style.cursor = 'pointer';
    heroArrow.addEventListener('mouseenter', () => {
      heroArrow.style.transform = 'scale(1.15) rotate(45deg)';
      heroArrow.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    heroArrow.addEventListener('mouseleave', () => {
      heroArrow.style.transform = 'scale(1) rotate(0deg)';
      heroArrow.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    heroArrow.addEventListener('click', () => {
      const nextSection = document.querySelector('.Bento_bento__aFMAt') || document.querySelector('.Intro_intro__B7xXJ');
      if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   8. Card 3D Tilt, Parallax & Motion
   ========================================================================== */
function initCardTiltMotion() {
  const cards = document.querySelectorAll(
    '[data-animation="grid-item"], .TextImageRows_row__PPlpB, .Hero_video__IHL3y'
  );

  cards.forEach((card) => {
    let bounds = card.getBoundingClientRect();
    let isHovered = false;
    let targetRotateX = 0, targetRotateY = 0;
    let currentRotateX = 0, currentRotateY = 0;
    let rafId = null;

    card.style.perspective = '1000px';
    card.style.transformStyle = 'preserve-3d';

    const media = card.querySelector('video, img, .Timeline_image__txoKz, .ImageEnter_image__FSEP_');
    if (media) {
      media.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease';
      media.style.willChange = 'transform';
    }

    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    function update() {
      currentRotateX = lerp(currentRotateX, targetRotateX, 0.12);
      currentRotateY = lerp(currentRotateY, targetRotateY, 0.12);

      if (isHovered) {
        card.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) translate3d(0, -6px, 12px)`;
      } else {
        card.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) translate3d(0, 0, 0)`;
      }

      if (isHovered || Math.abs(currentRotateX) > 0.05 || Math.abs(currentRotateY) > 0.05) {
        rafId = requestAnimationFrame(update);
      } else {
        card.style.transform = '';
        rafId = null;
      }
    }

    card.addEventListener('mouseenter', () => {
      bounds = card.getBoundingClientRect();
      isHovered = true;
      if (media) media.style.transform = 'scale(1.05)';
      if (!rafId) rafId = requestAnimationFrame(update);
    });

    card.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const pctX = (mouseX / bounds.width - 0.5) * 2;
      const pctY = (mouseY / bounds.height - 0.5) * 2;

      targetRotateY = pctX * 6;
      targetRotateX = -pctY * 6;
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      targetRotateX = 0;
      targetRotateY = 0;
      if (media) media.style.transform = 'scale(1)';
    });
  });
}

/* ==========================================================================
   9. Scroll Animations & Reveal
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '[data-animation="grid-item"], .FadeIn_container__bjQVL, .LineByLine_headingOuter__JmusT'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  animatedElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    } else {
      el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(el);
    }
  });
}

/* ==========================================================================
   10. Footer Email Copy Handler
   ========================================================================== */
function initFooterEmailCopy() {
  const emailLink = document.querySelector('.Footer_email__nLajh');
  const tooltip = document.querySelector('.CopyText_tooltip__HuxWa');
  if (!emailLink) return;

  emailLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = 'inquiry@blackstonemedia.io';
    navigator.clipboard.writeText(email).then(() => {
      if (tooltip) {
        const originalText = tooltip.textContent;
        tooltip.textContent = 'Copied to clipboard!';
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        setTimeout(() => {
          tooltip.textContent = originalText;
          tooltip.style.opacity = '';
          tooltip.style.visibility = '';
        }, 2000);
      }
    }).catch(() => {});
  });
}
