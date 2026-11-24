const API = {
  me: {
    name: "Md. Rofiqullah Munna",
    role: ["Full-Stack Developer", ".NET Developer", "Backend Developer"],
    location: "Dhaka, Bangladesh",
    education: {
      university: "American International University-Bangladesh",
      degree: "BSc in CSE (Software Engineering)",
      cgpa: 3.80,
      graduation: 2027
    },
    openToWork: true
  },
  skills: {
    backend: ["C#", "ASP.NET Core", "EF Core", "NestJS", "Node.js"],
    databases: ["SQL Server", "PostgreSQL", "MySQL", "Oracle", "Supabase"],
    frontend: ["React", "React Native", "JavaScript", "TypeScript"],
    desktop: ["Windows Forms", "Java Swing"],
    concepts: ["OOP", "DSA", "DTO pattern", "Role-based auth"]
  },
  projects: [
    { name: "E-commerce Web Application", stack: "ASP.NET Core MVC + SQL Server", live: true },
    { name: "Privacy-First AI Data Control Center", stack: "NestJS + Supabase", endpoints: 139 },
    { name: "Library Management System", stack: "PHP + MySQL + AJAX" },
    { name: "Amazon Clone", stack: "HTML + CSS + JS" },
    { name: "Netflix Clone", stack: "HTML + CSS + JS" }
  ],
  contact: {
    email: "rofiqullahmunna82@gmail.com",
    github: "github.com/munna89-ig",
    linkedin: "linkedin.com/in/rofiqullah-munna-76301930a",
    responseTime: "within 24h"
  }
};


function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(line) {
  return escapeHtml(line)
    .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')       // keys
    .replace(/: "([^"]*)"/g, ': <span class="json-str">"$1"</span>')     // string values
    .replace(/^(\s*)"([^"]*)"(,?)$/g, '$1<span class="json-str">"$2"</span>$3') // strings in arrays
    .replace(/: (-?\d+\.?\d*|true|false|null)/g, ': <span class="json-num">$1</span>'); // numbers/bools
}


const responseEl = document.getElementById("response");
const reqUrl = document.getElementById("reqUrl");
const respMeta = document.getElementById("respMeta");
const respTime = document.getElementById("respTime");
const endpointBtns = document.querySelectorAll(".endpoint");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let printTimer = null;

function sendRequest(name) {
  clearTimeout(printTimer);
  reqUrl.textContent = "https://api.munna.dev/v1/" + name;
  respMeta.classList.add("loading");
  responseEl.innerHTML = "";

  // keep 3.80 instead of 3.8
  const json = JSON.stringify(API[name], null, 2).replace(/"cgpa": 3\.8\b/, '"cgpa": 3.80');
  const lines = json.split("\n");

  // pretend network delay, then print line by line
  printTimer = setTimeout(() => {
    respMeta.classList.remove("loading");
    respTime.textContent = (28 + Math.floor(Math.random() * 40)) + " ms";

    let i = 0;
    function printNext() {
      if (i >= lines.length) return;
      const span = document.createElement("span");
      span.className = "line";
      span.innerHTML = highlight(lines[i]);
      responseEl.appendChild(span);
      i++;
      printTimer = setTimeout(printNext, reduceMotion ? 0 : 35);
    }
    printNext();
  }, reduceMotion ? 0 : 280);
}

endpointBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    endpointBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    sendRequest(btn.dataset.endpoint);
  });
});

sendRequest("me");


// Theme: page load e sob shomoy light, click korle dark/light switch
const themeBtn = document.getElementById("themeToggle");

function setTheme(light) {
  document.body.classList.toggle("light", light);
  themeBtn.textContent = light ? "☾" : "☀";
  themeBtn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
}

setTheme(true); // start always light

themeBtn.addEventListener("click", () => setTheme(!document.body.classList.contains("light")));


const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  menuBtn.textContent = open ? "✕" : "☰";
  menuBtn.setAttribute("aria-expanded", open);
}
menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));

const navbar = document.getElementById("navbar");
const toTop = document.getElementById("toTop");

function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle("scrolled", y > 30);
  toTop.classList.toggle("show", y > 600);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () => window.scrollTo({ top: 0 }));


const links = document.querySelectorAll(".nav-link");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });

document.querySelectorAll("main section[id]").forEach(s => sectionObserver.observe(s));


const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");
const MY_EMAIL = "rofiqullahmunna82@gmail.com";

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

  name.classList.toggle("error", !name.value.trim());
  email.classList.toggle("error", !emailOk);
  message.classList.toggle("error", !message.value.trim());

  if (!name.value.trim() || !emailOk || !message.value.trim()) {
    formMsg.textContent = "Add your name, a valid email and a message, then send again.";
    formMsg.className = "form-msg err";
    return;
  }

  const subject = encodeURIComponent("Portfolio message from " + name.value.trim());
  const body = encodeURIComponent(message.value.trim() + "\n\nFrom: " + name.value.trim() + " (" + email.value.trim() + ")");
  window.location.href = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`;

  formMsg.textContent = "Your email app is opening with the message ready to send.";
  formMsg.className = "form-msg ok";
  form.reset();
});


document.getElementById("year").textContent = new Date().getFullYear();