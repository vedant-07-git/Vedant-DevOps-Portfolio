import { useState, useEffect, useRef } from "react";

// ─── Framer Motion CDN shim (inline minimal animation hook) ──────────────────
// Since we're in the artifact environment we implement lightweight motion hooks
// using Intersection Observer + CSS transitions instead of the framer-motion npm package.

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// Animated wrappers
function FadeUp({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transition: `opacity 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function SlideLeft({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-60px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function SlideRight({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(60px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// Typewriter hook
function useTypewriter(words, speed = 90, pause = 2000) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), pause);
        else setCharIdx(c => c + 1);
      } else {
        setText(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) { setDeleting(false); setWordIdx(i => (i + 1) % words.length); }
        else setCharIdx(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return text;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const PHONE = "919921577520"; // WhatsApp number (country code + number, no +)
const EMAIL = "vedantsatpute007@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/vedant-satpute-29076b272/";
const GITHUB = "https://github.com/vedant-07-git";

const skills = [
  {
    icon: "☁️", name: "Cloud Platforms", color: "cyan",
    tags: ["AWS", "GCP", "Azure", "EC2", "S3", "Lambda", "EKS"],
  },
  {
    icon: "🐳", name: "Containers & Orchestration", color: "purple",
    tags: ["Docker", "Kubernetes", "Helm", "Istio", "ArgoCD"],
  },
  {
    icon: "🔄", name: "CI/CD", color: "green",
    tags: ["Jenkins", "GitHub Actions", "GitLab CI", "CircleCI"],
  },
  {
    icon: "🏗️", name: "Infrastructure as Code", color: "orange",
    tags: ["Terraform", "Ansible", "Pulumi", "CloudFormation"],
  },
  {
    icon: "📊", name: "Monitoring & Observability", color: "cyan",
    tags: ["Prometheus", "Grafana", "ELK Stack", "Datadog", "PagerDuty"],
  },
  {
    icon: "🔒", name: "Security & Networking", color: "purple",
    tags: ["Vault", "IAM", "VPC", "SSL/TLS", "SIEM"],
  },
];

const projects = [
  {
    icon: "🚀", title: "Zero-Downtime Deployment Pipeline",
    desc: "End-to-end CI/CD pipeline with blue-green deployments, automated rollbacks, and Slack notifications. Reduced deployment time from 45 mins to under 5 mins.",
    stack: ["Jenkins", "Kubernetes", "Helm", "AWS"], gh: "#", live: "#",
  },
  {
    icon: "🏗️", title: "Multi-Region AWS Infrastructure",
    desc: "Fully automated, multi-region AWS infrastructure with disaster recovery, auto-scaling groups, and cost optimization — all via Terraform modules.",
    stack: ["Terraform", "AWS", "Route53", "RDS"], gh: "#",
  },
  {
    icon: "📊", title: "Observability Platform",
    desc: "Centralized monitoring stack with custom Grafana dashboards, Prometheus alerting rules, and ELK log aggregation for a 50-service microservices architecture.",
    stack: ["Prometheus", "Grafana", "ELK", "Alertmanager"], gh: "#", demo: "#",
  },
  {
    icon: "🔒", title: "Secrets Management System",
    desc: "Dynamic secrets management using HashiCorp Vault integrated with Kubernetes, enabling automatic secret rotation and zero hardcoded credentials.",
    stack: ["Vault", "Kubernetes", "Ansible", "Python"], gh: "#",
  },
];

const tagColor = {
  cyan: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  purple: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  green: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  orange: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
};

// ─── Components ──────────────────────────────────────────────────────────────

function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = ["About", "Skills", "Projects", "Contact"];
  return (
    <nav
      className="fixed top-0 w-full z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8,10,20,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,212,255,0.1)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <span
          className="text-xl font-black tracking-tight"
          style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          VS
        </span>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-8 list-none">
          {links.map(l => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase()}`}
                className={`text-sm font-medium tracking-wide transition-colors duration-200 ${active === l.toLowerCase() ? "text-cyan-400" : "text-slate-400 hover:text-cyan-300"}`}
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)" }}
        >
          Hire Me
        </a>

        {/* Hamburger */}
        <button className="md:hidden text-slate-300" onClick={() => setMenuOpen(m => !m)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-slate-300 text-sm font-medium" onClick={() => setMenuOpen(false)}>
              {l}
            </a>
          ))}
          <a href="#contact" className="text-cyan-400 text-sm font-bold" onClick={() => setMenuOpen(false)}>Hire Me →</a>
        </div>
      )}
    </nav>
  );
}

// Glowing grid hero
function Hero() {
  const typed = useTypewriter(["Cloud Automation", "CI/CD Pipelines", "Scalable Infrastructure", "DevOps Excellence"]);
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg,#080a14 0%,#0b0f20 100%)" }}
    >
      {/* Animated grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700, height: 700,
          background: "radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        }}
      />
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-cyan-400/40 animate-ping" style={{ animationDuration: "3s" }} />
      <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 rounded-full bg-violet-400/40 animate-ping" style={{ animationDuration: "4s", animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/3 w-1 h-1 rounded-full bg-emerald-400/40 animate-ping" style={{ animationDuration: "5s", animationDelay: "0.5s" }} />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Badge */}
        <FadeIn delay={0.1}>
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
            style={{ border: "1px solid rgba(0,212,255,0.4)", color: "#00d4ff" }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for Opportunities
          </span>
        </FadeIn>

        {/* Name */}
        <FadeUp delay={0.2}>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4 text-white">
            Vedant <span style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Satpute</span>
          </h1>
        </FadeUp>

        {/* Typewriter role */}
        <FadeUp delay={0.35}>
          <div className="text-xl md:text-2xl font-bold mb-6 h-8" style={{ color: "#00d4ff" }}>
            {typed}<span className="animate-pulse">|</span>
          </div>
        </FadeUp>

        <FadeUp delay={0.5}>
          <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto mb-10">
            DevOps Engineer bridging dev & ops with cloud automation, bulletproof CI/CD, and infrastructure that runs at 99.9% uptime.
          </p>
        </FadeUp>

        <FadeUp delay={0.65}>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#projects"
              className="px-8 py-3 rounded-xl text-base font-bold text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/25"
              style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)" }}
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-3 rounded-xl text-base font-bold border transition-all duration-200 hover:-translate-y-1"
              style={{ border: "1px solid rgba(0,212,255,0.5)", color: "#00d4ff", background: "rgba(0,212,255,0.05)" }}
            >
              Get In Touch
            </a>
          </div>
        </FadeUp>

        {/* Tech logos row */}
        <FadeIn delay={0.9}>
          <div className="flex gap-6 justify-center items-center mt-14 flex-wrap">
            {["AWS", "K8s", "Docker", "Terraform", "GitHub"].map(t => (
              <span key={t} className="text-xs font-mono text-slate-500 tracking-widest">{t}</span>
            ))}
          </div>
        </FadeIn>
      </div>

     
    </section>
  );
}

function About() {
  const stats = [
    { num: "1+", label: "Years Exp." },
    { num: "5+", label: "Projects" },
    { num: "99.9%", label: "Uptime SLA" },
    { num: "3", label: "Cloud Certs" },
  ];
  return (
    <section id="about" className="py-24 px-6" style={{ background: "#0b0f1f" }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Avatar side */}
          <SlideLeft delay={0.1}>
            <div className="relative flex justify-center">
              {/* Rotating ring */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  border: "1px dashed rgba(0,212,255,0.25)",
                  animation: "spin 20s linear infinite",
                  borderRadius: "1.5rem",
                }}
              />
              <div
                className="w-64 h-64 rounded-3xl flex items-center justify-center text-8xl relative z-10"
                style={{
                  background: "linear-gradient(135deg,#111827,#0b0f1f)",
                  border: "1.5px solid rgba(0,212,255,0.2)",
                  boxShadow: "0 0 60px rgba(0,212,255,0.08)",
                }}
              >
                👨‍💻
              </div>
              {/* Floating tag */}
              <div
                className="absolute -bottom-4 -right-4 px-4 py-2 rounded-xl text-xs font-bold text-emerald-400 z-20"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}
              >
                Open to Work ✓
              </div>
            </div>
          </SlideLeft>

          {/* Text side */}
          <SlideRight delay={0.2}>
            <div className="text-xs tracking-widest text-cyan-400 uppercase mb-3 font-semibold">About Me</div>
            <h2 className="text-4xl font-black text-white mb-2">
              Automating Everything,{" "}
              <span style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Breaking Nothing
              </span>
            </h2>
            <div className="w-14 h-1 rounded-full mb-6 mt-4" style={{ background: "linear-gradient(90deg,#00d4ff,#7c3aed)" }} />
            <p className="text-slate-400 leading-relaxed mb-4 text-base">
              I'm Vedant Satpute, a passionate DevOps Engineer focused on bridging the gap between development and operations. I design resilient cloud infrastructure, automate deployment pipelines, and build monitoring solutions that give teams full visibility.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8 text-base">
              From containerizing monoliths to orchestrating microservices at scale — I love turning complex infrastructure challenges into elegant, repeatable solutions.
            </p>

            <div className="grid grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <FadeUp key={s.label} delay={0.3 + i * 0.1}>
                  <div className="text-center">
                    <div
                      className="text-2xl font-black"
                      style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                    >
                      {s.num}
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{s.label}</div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </SlideRight>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="py-24 px-6" style={{ background: "#080a14" }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-xs tracking-widest text-cyan-400 uppercase mb-3 font-semibold">What I Work With</div>
          <h2 className="text-4xl font-black text-white mb-2">
            Skills &{" "}
            <span style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Tech Stack
            </span>
          </h2>
          <div className="w-14 h-1 rounded-full mb-12 mt-4" style={{ background: "linear-gradient(90deg,#00d4ff,#7c3aed)" }} />
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((s, i) => (
            <FadeUp key={s.name} delay={i * 0.08}>
              <div
                className="p-6 rounded-2xl transition-all duration-300 group cursor-default"
                style={{
                  background: "#111827",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = "1px solid rgba(0,212,255,0.3)";
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,212,255,0.08)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="font-bold text-white text-sm">{s.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map(t => (
                    <span key={t} className={`px-3 py-1 rounded-md text-xs font-semibold ${tagColor[s.color]}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="py-24 px-6" style={{ background: "#0b0f1f" }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-xs tracking-widest text-cyan-400 uppercase mb-3 font-semibold">What I've Built</div>
          <h2 className="text-4xl font-black text-white mb-2">
            Featured{" "}
            <span style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Projects
            </span>
          </h2>
          <div className="w-14 h-1 rounded-full mb-12 mt-4" style={{ background: "linear-gradient(90deg,#00d4ff,#7c3aed)" }} />
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <FadeUp key={p.title} delay={i * 0.1}>
              <div
                className="p-7 rounded-2xl relative overflow-hidden transition-all duration-300"
                style={{
                  background: "#111827",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = "1px solid rgba(0,212,255,0.25)";
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 24px 48px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: "linear-gradient(90deg,#00d4ff,#7c3aed)" }}
                />

                <div className="flex justify-between items-start mb-4">
                  <span className="text-3xl">{p.icon}</span>
                  <div className="flex gap-2">
                    {p.gh && (
                      <a
                        href={p.gh}
                        className="text-xs px-3 py-1 rounded-lg text-slate-400 border border-white/10 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                    {p.live && (
                      <a
                        href={p.live}
                        className="text-xs px-3 py-1 rounded-lg text-slate-400 border border-white/10 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors"
                      >
                        Live ↗
                      </a>
                    )}
                    {p.demo && (
                      <a
                        href={p.demo}
                        className="text-xs px-3 py-1 rounded-lg text-slate-400 border border-white/10 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors"
                      >
                        Demo
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-white font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.stack.map(t => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-md font-semibold"
                      style={{ background: "rgba(124,58,237,0.12)", color: "#a78bfa" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const sendWhatsApp = () => {
    const { name, email, subject, message } = form;
    if (!name || !email || !message) { setStatus("error"); return; }
    const text = encodeURIComponent(
      `👋 Hello Vedant!\n\n*Name:* ${name}\n*Email:* ${email}\n*Subject:* ${subject || "General Inquiry"}\n\n*Message:*\n${message}`
    );
    window.open(`https://wa.me/${PHONE}?text=${text}`, "_blank");
    setStatus("sent");
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setStatus(null), 4000);
  };

  const inputStyle = {
    background: "#111827",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "0.85rem 1rem",
    color: "#e2e8f0",
    fontSize: "0.95rem",
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <section id="contact" className="py-24 px-6" style={{ background: "#080a14" }}>
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-xs tracking-widest text-cyan-400 uppercase mb-3 font-semibold">Let's Talk</div>
          <h2 className="text-4xl font-black text-white mb-2">
            Get In{" "}
            <span style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Touch
            </span>
          </h2>
          <div className="w-14 h-1 rounded-full mb-12 mt-4" style={{ background: "linear-gradient(90deg,#00d4ff,#7c3aed)" }} />
        </FadeUp>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          {/* Contact info */}
          <SlideLeft delay={0.1} className="md:col-span-2">
            <p className="text-slate-400 leading-relaxed mb-8">
              Open to new opportunities, collaborations, and interesting infrastructure challenges. Drop me a message and I'll get back within 24 hours.
            </p>

            <div className="flex flex-col gap-3">
              {/* Email — click opens mail client */}
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group"
                style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <span className="text-2xl">📧</span>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Email</div>
                  <div className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">{EMAIL}</div>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group"
                style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(37,211,102,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <span className="text-2xl">💬</span>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">WhatsApp</div>
                  <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">+91 9921577520</div>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group"
                style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <span className="text-2xl">💼</span>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">LinkedIn</div>
                  <div className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">linkedin.com/in/vedant-satpute</div>
                </div>
              </a>

              {/* GitHub */}
              <a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group"
                style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <span className="text-2xl">🐙</span>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">GitHub</div>
                  <div className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">github.com/vedant-07-git</div>
                </div>
              </a>

              {/* Location */}
              <div
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-2xl">📍</span>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Location</div>
                  <div className="text-sm font-semibold text-white">Pune, Maharashtra, IND</div>
                </div>
              </div>
            </div>
          </SlideLeft>

          {/* Contact Form */}
          <SlideRight delay={0.2} className="md:col-span-3">
            <div
              className="p-8 rounded-2xl"
              style={{ background: "#0f1629", border: "1px solid rgba(0,212,255,0.1)" }}
            >
              <h3 className="text-white font-bold text-lg mb-6">Send a Message via WhatsApp</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1.5">Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "#00d4ff"; e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1.5">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "#00d4ff"; e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1.5">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Project inquiry, job opportunity..."
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#00d4ff"; e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <div className="mb-6">
                <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1.5">Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or opportunity..."
                  rows={5}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={e => { e.target.style.borderColor = "#00d4ff"; e.target.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.08)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              {/* Status */}
              {status === "error" && (
                <p className="text-red-400 text-sm mb-4">⚠️ Please fill in Name, Email, and Message.</p>
              )}
              {status === "sent" && (
                <p className="text-emerald-400 text-sm mb-4">✅ Opening WhatsApp with your message...</p>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* WhatsApp send */}
                <button
                  onClick={sendWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#25d366,#128c7e)" }}
                >
                  <span>💬</span> Send on WhatsApp
                </button>

                {/* Email button */}
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent(form.subject || "Portfolio Inquiry")}&body=${encodeURIComponent(`Hi Vedant,\n\nName: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(0,212,255,0.4)",
                    color: "#00d4ff",
                  }}
                >
                  <span>📧</span> Send via Email
                </a>
              </div>
            </div>
          </SlideRight>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="text-center py-8 text-sm text-slate-500"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <span>Designed & built with ❤️ © 2026 </span>
      <span
        className="font-bold"
        style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
      >
        Vedant Satpute
      </span>
      <span> · DevOps Engineer</span>
    </footer>
  );
}
export default function App() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const sections = ["about", "skills", "projects", "contact"];
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.4 }
    );
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: "#080a14", minHeight: "100vh", fontFamily: "'Inter',system-ui,sans-serif" }}>
      <Navbar active={active} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}
