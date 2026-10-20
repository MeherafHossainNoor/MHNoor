import React, { Suspense, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Lenis from "lenis";
import { gsap } from "gsap";
import portraitUrl from "../meheraf-portrait.jpg";
import "./styles.css";

const posts = [
  {
    category: "Creative process",
    date: "October 8, 2026",
    dateTime: "2026-10-08",
    title: "A website of my own",
    excerpt:
      "Today I built a new website, and the whole process felt like stepping into an experience unlike any other. From shaping the first idea to watching it take form on the screen, every step brought something new to learn. It was challenging, surprising, and genuinely exciting to make something of my own.",
    note: "A day I’ll remember with a little extra pride.",
  },
  {
    category: "Reflection",
    date: "September 18, 2026",
    dateTime: "2026-09-18",
    title: "A note to the curious",
    excerpt:
      "Curiosity is a way of leaving the door open. For a new idea, an unexpected turn, or a question that takes its time to answer. Lately, I’ve been trying to follow that feeling a little further.",
    note: "A small reminder to keep asking.",
  },
  {
    category: "Slow living",
    date: "August 29, 2026",
    dateTime: "2026-08-29",
    title: "Finding a little quiet",
    excerpt:
      "Not every moment needs to become a milestone. Sometimes a slower afternoon, a deep breath, and a little space to think are enough to help us notice where we are.",
    note: "Here’s to making room for that.",
  },
  {
    category: "Stories",
    date: "August 6, 2026",
    dateTime: "2026-08-06",
    title: "Stories we carry",
    excerpt:
      "Some stories stay with us long after the telling. They find their way into ordinary days and quietly change what we notice, what we remember, and what we choose to share.",
    note: "I think that’s part of their magic.",
  },
];

const destinations = [
  {
    number: "01",
    title: "About me",
    description: "A little about who I am, what I love, and the stories that made me.",
    href: "about.html",
    link: "Get to know me",
  },
  {
    number: "02",
    title: "Vlog",
    description: "Notes, reflections, and ideas I’ve been meaning to put into words.",
    href: "vlog.html",
    link: "Read the Vlog",
  },
  {
    number: "03",
    title: "Contact",
    description: "Have a thought to share? I’d love to hear from you.",
    href: "contact.html",
    link: "Say hello",
  },
];

const socialLinks = [
  {
    label: "Email",
    detail: "meherafhossainnoor@gmail.com",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=meherafhossainnoor%40gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5 19V6l7 7 7-7v13" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    detail: "@meheraf_hossain_noor",
    href: "https://www.instagram.com/meheraf_hossain_noor/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
  { label: "Facebook", detail: "Meheraf Hossain Noor", href: "https://www.facebook.com/MeherafHossainNoor", icon: "f" },
];

const mottos = {
  home: "Stay curious. Keep a little wonder close.",
  about: "Stay curious. Keep a little wonder close.",
  vlog: "Stay curious. Keep a little wonder close.",
  contact: "Good conversations begin with a hello.",
};

function useMotionAndReveal() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis;
    let observer;
    let tick;
    const elements = document.querySelectorAll("[data-reveal]");

    if (!reduced) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true, smoothTouch: false });
      tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          gsap.fromTo(
            entry.target,
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", clearProps: "all" },
          );
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      elements.forEach((element) => observer.observe(element));
    } else {
      elements.forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
    }

    return () => {
      if (observer) observer.disconnect();
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
      }
    };
  }, []);
}

function useScrolledHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrolled;
}

function Header({ page }) {
  const scrolled = useScrolledHeader();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["Home", "index.html", "home"],
    ["Vlog", "vlog.html", "vlog"],
    ["About me", "about.html", "about"],
    ["Contact", "contact.html", "contact"],
  ];

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <a className="brand" href="index.html" aria-label="Meheraf Hossain home">
        MEHERAF<span className="brand-dot">.</span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span><span></span>
      </button>
      <nav className={`site-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
        {links.map(([label, href, id]) => (
          <a
            key={id}
            href={href}
            aria-current={page === id ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function ThreeLayer({ variant = "ambient" }) {
  const ref = useRef(null);

  useEffect(() => {
    let cleanup;
    let cancelled = false;

    const start = async () => {
      const { mountThreeScene } = await import("./three-engine.js");
      if (cancelled || !ref.current) return;
      cleanup = mountThreeScene(ref.current, { variant });
    };
    start();

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, [variant]);

  return <div className={`three-layer three-layer-${variant}`} ref={ref} aria-hidden="true" />;
}

function AmbientScene() {
  return (
    <Suspense fallback={<div className="ambient-fallback" aria-hidden="true"></div>}>
      <ThreeLayer />
    </Suspense>
  );
}

function Typewriter() {
  const words = ["A dreamer", "A writer", "A storyteller"];
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let wordIndex = 0;
    let deleting = true;
    let charIndex = words[0].length;
    let timeout;

    const step = () => {
      const word = words[wordIndex];
      if (deleting) {
        charIndex -= 1;
        setText(word.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timeout = window.setTimeout(step, 400);
          return;
        }
      } else {
        charIndex += 1;
        setText(words[wordIndex].slice(0, charIndex));
        if (charIndex === words[wordIndex].length) {
          deleting = true;
          timeout = window.setTimeout(step, 1500);
          return;
        }
      }
      timeout = window.setTimeout(step, deleting ? 55 : 90);
    };

    timeout = window.setTimeout(step, 1500);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <p className="hero-role">
      <span className="role-prefix">I’m</span>
      <span className="typed-word" aria-hidden="true">{text}</span>
      <span className="type-cursor" aria-hidden="true"></span>
      <span className="sr-only">A dreamer, a writer, and a storyteller.</span>
    </p>
  );
}

function ButtonLink({ href, children, primary = false, className = "" }) {
  return (
    <a className={`button-link ${primary ? "button-primary" : "button-secondary"} ${className}`} href={href}>
      {children}
      {primary && <span className="button-arrow" aria-hidden="true">↗</span>}
    </a>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="home-title">
      <div className="hero-orbit hero-orbit-one"></div>
      <div className="hero-orbit hero-orbit-two"></div>
      <div className="hero-content">
        <p className="eyebrow"><span className="eyebrow-spark"></span> A little corner of the internet</p>
        <h1 id="home-title">Ideas take<br /><span className="gradient-text">another shape.</span></h1>
        <div className="hero-name">MEHERAF HOSSAIN <span>·</span></div>
        <Typewriter />
        <p className="hero-lead">A personal space for my story, thoughts, and the little things that make life feel meaningful.</p>
        <div className="hero-actions">
          <ButtonLink href="vlog.html" primary>Read my thoughts</ButtonLink>
          <ButtonLink href="about.html">About me</ButtonLink>
        </div>
        <div className="hero-note"><span className="note-line"></span> Keep looking a little closer</div>
      </div>
      <div className="hero-portrait-wrap">
        <div className="portrait-ring"></div>
        <div className="portrait-frame glass-panel">
          <img src={portraitUrl} alt="Portrait of Meheraf Hossain" width="640" height="800" fetchPriority="high" />
          <div className="portrait-index">01 / THE DREAMER</div>
        </div>
        <div className="portrait-float glass-panel"><span className="live-dot"></span> ALWAYS BECOMING</div>
      </div>
      <a className="scroll-cue" href="#explore"><span>SCROLL TO EXPLORE</span><span className="scroll-cue-line"></span></a>
    </section>
  );
}

function SectionIntro({ label, title, description, align = "left" }) {
  return (
    <div className={`section-intro align-${align}`}>
      <p className="eyebrow">{label}</p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}

function DestinationCards() {
  return (
    <div className="card-grid destination-grid">
      {destinations.map((item) => (
        <article className="feature-card glass-panel" key={item.number}>
          <div className="card-topline"><span>{item.number}</span><span className="card-corner-mark">↗</span></div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <a href={item.href} className="card-link">{item.link}<span aria-hidden="true">↗</span></a>
        </article>
      ))}
    </div>
  );
}

function LatestCards({ limit = 3 }) {
  return (
    <div className="card-grid post-grid">
      {posts.slice(0, limit).map((post, index) => (
        <article className="post-card glass-panel" key={post.dateTime}>
          <div className="post-card-meta">
            <span className="post-category">{post.category}</span>
            <time dateTime={post.dateTime}>{post.date}</time>
          </div>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <a className="card-link" href="vlog.html">Read this thought <span aria-hidden="true">↗</span></a>
          <span className="post-index">0{index + 1}</span>
        </article>
      ))}
    </div>
  );
}

function QuoteBlock({ page }) {
  return (
    <section className="quote-panel glass-panel" data-reveal aria-label="A personal motto">
      <span className="quote-orbit quote-orbit-a"></span>
      <span className="quote-orbit quote-orbit-b"></span>
      <span className="quote-mark" aria-hidden="true">“</span>
      <p className="eyebrow">A thought to keep</p>
      <blockquote>{mottos[page]}</blockquote>
      <cite>— MEHERAF</cite>
    </section>
  );
}

function Footer({ page }) {
  return (
    <footer className="site-footer" data-reveal>
      <div className="footer-cta">
        <div>
          <p className="eyebrow">Until next time</p>
          <h2>Make room for <span className="gradient-text">wonder.</span></h2>
          <p>Thanks for being here. Stay curious, and take care.</p>
        </div>
        <ButtonLink href="contact.html" primary>Come say hello</ButtonLink>
      </div>
      <div className="footer-bottom">
        <a className="brand" href="index.html">MEHERAF<span className="brand-dot">.</span></a>
        <nav className="footer-socials" aria-label="Social links">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-label={link.label}
              title={link.label}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {link.icon}
            </a>
          ))}
        </nav>
        <span className="footer-copyright">© {new Date().getFullYear()} MEHERAF HOSSAIN · {page.toUpperCase()}</span>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <section className="content-section section-shell" id="explore" data-reveal>
        <SectionIntro label="Explore" title="A little about this space" description="Somewhere to get to know me, follow my thoughts, and say hello." />
        <DestinationCards />
      </section>
      <section className="content-section section-shell" data-reveal>
        <div className="section-heading-row">
          <SectionIntro label="The journal" title="Latest from the Vlog" description="A few thoughts from my corner of the world." />
          <a className="text-link" href="vlog.html">All entries <span aria-hidden="true">↗</span></a>
        </div>
        <LatestCards />
      </section>
      <div className="section-shell"><QuoteBlock page="home" /></div>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <section className="page-heading" data-reveal>
        <p className="eyebrow">A little introduction</p>
        <h1>The person behind<br /><span className="gradient-text">the words.</span></h1>
        <p className="page-lead">I’m Meheraf — a dreamer, a writer, and always becoming.</p>
      </section>
      <section className="about-feature section-shell" data-reveal>
        <div className="about-image glass-panel">
          <img src={portraitUrl} alt="Meheraf Hossain outdoors" width="640" height="800" loading="lazy" />
          <span className="about-image-caption">A MOMENT ALONG THE WAY</span>
        </div>
        <div className="about-copy">
          <p className="eyebrow">My story, still unfolding</p>
          <h2>A space to be curious.</h2>
          <p>This is my little corner of the internet: a place to collect thoughts, share stories, and make room for the things that matter. I believe a good story can make an ordinary moment feel worth remembering.</p>
          <p>There’s plenty more to discover, and I’m glad you’re here for a bit of the journey. Take a look around, read something, or <a href="contact.html">come say hello</a>.</p>
          <ButtonLink href="vlog.html" primary>Explore the Vlog</ButtonLink>
        </div>
      </section>
      <section className="content-section section-shell model-section" data-reveal>
        <SectionIntro label="A little perspective" title="A world of new angles" description="An interactive study in shape, light, and the joy of making something new." />
        <div className="model-viewer glass-panel">
          <Suspense fallback={<div className="model-loading">Preparing the scene…</div>}>
            <ThreeLayer variant="showcase" />
          </Suspense>
          <div className="model-caption"><span>FORM STUDY / 001</span><span>MOVE YOUR POINTER TO EXPLORE</span></div>
        </div>
      </section>
      <section className="content-section section-shell" data-reveal>
        <SectionIntro label="A few things I value" title="Little reminders" />
        <DestinationCards />
      </section>
      <div className="section-shell"><QuoteBlock page="about" /></div>
    </>
  );
}

function VlogPage() {
  return (
    <>
      <section className="page-heading" data-reveal>
        <p className="eyebrow">The journal</p>
        <h1>Thoughts, in<br /><span className="gradient-text">their own time.</span></h1>
        <p className="page-lead">Notes, reflections, and stories from my corner of the world.</p>
      </section>
      <section className="vlog-entries section-shell" aria-label="Vlog posts" data-reveal>
        {posts.map((post, index) => (
          <article className="vlog-entry glass-panel" key={post.dateTime}>
            <div className="entry-index">0{index + 1}<span> / 0{posts.length}</span></div>
            <div className="entry-body">
              <div className="post-card-meta">
                <span className="post-category">{post.category}</span>
                <time dateTime={post.dateTime}>{post.date}</time>
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <p className="entry-note">{post.note}</p>
            </div>
          </article>
        ))}
      </section>
      <div className="section-shell"><QuoteBlock page="vlog" /></div>
    </>
  );
}

function ContactPage() {
  return (
    <>
      <section className="page-heading" data-reveal>
        <p className="eyebrow">The door is open</p>
        <h1>Let’s start<br /><span className="gradient-text">a conversation.</span></h1>
        <p className="page-lead">Have a thought to share, a question to ask, or just want to say hello? I’d be happy to hear from you.</p>
      </section>
      <section className="contact-section section-shell" data-reveal>
        <SectionIntro label="Find me here" title="Pick your place" description="Choose whichever feels right. I look forward to hearing from you." />
        <div className="card-grid contact-grid">
          {socialLinks.map((link, index) => (
            <a
              className="contact-card glass-panel"
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <span className="contact-index">0{index + 1}</span>
              <span className="contact-icon" aria-hidden="true">{link.icon}</span>
              <span className="contact-label">{link.label}</span>
              <span className="contact-detail">{link.detail}</span>
              <span className="contact-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>
      <div className="section-shell"><QuoteBlock page="contact" /></div>
    </>
  );
}

function App() {
  const page = window.location.pathname.endsWith("/about.html")
    ? "about"
    : window.location.pathname.endsWith("/vlog.html")
      ? "vlog"
      : window.location.pathname.endsWith("/contact.html")
        ? "contact"
        : "home";

  useMotionAndReveal();

  useEffect(() => {
    if (window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) {
      const aura = document.querySelector(".pointer-aura");
      const moveAura = (event) => {
        aura.style.left = `${event.clientX}px`;
        aura.style.top = `${event.clientY}px`;
      };
      window.addEventListener("pointermove", moveAura, { passive: true });

      const spotlight = (event) => {
        const card = event.target.closest(".feature-card, .post-card, .contact-card");
        if (!card) return;
        const bounds = card.getBoundingClientRect();
        card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
        card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
      };
      window.addEventListener("pointermove", spotlight, { passive: true });
      return () => {
        window.removeEventListener("pointermove", moveAura);
        window.removeEventListener("pointermove", spotlight);
      };
    }

    return undefined;
  }, []);

  return (
    <div className={`app page-${page}`}>
      <AmbientScene />
      <div className="site-shell">
        <Header page={page} />
        <main className="main-content">
          {page === "about" ? <AboutPage /> : page === "vlog" ? <VlogPage /> : page === "contact" ? <ContactPage /> : <HomePage />}
        </main>
        <Footer page={page} />
      </div>
      <div className="pointer-aura" aria-hidden="true"></div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
