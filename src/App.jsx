import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  Heart,
  Gem,
  MapPin,
  Menu,
  Music2,
  Navigation,
  Quote,
  Shirt,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import Gatefold from "./components/Gatefold";
import ScratchCard from "./components/ScratchCard";
import Countdown from "./components/Countdown";
import RSVP from "./components/RSVP";
import "./App.css";

const revealVariants = {
  rise: {
    hidden: { opacity: 0, y: 42 },
    visible: { opacity: 1, y: 0 },
  },
  drift: {
    hidden: { opacity: 0, x: -34, rotate: -1.5 },
    visible: { opacity: 1, x: 0, rotate: 0 },
  },
  blur: {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  slide: {
    hidden: { opacity: 0, x: 38 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -15 },
    visible: { opacity: 1, rotate: 0, transition: { duration: 1 } },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.05,
      delay: i * 0.5, // stagger by index
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const weddingEvent = {
  title: "Sibin & Stefi's Wedding",
  description: "Wedding ceremony and reception for Sibin and Stefi.",
  location: "Hebron Parish Hall, Wadakkanchery, Thrissur, Kerala, India",
  start: "20270131T113000",
  end: "20270131T150000",
  timeZone: "Asia/Kolkata",
};

function escapeIcsValue(value) {
  return value.replace(/[\\;,]/g, (character) => `\\${character}`).replace(/\n/g, "\\n");
}

function createIcsFile() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sibin and Stefi//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:wedding-20270131@sibinandstefi",
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}`,
    `DTSTART;TZID=${weddingEvent.timeZone}:${weddingEvent.start}`,
    `DTEND;TZID=${weddingEvent.timeZone}:${weddingEvent.end}`,
    `SUMMARY:${escapeIcsValue(weddingEvent.title)}`,
    `DESCRIPTION:${escapeIcsValue(weddingEvent.description)}`,
    `LOCATION:${escapeIcsValue(weddingEvent.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Blob([ics], { type: "text/calendar;charset=utf-8" });
}

function saveDateToCalendar(event) {
  event.preventDefault();
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("android")) {
    const googleCalendarUrl = new URL("https://calendar.google.com/calendar/render");
    googleCalendarUrl.searchParams.set("action", "TEMPLATE");
    googleCalendarUrl.searchParams.set("text", weddingEvent.title);
    googleCalendarUrl.searchParams.set(
      "dates",
      `${weddingEvent.start}/${weddingEvent.end}`,
    );
    googleCalendarUrl.searchParams.set("ctz", weddingEvent.timeZone);
    googleCalendarUrl.searchParams.set("details", weddingEvent.description);
    googleCalendarUrl.searchParams.set("location", weddingEvent.location);
    window.location.href = googleCalendarUrl.toString();
    return;
  }

  const downloadUrl = URL.createObjectURL(createIcsFile());
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "sibin-and-stefi-wedding.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
}

function Reveal({ children, variant = "rise", delay = 0, className }) {
  return (
    <motion.div
      className={className}
      variants={revealVariants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.2, once: true }}
      transition={{ duration: 1.05, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const lastSectionVisibleRef = useRef(false);
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
      label: "The ceremony garden",
    },
    {
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=1000&q=85",
      label: "A golden afternoon",
    },
    {
      src: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=85",
      label: "Together, always",
    },
  ];

  useEffect(() => {
    if (!isOpen) return undefined;

    const lastSection = document.getElementById("rsvp");
    if (!lastSection) return undefined;

    const updateVisibility = () => {
      setShowBackToTop(
        lastSectionVisibleRef.current && window.scrollY > 120,
      );
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        lastSectionVisibleRef.current = entry.isIntersecting;
        updateVisibility();
      },
      { threshold: 0.25 },
    );
    observer.observe(lastSection);

    const handleScroll = () => {
      updateVisibility();
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <main className="invite-shell">
      <Gatefold isOpen={isOpen} onOpen={() => setIsOpen(true)} />
      {isOpen && (
        <div className="invite-page">
          <section className="hero-section" id="top">
            <div className="hero-container">
              <motion.div
                className="hero-copy"
                initial="hidden"
                animate="visible"
                variants={revealVariants.blur}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.p className="eyebrow" variants={revealVariants.rise}>
                  <Sparkles size={13} /> The beginning of forever
                </motion.p>
                <motion.p
                  className="invitation-line"
                  variants={revealVariants.scaleIn}
                >
                  Together with their families
                </motion.p>
                <motion.h1 initial="hidden" animate="visible">
                  <motion.span
                    custom={0}
                    variants={wordVariants}
                    style={{ display: "block" }}
                  >
                    Sibin
                  </motion.span>
                  <motion.span
                    custom={1}
                    variants={wordVariants}
                    style={{ display: "block" }}
                  >
                    <i>&</i>
                  </motion.span>
                  <motion.span
                    custom={2}
                    variants={wordVariants}
                    style={{ display: "block" }}
                  >
                    Stefi
                  </motion.span>
                </motion.h1>
                <div className="hero-rule">
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  >
                    <Heart size={16} />
                  </motion.div>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                  />
                </div>

                <motion.p
                  className="hero-date"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  January . 2027
                </motion.p>

                <motion.p
                  className="hero-location"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.3 }}
                >
                  Hebron Parish Hall · Wadakkanchery
                </motion.p>
              </motion.div>
            </div>

            <a className="scroll-cue" href="#story">
              <span>Scroll to explore</span>
              <ArrowDown size={15} />
            </a>
          </section>

          <section className="story-section section-pad" id="story">
            <Reveal
              variant="drift"
              className="section-heading"
              transition={{ duration: 1.5 }}
            >
              <p className="eyebrow">A note from us</p>
              <h2>
                Two paths,
                <br />
                <em>one beautiful life.</em>
              </h2>
            </Reveal>
            <Reveal variant="rise" delay={0.14} className="story-grid">
              <motion.div
                className="story-image"
                variants={revealVariants.slide}
              />
              <div className="story-copy">
                <Quote size={24} />
                <p>
                  Somehow, the ordinary days became our favorite ones. The
                  coffee shared, the roads taken, the quiet moments in between.
                  Now we would love to gather our favorite people and begin this
                  next chapter together.
                </p>
                <span className="signature">Sibin & Stefi</span>
              </div>
            </Reveal>
          </section>

          <section className="date-section section-pad">
            <Reveal
              variant="blur"
              className="section-heading section-heading--center"
              transition={{ duration: 1.5 }}
            >
              <p className="eyebrow">Keep this little secret</p>
              <h2>Circle your calendar</h2>
              <p>Scratch away the shimmer to reveal our day.</p>
            </Reveal>
            <Reveal variant="rise" delay={0.50}>
              <ScratchCard onReveal={() => setHasRevealed(true)} />
            </Reveal>
            {hasRevealed && (
              <motion.button
                type="button"
                className="button button--gold"
                onClick={saveDateToCalendar}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Save the date <CalendarDays size={15} />
              </motion.button>
            )}
          </section>

          <section className="countdown-section">
            <Reveal
              variant="drift"
              className="section-heading section-heading--center"
            >
              <p className="eyebrow">Until we say I do</p>
              <h2>The countdown is on</h2>
            </Reveal>
            <Reveal variant="rise" delay={0.16}>
              <Countdown />
            </Reveal>
          </section>

          <section className="gallery-section section-pad">
            <Reveal variant="drift" className="section-heading">
              <p className="eyebrow">A few favorite frames</p>
              <h2>Meet us by the lake</h2>
            </Reveal>
            <Reveal variant="slide" delay={0.16} className="gallery-slider">
              <motion.img
                key={slides[slide].src}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                src={slides[slide].src}
                alt={slides[slide].label}
              />
              <div className="gallery-caption">
                <span>{slides[slide].label}</span>
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setSlide((slide + slides.length - 1) % slides.length)
                    }
                    aria-label="Previous photo"
                  >
                    <ChevronLeft />
                  </button>
                  <span>
                    0{slide + 1} / 0{slides.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSlide((slide + 1) % slides.length)}
                    aria-label="Next photo"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </Reveal>
          </section>

          <section className="details-section section-pad" id="details">
            <Reveal
              variant="blur"
              className="section-heading section-heading--center"
            >
              <p className="eyebrow">The details</p>
              <h2>Join us for the day</h2>
            </Reveal>
            <Reveal variant="rise" delay={0.12} className="timeline">
              <div className="timeline-item">
                <span className="timeline-icon">
                  <Clock3 size={17} />
                </span>
                <div>
                  <p className="eyebrow">11:30 am</p>
                  <h3>Guest arrival</h3>
                  <p>Welcome drinks in the Hebron Parish Hall.</p>
                </div>
              </div>
              <div className="timeline-item">
                <span className="timeline-icon">
                  <Gem size={17} />
                </span>
                <div>
                  <p className="eyebrow">12:00 pm</p>
                  <h3>Wedding ceremony</h3>
                  <p>
                    at St. Francis Xavier's Forane Church, Wadakkanchery ·
                    Thrissur
                  </p>
                  {/* <a
                className="text-link"
                href="https://maps.app.goo.gl/vmVHA9FBqSQsHZwL9"
                target="_blank"
                rel="noreferrer"
              >
                Open directions <Navigation size={13} />
              </a> */}
                </div>
              </div>
              <div className="timeline-item">
                <span className="timeline-icon">
                  <Utensils size={17} />
                </span>
                <div>
                  <p className="eyebrow">12:30 pm</p>
                  <h3>Reception</h3>
                  <p>Lunch at Hebron Parish Hall</p>
                </div>
              </div>
            </Reveal>
            <Reveal variant="slide" delay={0.2} className="venue-card">
              <div>
                <p className="eyebrow">
                  <MapPin size={13} /> Our venue
                </p>
                <h3>Hebron Parish Hall</h3>
                <p>
                  St. Francis Xavier's Forane Church, Wadakkanchery · Thrissur
                </p>
                <a
                  className="text-link"
                  href="https://maps.app.goo.gl/vmVHA9FBqSQsHZwL9"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open directions <Navigation size={13} />
                </a>
              </div>
              <iframe
                className="venue-map"
                title="Hebron Parish Hall location"
                src="https://www.google.com/maps?q=Hebron+Parish+Hall%2C+Wadakkanchery%2C+Thrissur&output=embed"
                loading="lazy"
              />
            </Reveal>
          </section>

          {/* <section className="info-section section-pad">
          <div className="section-heading section-heading--center">
            <p className="eyebrow">Come as you are</p>
            <h2>The little things</h2>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <Shirt size={21} />
              <h3>Dress code</h3>
              <p>
                Italian garden party. Think soft tailoring, delicate florals,
                and shoes made for wandering.
              </p>
            </div>
            <div className="info-item">
              <Compass size={21} />
              <h3>Stay awhile</h3>
              <p>
                We have gathered a few favorite nearby stays for making a
                weekend of it.
              </p>
            </div>
            <div className="info-item">
              <Crown size={21} />
              <h3>Gifts</h3>
              <p>
                Your presence is the loveliest gift. For those who wish, a
                contribution to our next adventure means the world.
              </p>
            </div>
          </div>
        </section> */}

          <section className="rsvp-section section-pad" id="rsvp">
            <Reveal variant="drift" className="rsvp-intro">
              <p className="eyebrow">Kindly reply</p>
              <h2>Will you join us?</h2>
              <p>
                We hope to celebrate under the stars with all of our favorite
                people.
              </p>
            </Reveal>
            <Reveal variant="rise" delay={0.16}>
              <RSVP />
            </Reveal>
          </section>
          <footer>
            <div className="monogram">
              S<span>&</span>S
            </div>
            <p>With love, always.</p>
            <Music2 size={15} />
          </footer>
          <AnimatePresence>
            {showBackToTop && (
              <motion.button
                className="back-to-top"
                type="button"
                aria-label="Back to the beginning"
                initial={{ opacity: 0, y: 24, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.92 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onClick={scrollToTop}
              >
                <ArrowUp size={15} />
                <span>Back to the beginning</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}

export default App;
