// زر العودة للأعلى
const toTopBtn = document.createElement("button");
toTopBtn.innerText = "⬆️";
toTopBtn.id = "toTopBtn";
document.body.appendChild(toTopBtn);

Object.assign(toTopBtn.style, {
  position: "fixed",
  bottom: "20px",
  left: "20px",
  padding: "10px",
  fontSize: "20px",
  display: "none",
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#5e4b8b",
  color: "#fff",
  zIndex: "1000",
  transition: "all 0.3s ease"
});

window.addEventListener("scroll", () => {
  toTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

toTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Sidebar والهامبرغر
const toggleBtn = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");

// إنشاء Overlay
const overlay = document.createElement("div");
overlay.id = "overlay";
document.body.appendChild(overlay);

// فتح وغلق الـsidebar
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  toggleBtn.classList.toggle("active");
  document.body.classList.toggle("sidebar-open");
  overlay.classList.toggle("active");
});

// الضغط على Overlay يغلق الـsidebar
overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  toggleBtn.classList.remove("active");
  document.body.classList.remove("sidebar-open");
  overlay.classList.remove("active");
});

// تمرير ناعم عند الضغط على الروابط الداخلية
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });

    // إغلاق الـsidebar إذا الرابط داخل القائمة
    if (sidebar.classList.contains("active")) {
      sidebar.classList.remove("active");
      toggleBtn.classList.remove("active");
      document.body.classList.remove("sidebar-open");
      overlay.classList.remove("active");
    }
  });
});

// Contact Form مع AJAX
const form = document.getElementById("contactForm");
const successMsg = document.getElementById("contact-success");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.querySelector('input[name="name"]');
    const email = form.querySelector('input[name="email"]');
    const msg = form.querySelector('textarea[name="message"]');

    if (!name.value.trim() || !email.value.trim() || !msg.value.trim()) {
      alert("رجاءً تأكد من تعبئة جميع الحقول.");
      return;
    }

    const formData = new FormData(form);
    await fetch("https://formsubmit.co/hgfyxc@gmail.com", {
      method: "POST",
      body: formData
    });

    form.reset();
    successMsg.style.display = "block";

    setTimeout(() => {
      successMsg.style.display = "none";
    }, 5000);
  });
}