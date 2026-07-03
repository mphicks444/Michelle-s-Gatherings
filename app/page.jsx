"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Upcoming", href: "#upcoming", n: "01" },
  { label: "Moments", href: "#moments", n: "02" },
  { label: "Partners", href: "#sponsors", n: "03" },
  { label: "Contact", href: "#partner", n: "04" },
];

const SPONSORS = [{ name: "Reitler", src: "/sponsor-reitler.png" }];

const MOMENTS = [
  { src: "/moment-1.webp", alt: "Guests gathered around a candlelit dinner table" },
  { src: "/moment-2.webp", alt: "Guests in a lounge beneath a sculptural octopus installation" },
  { src: "/moment-3.webp", alt: "Guests at a panel discussion" },
];

const PARTNER_ROLES = ["Venue / space", "Brand / sponsor", "Chef / maker / vendor", "Co-host", "Press"];
const PARTNER_TYPES = [
  "Brand / Sponsor",
  "Venue / Hospitality",
  "Community / Membership Network",
  "Press / Media",
  "Production / Logistics",
  "Strategic Partner",
  "Other",
];

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [partnerState, setPartnerState] = useState("idle");
  const [partnerError, setPartnerError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", ptype: "", message: "" });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const go = (href) => (event) => {
    event.preventDefault();
    setMenuOpen(false);
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 420);
  };

  const submitPartnerForm = async (event) => {
    event.preventDefault();
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());

    if (!form.name.trim() || !okEmail || !form.ptype) {
      setPartnerError("Please add your name, a valid email, and a partnership type.");
      setPartnerState("error");
      return;
    }

    setPartnerState("sending");
    setPartnerError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Your message could not be sent. Please try again.");
      }

      setPartnerState("done");
    } catch (error) {
      setPartnerError(error.message || "Your message could not be sent. Please try again.");
      setPartnerState("error");
    }
  };

  return (
    <>
      <div className="gridlines" aria-hidden="true">
        <span className="v l" />
        <span className="v c" />
        <span className="v r" />
        <span className="h m" />
      </div>

      <header className="nav" data-scrolled={scrolled ? "true" : "false"}>
        <a href="#top" className="brand">
          <span className="brand-text">Michelle's Gatherings</span>
          <sup>&copy;</sup>
        </a>
        <button className="menu-btn" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
          <span className={`menu-bars ${menuOpen ? "open" : ""}`} aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="mono">{menuOpen ? "Close" : "Menu"}</span>
        </button>
        <div className="mono loc"><span />Worldwide</div>
      </header>

      <div className={`menu-overlay ${menuOpen ? "open" : ""}`}>
        <div className="menu-inner">
          <div className="menu-head">
            <span className="mono faint">Index</span>
            <span className="mono faint">Est. 2019</span>
          </div>
          <nav className="menu-nav">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="menu-link" onClick={go(link.href)}>
                <span className="ix mono">{link.n}</span>
                <span className="txt display">{link.label}</span>
              </a>
            ))}
          </nav>
          <div className="menu-foot">
            <div>
              <div className="mono faint menu-mini-title">Find us</div>
              <div className="menu-mini-row">
                <a href="#partner" onClick={go("#partner")} className="mono mini-link">Instagram</a>
                <a href="#partner" onClick={go("#partner")} className="mono mini-link">Email</a>
              </div>
            </div>
            <div className="menu-collab">
              <div className="mono faint menu-mini-title">Collaborate</div>
              <a href="#partner" onClick={go("#partner")} className="mono mini-link accent-link">Partner with us &rarr;</a>
            </div>
          </div>
        </div>
      </div>

      <main>
        <section id="top" className="nh nh-full">
          <div className="nh-bg nh-bg-filled">
            <img src="/hero.png" alt="A Michelle's Gatherings evening" className="nh-bg-img" />
            <div className="nh-vintage" aria-hidden="true" />
            <div className="nh-grain" aria-hidden="true" />
            <div className="nh-glow" aria-hidden="true" />
            <div className="nh-bg-flood" />
            <div className="nh-bg-scrim" />
          </div>

          <div className="nh-top">
            <span className="nh-eyebrow mono">Curated experiences worldwide</span>
            <span className="nh-est mono">By invitation</span>
          </div>

          <div className="nh-mid">
            <div className="nh-vside l"><span className="nh-vlabel l mono">Take your seat</span></div>
            <div />
            <div className="nh-vside r"><span className="nh-vlabel r mono">Scroll to explore &darr;</span></div>
          </div>

          <div className="nh-bot">
            <h1 className="nh-h1 display">
              <span>Made for gathering.</span>
              <span className="accent">Built for belonging.</span>
            </h1>
            <div className="nh-aside">
              <p className="nh-p">Curated experiences that bring exceptional people together - from intimate dinners and roundtables to retreats, celebrations, and unexpected moments worth sharing.</p>
            </div>
          </div>
        </section>

        <section id="upcoming" className="section">
          <SectionLabel n="01" title="Upcoming gatherings" right="On the calendar" />
          <div className="luma-shell">
            <div className="luma-copy">
              <span className="mono luma-kicker">Live from Luma</span>
              <h2 className="display luma-title">Upcoming gatherings, updated automatically.</h2>
              <p>
                New events added to Michelle's Gatherings on Luma will appear here without rebuilding the site.
                Open an event below to request a seat, view details, and share it with guests.
              </p>
            </div>
            <div className="luma-frame-wrap">
              <iframe
                src="https://luma.com/embed/calendar/cal-wUETNO51BasSkrX/events"
                title="Michelle's Gatherings events on Luma"
                className="luma-frame"
                allowFullScreen
                aria-hidden="false"
                tabIndex="0"
              />
            </div>
          </div>
        </section>

        <section id="moments" className="section moments-section">
          <SectionLabel n="02" title="Moments" right="From the gatherings so far" />
          <div className="mom-head">
            <h2 className="display mom-title">A look at the<br />room when it's full.</h2>
            <p className="mom-copy">No stock photos, no borrowed glamour - just the actual nights. Drop in your favorite shots and let them speak.</p>
          </div>
          <div className="mom-grid">
            {MOMENTS.map((moment, i) => (
              <div key={moment.src} className="mom-cell">
                <img src={moment.src} alt={moment.alt} className="mom-img" />
                <span className="mono mom-tag">{String(i + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="sponsors" className="section">
          <SectionLabel n="03" title="In good company" right="Partners & sponsors" />
          <p className="display spon-lede">Proudly partnered with</p>
          <div className="spon-row">
            {SPONSORS.map((sponsor) => (
              <div className="spon-cell" key={sponsor.name}>
                <img src={sponsor.src} alt={sponsor.name} className="spon-img" />
              </div>
            ))}
          </div>
        </section>

        <section id="partner" className="partner-section">
          <div className="partner-grid">
            <div className="partner-left">
              <span className="mono partner-kicker">04 - Partner with us</span>
              <h2 className="display partner-title">Let's make<br />something<br />together.</h2>
              <p className="partner-copy">Whether you run a beautiful space, make something delicious, represent a brand, host your own gatherings, or write about them - I'd love to hear from you.</p>
              <div className="role-row">
                {PARTNER_ROLES.map((role) => <span key={role} className="mono role-chip">{role}</span>)}
              </div>
            </div>
            <div className="partner-card">
              {partnerState === "done" ? (
                <div className="success-box">
                  <Spark />
                  <h3 className="display success-title">Thank you, {form.name.split(" ")[0] || "friend"}.</h3>
                  <p>Your note's on its way. I read every message personally and will be in touch soon.</p>
                  <button className="mono reset-btn" onClick={() => { setPartnerState("idle"); setPartnerError(""); setForm({ name: "", email: "", ptype: "", message: "" }); }}>Send another &rarr;</button>
                </div>
              ) : (
                <form className="partner-form" onSubmit={submitPartnerForm}>
                  <Field label="Your name"><input value={form.name} onChange={(event) => { setForm((state) => ({ ...state, name: event.target.value })); setPartnerState("idle"); setPartnerError(""); }} placeholder="Jane Doe" /></Field>
                  <Field label="Email"><input type="email" value={form.email} onChange={(event) => { setForm((state) => ({ ...state, email: event.target.value })); setPartnerState("idle"); setPartnerError(""); }} placeholder="you@email.com" /></Field>
                  <Field label="Partnership type">
                    <select value={form.ptype} onChange={(event) => { setForm((state) => ({ ...state, ptype: event.target.value })); setPartnerState("idle"); setPartnerError(""); }}>
                      <option value="" disabled>Select one...</option>
                      {PARTNER_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </Field>
                  <Field label="How could we work together?"><textarea value={form.message} onChange={(event) => setForm((state) => ({ ...state, message: event.target.value }))} rows={4} placeholder="Tell me a little about you and what you have in mind..." /></Field>
                  {partnerState === "error" ? <span className="mono error-text">{partnerError}</span> : null}
                  <button type="submit" className="submit-btn" disabled={partnerState === "sending"}>{partnerState === "sending" ? "Sending..." : "Send message \u2192"}</button>
                </form>
              )}
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="foot-top">
            <h2 className="display foot-word">Michelle's<br />Gatherings<sup>&copy;</sup></h2>
            <div className="foot-cols">
              <div className="foot-col">
                <span className="mono faint">Explore</span>
                <a href="#upcoming">Upcoming</a>
                <a href="#moments">Moments</a>
                <a href="#sponsors">Partners</a>
                <a href="#partner">Contact</a>
              </div>
              <div className="foot-col">
                <span className="mono faint">Find us</span>
                <a href="#partner">Instagram</a>
                <a href="#partner">hello@michellesgatherings.com</a>
              </div>
              <div className="foot-col">
                <span className="mono faint">Where</span>
                <span>Worldwide</span>
                <a href="#partner" className="accent-link">Partner with us &rarr;</a>
              </div>
            </div>
          </div>
          <div className="foot-bottom">
            <span className="mono faint">&copy; 2026 Michelle's Gatherings</span>
            <span className="mono faint">Made with care</span>
          </div>
        </footer>
      </main>
    </>
  );
}

function SectionLabel({ n, title, right }) {
  return (
    <div className="label-row">
      <div className="label-left"><span className="mono label-n">{n}</span><span className="label-line" /><span className="mono muted">{title}</span></div>
      {right ? <span className="mono faint">{right}</span> : null}
    </div>
  );
}

function Tag({ children, tone = "line" }) {
  return <span className={`tag mono ${tone}`}>{children}</span>;
}

function Field({ label, children }) {
  return <label className="field"><span className="mono">{label}</span>{children}</label>;
}

function Spark() {
  return (
    <svg className="spark" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.5 L13.4 9 L21 7.2 L15.6 12 L21 16.8 L13.4 15 L12 22.5 L10.6 15 L3 16.8 L8.4 12 L3 7.2 L10.6 9 Z" fill="currentColor" />
    </svg>
  );
}
