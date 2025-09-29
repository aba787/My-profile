
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
      successMsg.innerHTML = `<span>${message}</span>`;
      successMsg.style.display = "flex";
      successMsg.className = isError ? 'error' : 'success';
      
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
      const response = await fetch("https://formsubmit.co/your-email@example.com", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        form.reset();
        showMessage("🎉 تم إرسال رسالتك بنجاح! سأتواصل معك قريباً");
      } else {
        throw new Error('فشل في الإرسال');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showMessage("⚠️ حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى", true);
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

// Project Modal Functionality
const initializeProjectModal = () => {
  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  
  if (!modal) {
    console.warn('Project modal not found');
    return;
  }

  // Project data
  const projectData = {
    1: {
      title: "موقع شركة تقنية",
      category: "تطوير مواقع الشركات",
      description: "موقع احترافي لشركة تقنية متخصصة في الحلول الرقمية. يتضمن عرض الخدمات، معرض الأعمال، ونظام إدارة المحتوى.",
      tools: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL", "Bootstrap"],
      features: [
        "تصميم متجاوب مع جميع الأجهزة",
        "نظام إدارة المحتوى",
        "تحسين محركات البحث SEO",
        "أمان عالي وحماية من الاختراق",
        "سرعة تحميل فائقة",
        "لوحة تحكم إدارية"
      ],
      image: "https://i.postimg.cc/zXKpxFyG/IMG-2383.jpg",
      liveLink: "#",
      codeLink: "#"
    },
    2: {
      title: "هوية بصرية متكاملة",
      category: "تصميم العلامات التجارية",
      description: "تصميم هوية بصرية شاملة تتضمن الشعار، الألوان، الخطوط، والمواد التسويقية لشركة ناشئة في مجال التقنية.",
      tools: ["Adobe Illustrator", "Photoshop", "Figma", "Brand Guidelines"],
      features: [
        "شعار احترافي بعدة إصدارات",
        "دليل الهوية البصرية الكامل",
        "تصميم البطاقات التجارية",
        "قوالب وسائل التواصل الاجتماعي",
        "مواد تسويقية متنوعة",
        "ملفات قابلة للطباعة بجودة عالية"
      ],
      image: "https://i.postimg.cc/VvcmnFSb/Black-White-Minimalist-Professional-Initial-Logo.png",
      liveLink: "#",
      codeLink: "#"
    },
    3: {
      title: "تطبيق إدارة المشاريع",
      category: "تطبيقات الويب",
      description: "تطبيق ويب متقدم لإدارة المشاريع والمهام مع إمكانيات التعاون الجماعي ومتابعة التقدم في الوقت الفعلي.",
      tools: ["React", "Node.js", "MongoDB", "Socket.io", "Material-UI"],
      features: [
        "إدارة المشاريع والمهام",
        "تعاون فريق في الوقت الفعلي",
        "نظام إشعارات متقدم",
        "تقارير وإحصائيات تفصيلية",
        "واجهة مستخدم سهلة وبديهية",
        "نظام أذونات متعدد المستويات"
      ],
      image: "https://i.postimg.cc/Yq6f62P4/IMG-2382.jpg",
      liveLink: "#",
      codeLink: "#"
    },
    4: {
      title: "منصة الخيمات التقنية",
      category: "التجارة الإلكترونية",
      description: "منصة تجارة إلكترونية متكاملة لبيع المنتجات التقنية مع نظام دفع آمن وإدارة المخزون وخدمة العملاء.",
      tools: ["WordPress", "WooCommerce", "PHP", "MySQL", "Payment Gateway"],
      features: [
        "متجر إلكتروني متكامل",
        "نظام دفع آمن ومتعدد الوسائل",
        "إدارة المخزون الذكية",
        "نظام تتبع الطلبات",
        "خدمة عملاء مدمجة",
        "تحليلات مبيعات مفصلة"
      ],
      image: "https://i.postimg.cc/g0Tvzxx7/alkhaymat-altiqnia.png",
      liveLink: "#",
      codeLink: "#"
    }
  };

  // Open modal function
  const openModal = (projectId) => {
    const project = projectData[projectId];
    if (!project) return;

    // Populate modal content
    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalCategory').textContent = project.category;
    document.getElementById('modalDescription').textContent = project.description;
    
    // Populate tools
    const toolsContainer = document.getElementById('modalTools');
    toolsContainer.innerHTML = '';
    project.tools.forEach(tool => {
      const toolTag = document.createElement('span');
      toolTag.className = 'tool-tag';
      toolTag.textContent = tool;
      toolsContainer.appendChild(toolTag);
    });

    // Populate features
    const featuresContainer = document.getElementById('modalFeatures');
    featuresContainer.innerHTML = '';
    project.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      featuresContainer.appendChild(li);
    });

    // Set links
    document.getElementById('modalLiveLink').href = project.liveLink;
    document.getElementById('modalCodeLink').href = project.codeLink;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Close modal function
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Event listeners
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.dataset.project;
      openModal(projectId);
    });
  });

  modalClose.addEventListener('click', closeModal);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    createBackToTopButton();
    initializeSidebar();
    initializeSmoothScrolling();
    initializeContactForm();
    initializeAnimations();
    initializePerformanceOptimizations();
    initializeProjectModal();
    
    console.log('✅ Website initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing website:', error);
  }
});

// Service Worker registration removed to prevent console errors
// Add back when you have a service worker file
