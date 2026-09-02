// KOTA Authentic Interactive Background & Site Script
document.addEventListener('DOMContentLoaded', () => {
  // 0. Interactive Gradient Aura Canvas matching https://kota.co.uk/contact
  const canvas = document.getElementById('kota-bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width * 0.75;
    let mouseY = height * 0.4;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let time = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    });

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          targetMouseX = width * 0.5 + (e.gamma / 20) * (width * 0.3);
          targetMouseY = height * 0.5 + ((e.beta - 45) / 20) * (height * 0.3);
        }
      });
    }

    function draw() {
      // Smooth lerping
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;
      time += 0.012;

      ctx.clearRect(0, 0, width, height);

      // 1. Off-white background
      ctx.fillStyle = '#efefef';
      ctx.fillRect(0, 0, width, height);

      // Subtle dynamic oscillation
      const offsetX = (mouseX - width * 0.5) * 0.12 + Math.sin(time * 0.8) * 12;
      const offsetY = (mouseY - height * 0.5) * 0.12 + Math.cos(time * 0.6) * 12;

      // 2. Cyan / Turquoise Bottom-Right Glow
      const cyanX = width * 0.88 + offsetX * 1.2;
      const cyanY = height * 0.82 + offsetY * 1.2;
      const cyanRadius = Math.max(width, height) * 0.45;
      const cyanGrad = ctx.createRadialGradient(cyanX, cyanY, 0, cyanX, cyanY, cyanRadius);
      cyanGrad.addColorStop(0, 'rgba(61, 205, 225, 0.9)');
      cyanGrad.addColorStop(0.35, 'rgba(61, 191, 210, 0.7)');
      cyanGrad.addColorStop(0.65, 'rgba(80, 160, 210, 0.3)');
      cyanGrad.addColorStop(1, 'rgba(239, 239, 239, 0)');

      ctx.fillStyle = cyanGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Deep Violet / Purple Body
      const purpX = width * 0.82 + offsetX * 0.9;
      const purpY = height * 0.58 + offsetY * 0.9;
      const purpRadius = Math.max(width, height) * 0.55;
      const purpGrad = ctx.createRadialGradient(purpX, purpY, 0, purpX, purpY, purpRadius);
      purpGrad.addColorStop(0, 'rgba(142, 45, 175, 0.95)');
      purpGrad.addColorStop(0.4, 'rgba(160, 40, 170, 0.75)');
      purpGrad.addColorStop(0.7, 'rgba(180, 50, 180, 0.35)');
      purpGrad.addColorStop(1, 'rgba(239, 239, 239, 0)');

      ctx.fillStyle = purpGrad;
      ctx.fillRect(0, 0, width, height);

      // 4. Vibrant Magenta / Pink Core Wave
      const magX = width * 0.84 + offsetX;
      const magY = height * 0.42 + offsetY;
      const magRadius = Math.max(width, height) * 0.5;
      const magGrad = ctx.createRadialGradient(magX, magY, 0, magX, magY, magRadius);
      magGrad.addColorStop(0, 'rgba(216, 27, 148, 1.0)');
      magGrad.addColorStop(0.25, 'rgba(225, 30, 155, 0.9)');
      magGrad.addColorStop(0.55, 'rgba(185, 35, 165, 0.65)');
      magGrad.addColorStop(0.8, 'rgba(216, 27, 148, 0.2)');
      magGrad.addColorStop(1, 'rgba(239, 239, 239, 0)');

      ctx.fillStyle = magGrad;
      ctx.fillRect(0, 0, width, height);

      // 5. Soft Upper Lilac / Lavender Tint
      const lilacX = width * 0.75 + offsetX * 0.7;
      const lilacY = height * 0.18 + offsetY * 0.7;
      const lilacRadius = Math.max(width, height) * 0.45;
      const lilacGrad = ctx.createRadialGradient(lilacX, lilacY, 0, lilacX, lilacY, lilacRadius);
      lilacGrad.addColorStop(0, 'rgba(240, 130, 215, 0.75)');
      lilacGrad.addColorStop(0.4, 'rgba(220, 100, 200, 0.4)');
      lilacGrad.addColorStop(0.75, 'rgba(200, 80, 190, 0.15)');
      lilacGrad.addColorStop(1, 'rgba(239, 239, 239, 0)');

      ctx.fillStyle = lilacGrad;
      ctx.fillRect(0, 0, width, height);

      requestAnimationFrame(draw);
    }

    draw();
  }

  // 1. Apple-Style Seamless Header Scroll Blur Mask
  const header = document.querySelector('.Header_header__KwdYD');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Floating Card Navigation Modal
  const navModalOverlay = document.getElementById('nav-modal-overlay');
  const navHamburgerBtn = document.getElementById('nav-hamburger-btn') || document.querySelector('.PrimaryNavigation_icon__qAQCe');
  const navModalClose = document.getElementById('nav-modal-close');
  const navModalLinks = document.querySelectorAll('.NavModal_link, .NavModal_ctaBtn');

  function openNavModal() {
    if (navModalOverlay) {
      navModalOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeNavModal() {
    if (navModalOverlay) {
      navModalOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  if (navHamburgerBtn) {
    navHamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openNavModal();
    });
  }

  if (navModalClose) {
    navModalClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeNavModal();
    });
  }

  if (navModalOverlay) {
    navModalOverlay.addEventListener('click', (e) => {
      if (e.target === navModalOverlay) {
        closeNavModal();
      }
    });
  }

  navModalLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeNavModal();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNavModal();
    }
  });

  // 2. One-click Copy Email to Clipboard
  const copyElements = document.querySelectorAll('.CopyText_copyText__OtWNq');
  copyElements.forEach((el) => {
    el.addEventListener('click', async (e) => {
      e.preventDefault();
      let emailText = '';
      for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          emailText += node.textContent.trim();
        }
      }
      if (!emailText) {
        emailText = el.innerText.split('\n')[0].trim();
      }

      if (emailText) {
        try {
          await navigator.clipboard.writeText(emailText);
          const tooltip = el.querySelector('.CopyText_tooltip__HuxWa');
          const originalText = tooltip ? tooltip.textContent : 'Copy email address';
          
          el.classList.add('copied');
          if (tooltip) {
            tooltip.textContent = 'Copied to clipboard!';
          }

          setTimeout(() => {
            el.classList.remove('copied');
            if (tooltip) {
              tooltip.textContent = originalText;
            }
          }, 2200);
        } catch (err) {
          const tempInput = document.createElement('input');
          tempInput.value = emailText;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          
          el.classList.add('copied');
          const tooltip = el.querySelector('.CopyText_tooltip__HuxWa');
          if (tooltip) tooltip.textContent = 'Copied to clipboard!';
          setTimeout(() => {
            el.classList.remove('copied');
            if (tooltip) tooltip.textContent = 'Copy email address';
          }, 2200);
        }
      }
    });
  });

  // 3. Contact Form Interactivity & Submission
  const contactForm = document.querySelector('.Form_form___noC4');
  const fileInput = document.getElementById('files');
  const fileLabel = document.querySelector('label[for="files"]');

  const interestLabels = document.querySelectorAll('.Form_form___noC4 fieldset label');
  interestLabels.forEach((label) => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    const buttonSpan = label.querySelector('.Form_button__WKdUX');
    if (checkbox && buttonSpan) {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          buttonSpan.style.backgroundColor = 'var(--primary, #000)';
          buttonSpan.style.color = 'var(--secondary, #fff)';
        } else {
          buttonSpan.style.backgroundColor = 'transparent';
          buttonSpan.style.color = 'var(--primary, #000)';
        }
      });
    }
  });

  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', () => {
      const count = fileInput.files.length;
      if (count > 0) {
        const fileNames = Array.from(fileInput.files).map(f => f.name).join(', ');
        fileLabel.innerHTML = `Attachments <span class="Form_fileAttachedBadge">(${count} file${count > 1 ? 's' : ''})</span>`;
        fileLabel.title = fileNames;
      } else {
        fileLabel.innerHTML = 'Attachments';
        fileLabel.title = '';
      }
    });
  }

  let successContainer = document.querySelector('.Form_successMessage__nGL57');
  if (!successContainer && contactForm && contactForm.parentElement) {
    successContainer = document.createElement('div');
    successContainer.className = 'Form_successMessage__nGL57';
    successContainer.innerHTML = `
      <h3 class="Form_successTitle__gqNPY">Thank you for getting in touch.</h3>
      <p class="Form_successText__oDeUM">
        We’ve received your inquiry. The Black Stone Media team will be in touch shortly. In the meantime, explore our services :
      </p>
      <div class="Services_tabsWrap">
        <a href="https://blackstonemedia.io" class="Service_tabBtn">SaaS &amp; Technology</a>
        <a href="https://blackstonemedia.io" class="Service_tabBtn">B2B &amp; Professional Services</a>
        <a href="https://blackstonemedia.io" class="Service_tabBtn">Healthcare</a>
        <a href="https://blackstonemedia.io" class="Service_tabBtn">Finance</a>
        <a href="https://blackstonemedia.io" class="Service_tabBtn">E-commerce &amp; Retail</a>
        <a href="https://blackstonemedia.io" class="Service_tabBtn">Local &amp; Regional Businesses</a>
      </div>
      <div class="Form_buttonWrap__iVNPZ">
        <button type="button" class="Form_resetBtn">Send another message</button>
      </div>
    `;
    contactForm.parentElement.appendChild(successContainer);

    const resetBtn = successContainer.querySelector('.Form_resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        contactForm.reset();
        interestLabels.forEach(lbl => {
          const btn = lbl.querySelector('.Form_button__WKdUX');
          if (btn) {
            btn.style.backgroundColor = 'transparent';
            btn.style.color = 'var(--primary, #000)';
          }
        });
        if (fileLabel) fileLabel.innerHTML = 'Attachments';
        successContainer.classList.remove('active');
        contactForm.style.display = 'flex';
      });
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.Form_submit__Dnq6N');
      const submitSpan = submitBtn ? submitBtn.querySelector('span') : null;
      
      if (submitBtn) submitBtn.classList.add('submitting');
      if (submitSpan) submitSpan.textContent = 'Sending... ';

      setTimeout(() => {
        if (submitBtn) submitBtn.classList.remove('submitting');
        if (submitSpan) submitSpan.textContent = 'Submit ';
        
        contactForm.style.display = 'none';
        if (successContainer) {
          successContainer.classList.add('active');
          successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 750);
    });
  }



  // 5. Magnetic Button tracking
  const magneticEls = document.querySelectorAll('.Magnetic_magnetic__LncOy');
  magneticEls.forEach((mag) => {
    mag.addEventListener('mousemove', (e) => {
      const rect = mag.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mag.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    mag.addEventListener('mouseleave', () => {
      mag.style.transform = 'translate(0px, 0px)';
      mag.style.transition = 'transform 0.4s ease';
    });
    mag.addEventListener('mouseenter', () => {
      mag.style.transition = 'none';
    });
  });
});
