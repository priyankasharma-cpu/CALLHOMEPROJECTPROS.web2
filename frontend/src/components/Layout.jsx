import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  House,
  Check,
  ChevronDown,
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { services, categories } from "../data/services";
import { siteConfig } from "../config/siteConfig";
import CallCTA from "./CallCTA";
import { ServiceIcon } from "./ServicesGrid";
export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Call Home Project Pros home">
      <span className="logo-mark">
        <House size={29} strokeWidth={1.8} />
        <Check size={14} />
      </span>
      <span>
        CALL HOME
        <strong>
          PROJECT PROS<span className="logo-dot">.</span>
        </strong>
      </span>
    </Link>
  );
}
export default function Layout() {
  const [menu, setMenu] = useState(false);
  const [mega, setMega] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuButton = useRef();
  const navRef = useRef();
  const stickyRef = useRef();
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty(
        "--mobile-actions-height",
        `${entry.target.getBoundingClientRect().height}px`,
      );
    });
    observer.observe(stickyRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    setMenu(false);
    setMega(false);
    if (location.hash) {
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
    } else window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    function close(e) {
      if (e.key === "Escape" && (menu || mega) && !e.target.closest("dialog")) {
        setMega(false);
        setMenu(false);
        menuButton.current?.focus();
      }
    }
    function outside(e) {
      if (!navRef.current?.contains(e.target)) setMega(false);
    }
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [menu, mega]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="utility">
        <div className="container">
          <span>
            <ShieldCheck size={14} /> A simpler way to start your home project
          </span>
          <span>
            Homeowner focused <i /> No-obligation requests <i />{" "}
            <Link to="/contact">
              Let’s talk about your project <ArrowUpRight size={13} />
            </Link>
          </span>
        </div>
      </div>
      <header className={`header ${scrolled ? "scrolled" : ""}`} ref={navRef}>
        <div className="container nav">
          <Logo />
          <nav
            id="primary-nav"
            aria-label="Main navigation"
            className={menu ? "nav-links open" : "nav-links"}
          >
            <NavLink to="/" end>
              Home
            </NavLink>
            <div className="services-nav">
              <button
                aria-expanded={mega}
                aria-controls="services-menu"
                onClick={() => setMega(!mega)}
              >
                Services <ChevronDown size={14} />
              </button>
              {mega && (
                <div className="mega-menu" id="services-menu">
                  <div className="mega-heading">
                    <span>What’s on your home’s to-do list?</span>
                    <Link to="/services" onClick={() => setMega(false)}>
                      All services <ArrowRight size={16} />
                    </Link>
                  </div>
                  <div className="mega-columns">
                    {categories.slice(1).map((cat) => (
                      <div key={cat}>
                        <strong>{cat}</strong>
                        {services
                          .filter((s) => s.category === cat)
                          .map((s) => (
                            <Link key={s.slug} to={`/services/${s.slug}`}>
                              <ServiceIcon name={s.icon} size={17} />
                              {s.title}
                            </Link>
                          ))}
                      </div>
                    ))}
                  </div>
                  <div className="mega-feature">
                    <img
                      src="/images/kitchen.webp"
                      width="160"
                      height="85"
                      alt="Bright remodeled kitchen"
                    />
                    <div>
                      <strong>Every great project starts somewhere.</strong>
                      <span>
                        Find the next step for the place you call home.
                      </span>
                    </div>
                    <CallCTA compact location="mega_menu_call" />
                  </div>
                </div>
              )}
            </div>
            <NavLink to="/cost-guides">Cost Guides</NavLink>
            <NavLink to="/how-it-works">How It Works</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/resources">Resources</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          <CallCTA compact location="navbar_call" />
          <button
            className="menu-toggle"
            ref={menuButton}
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-controls="primary-nav"
            aria-label={menu ? "Close navigation" : "Open navigation"}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <div className="mobile-sticky" ref={stickyRef}>
        <CallCTA compact location="mobile_sticky_call" />
        <Link className="button secondary" to="/quote">
          Get Free Quote <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div>
            <span className="eyebrow">LET’S GET YOUR PROJECT STARTED</span>
            <h2>
              Planning a Home Project?
              <br /> <span>Let’s Talk.</span>
            </h2>
          </div>
          <CallCTA location="footer_call" />
        </div>
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              Helping homeowners take the next step with their home projects.
              One conversation at a time.
            </p>
            <span className="footer-note">
              <House size={16} /> Your home. Your project. Your choice.
            </span>
          </div>
          <div>
            <h3>Explore services</h3>
            {[
              "roofing",
              "hvac",
              "windows",
              "plumbing",
              "bathroom-remodeling",
            ].map((slug) => (
              <Link key={slug} to={`/services/${slug}`}>
                {services.find((s) => s.slug === slug).title}
              </Link>
            ))}
            <Link to="/services">
              All home services <ArrowUpRight size={14} />
            </Link>
          </div>
          <div>
            <h3>Helpful resources</h3>
            <Link to="/cost-guides">Cost guides</Link>
            <Link to="/resources">Homeowner guides</Link>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/faq">Common questions</Link>
          </div>
          <div>
            <h3>Our company</h3>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact us</Link>
            {siteConfig.supportEmail && (
              <a href={`mailto:${siteConfig.supportEmail}`}>Email support</a>
            )}
          </div>
          <div>
            <h3>Legal &amp; trust</h3>
            <Link to="/privacy-policy">Privacy policy</Link>
            <Link to="/terms">Terms of use</Link>
            <Link to="/how-it-works">Our process</Link>
            <Link to="/faq">Your questions</Link>
          </div>
        </div>
        <p className="disclaimer">
          Call Home Project Pros is a project connection platform, not a
          contractor. Provider availability varies by service and location.
          Homeowners are responsible for evaluating providers, verifying
          qualifications, and agreeing to the scope and terms of any work.
        </p>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Call Home Project Pros. All rights
            reserved.
          </span>
          <span>Made for the place you call home.</span>
        </div>
      </div>
    </footer>
  );
}
