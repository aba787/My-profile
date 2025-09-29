
// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
  const script = document.createElement('script');
  script.src = 'https://polyfill.io/v3/polyfill.min.js?features=smoothscroll';
  document.head.appendChild(script);
}

// زر العودة للأعلى
const createBackToTopButton = () => {
  const toTopBtn = document.createElement("button");
  toTopBtn.innerHTML = "⬆️";
  toTopBtn.id = "toTopBtn";
  toTopBtn.setAttribute('aria-label', 'العودة للأعلى');
  document.body.appendChild(toTopBtn);

  Object.assign(toTopBtn.style, {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    padding: "12px",
    fontSize: "20px",
    display: "none",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#5e4b8b",
    color: "#fff",
    zIndex: "1000",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    width: "50px",
    height: "50px"
  });

  // Show/hide button based on scroll
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const shouldShow = window.scrollY > 300;
        toTopBtn.style.display = shouldShow ? "flex" : "none";
        toTopBtn.style.alignItems = "center";
        toTopBtn.style.justifyContent = "center";
        ticking = false;
      });
      ticking = true;
    }
  });

  // Smooth scroll to top
  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ 
      top: 0, 
      behavior: "smooth" 
    });
  });

  // Hover effects
  toTopBtn.addEventListener("mouseenter", () => {
    toTopBtn.style.transform = "translateY(-3px)";
    toTopBtn.style.backgroundColor = "#705ba2";
  });

  toTopBtn.addEventListener("mouseleave", () => {
    toTopBtn.style.transform = "translateY(0)";
    toTopBtn.style.backgroundColor = "#5e4b8b";
  });
};

// Sidebar والهامبرغر
const initializeSidebar = () => {
  const toggleBtn = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  
  if (!toggleBtn || !sidebar) {
    console.warn('Sidebar elements not found');
    return;
  }

  // إنشاء Overlay
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.setAttribute('aria-label', 'إغلاق القائمة');
  document.body.appendChild(overlay);

  // Toggle sidebar
  const toggleSidebar = (open) => {
    const isOpen = open !== undefined ? open : !sidebar.classList.contains("active");
    
    sidebar.classList.toggle("active", isOpen);
    toggleBtn.classList.toggle("active", isOpen);
    document.body.classList.toggle("sidebar-open", isOpen);
    overlay.classList.toggle("active", isOpen);
    
    // Update ARIA attributes
    toggleBtn.setAttribute('aria-expanded', isOpen.toString());
    sidebar.setAttribute('aria-hidden', (!isOpen).toString());
    
    // Manage focus
    if (isOpen) {
      sidebar.querySelector('a')?.focus();
    } else {
      toggleBtn.focus();
    }
  };

  // Event listeners
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSidebar();
  });

  overlay.addEventListener("click", () => {
    toggleSidebar(false);
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("active")) {
      toggleSidebar(false);
    }
  });

  // Close sidebar when clicking outside
  document.addEventListener("click", (e) => {
    if (sidebar.classList.contains("active") && 
        !sidebar.contains(e.target) && 
        !toggleBtn.contains(e.target)) {
      toggleSidebar(false);
    }
  });
};

// تمرير ناعم عند الضغط على الروابط الداخلية
const initializeSmoothScrolling = () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        // Close sidebar if open
        const sidebar = document.getElementById("sidebar");
        const toggleBtn = document.getElementById("menu-toggle");
        const overlay = document.getElementById("overlay");
        
        if (sidebar?.classList.contains("active")) {
          sidebar.classList.remove("active");
          toggleBtn?.classList.remove("active");
          document.body.classList.remove("sidebar-open");
          overlay?.classList.remove("active");
        }
        
        // Smooth scroll to target
        target.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        });
        
        // Update URL without triggering scroll
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });
};

// Contact Form مع تحسينات
const initializeContactForm = () => {
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("contact-success");
  
  if (!form) {
    console.warn('Contact form not found');
    return;
  }

  // Form validation
  const validateForm = (formData) => {
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const message = formData.get('message')?.trim();
    
    const errors = [];
    
    if (!name || name.length < 2) {
      errors.push('يرجى إدخال اسم صحيح (حرفين على الأقل)');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push('يرجى إدخال بريد إلكتروني صحيح');
    }
    
    if (!message || message.length < 10) {
      errors.push('يرجى إدخال رسالة واضحة (10 حروف على الأقل)');
    }
    
    return errors;
  };

  // Show loading state
  const setLoadingState = (isLoading) => {
    const submitBtn = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, textarea');
    
    if (isLoading) {
      submitBtn.textContent = 'جاري الإرسال...';
      submitBtn.disabled = true;
      inputs.forEach(input => input.disabled = true);
      form.classList.add('loading');
    } else {
      submitBtn.textContent = 'أرسل الرسالة';
      submitBtn.disabled = false;
      inputs.forEach(input => input.disabled = false);
      form.classList.remove('loading');
    }
  };

  // Show message
  const showMessage = (message, isError = false) => {
    if (successMsg) {
      successMsg.textContent = message;
      successMsg.style.display = "block";
      successMsg.style.color = isError ? "red" : "green";
      successMsg.style.backgroundColor = isError ? "#ffebee" : "#e8f5e8";
      successMsg.style.padding = "15px";
      successMsg.style.borderRadius = "10px";
      successMsg.style.border = `2px solid ${isError ? "#f44336" : "#4caf50"}`;
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        successMsg.style.display = "none";
      }, 5000);
      
      // Scroll to message
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
      showMessage(errors.join('\n'), true);
      return;
    }
    
    setLoadingState(true);
    
    try {
      const response = await fetch("https://formsubmit.co/hgfyxc@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        form.reset();
        showMessage("✅ تم إرسال رسالتك بنجاح! شكرًا لتواصلك معي، سأرد عليك قريباً.");
      } else {
        throw new Error('فشل في الإرسال');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showMessage("❌ حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى أو التواصل معي مباشرة.", true);
    } finally {
      setLoadingState(false);
    }
  });

  // Real-time validation
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => {
      const formData = new FormData();
      formData.append(field.name, field.value);
      const errors = validateForm(formData);
      
      // Remove previous error styling
      field.style.borderColor = '';
      
      // Add error styling if needed
      if (errors.length > 0 && errors.some(error => 
          (field.name === 'name' && error.includes('اسم')) ||
          (field.name === 'email' && error.includes('بريد')) ||
          (field.name === 'message' && error.includes('رسالة'))
      )) {
        field.style.borderColor = '#f44336';
      }
    });
  });
};

// Intersection Observer for animations
const initializeAnimations = () => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observe sections
    document.querySelectorAll('section:not(.hero-section)').forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(section);
    });
  }
};

// Performance optimization
const initializePerformanceOptimizations = () => {
  // Lazy load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('loading');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Preload critical resources
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap';
  preloadLink.as = 'style';
  document.head.appendChild(preloadLink);
};

// Error handling
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    createBackToTopButton();
    initializeSidebar();
    initializeSmoothScrolling();
    initializeContactForm();
    initializeAnimations();
    initializePerformanceOptimizations();
    
    console.log('✅ Website initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing website:', error);
  }
});

// Service Worker registration (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
