#!/usr/bin/env python3
"""Generate Wings For Dreams static HTML prototype pages."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# Absolute base for canonical URLs, social images and the sitemap.
# Change this when the site moves to its own domain.
SITE_URL = "https://gaurav-lonkar.github.io/wingsfordreams"

# Unguessable staff area. Never put this path in the public nav or robots.txt —
# security is obscurity only on a static host, but that is enough to keep casual
# visitors off the login screen.
STAFF_DIR = "staff-0ef85eac"

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title} | Wings For Dreams</title>
  <meta name="description" content="{description}" />
  <link rel="canonical" href="__PAGE_URL__" />
{robots}  <meta name="theme-color" content="#ae0d36" />
  <link rel="icon" href="assets/favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" sizes="32x32" href="assets/icon-32.png" />
  <link rel="apple-touch-icon" href="assets/icon-180.png" />
  <link rel="manifest" href="site.webmanifest" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Wings For Dreams" />
  <meta property="og:locale" content="en_IN" />
  <meta property="og:title" content="{title} | Wings For Dreams" />
  <meta property="og:description" content="{description}" />
  <meta property="og:url" content="__PAGE_URL__" />
  <meta property="og:image" content="{site_url}/assets/social-card.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{title} | Wings For Dreams" />
  <meta name="twitter:description" content="{description}" />
  <meta name="twitter:image" content="{site_url}/assets/social-card.jpg" />
  <link rel="stylesheet" href="css/fonts.css" />
  <link rel="stylesheet" href="css/tokens.css" />
  <link rel="stylesheet" href="css/base.css" />
  <link rel="stylesheet" href="css/components.css" />
  <link rel="stylesheet" href="css/pages.css" />
  <script src="js/vendor/qrcode.js" defer></script>
  <script src="js/upi-config.js" defer></script>
  <script src="js/employees.js" defer></script>
  <script src="js/festivals.js" defer></script>
  <script src="js/main.js" defer></script>
</head>
<body{body_class}>
{scroll_progress}  <div class="festive-bar" data-festive-bar hidden>
    <span data-festive-label>Happy festival</span>
  </div>
  <a class="float-donate" href="{donate_href}" data-employee-link>{float_pulse}Donate</a>
"""

SCROLL_PROGRESS = '  <div class="scroll-progress" aria-hidden="true"></div>\n'
FLOAT_PULSE = '<span class="float-donate__pulse" aria-hidden="true"></span> '

def header(active: str, donate_href: str = "donate.html") -> str:
    def act(name: str) -> str:
        return ' is-active' if active == name else ''

    return f"""  <header class="site-header">
    <div class="container container--wide site-header__inner">
      <a class="brand" href="index.html" aria-label="Wings For Dreams home">
        <img class="brand__logo" src="assets/logo-240.png" alt="" width="72" height="52" onerror="this.style.display='none'" />
        <span class="brand__name">Wings For Dreams</span>
      </a>
      <div class="header-end">
        <nav class="nav" id="site-nav" aria-label="Primary">
          <ul class="nav__list">
            <li class="nav__item nav__item--has-sub">
              <a class="nav__link{act('impact')}" href="impact.html">Impact <span class="nav__chevron" aria-hidden="true"></span></a>
              <div class="nav__dropdown">
                <a href="women-empowerment.html">Women Empowerment</a>
                <a href="child-education.html">Child Education</a>
                <a href="environment.html">Environment</a>
                <a href="dog-feeding.html">Dog Feeding</a>
              </div>
            </li>
            <li class="nav__item"><a class="nav__link{act('csr')}" href="csr.html">CSR</a></li>
            <li class="nav__item"><a class="nav__link{act('about')}" href="about.html">About Us</a></li>
            <li class="nav__item nav__item--has-sub">
              <a class="nav__link{act('contact')}" href="contact.html">Contact Us <span class="nav__chevron" aria-hidden="true"></span></a>
              <div class="nav__dropdown">
                <a href="career.html">Career</a>
                <a href="banks.html">Bank Details</a>
              </div>
            </li>
            <li class="nav__item"><a class="nav__link{act('school')}" href="school-kit.html">Donate School Kit</a></li>
          </ul>
          <div class="nav__actions">
            <div class="employee-chip" data-employee-chip hidden></div>
            <a class="btn btn--primary btn--sm header-cta--desktop" href="{donate_href}" data-employee-link>Donate Now</a>
          </div>
        </nav>
        <a class="btn btn--primary btn--sm header-cta--mobile" href="{donate_href}" data-employee-link>Donate Now</a>
        <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
"""

FOOTER = """  <footer class="site-footer">
    <div class="container container--wide">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">Wings For Dreams</div>
          <p>Warm, transparent, and rooted in Pune—helping children learn, women rise, animals heal, and neighborhoods grow greener.</p>
          <p>PAN AAATW5579L · Reg. MAH542/2019<br />80G · 12A certified</p>
        </div>
        <div class="footer-col">
          <h4>Impact</h4>
          <ul>
            <li><a href="women-empowerment.html">Women Empowerment</a></li>
            <li><a href="child-education.html">Child Education</a></li>
            <li><a href="environment.html">Environment</a></li>
            <li><a href="dog-feeding.html">Dog Feeding</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Get involved</h4>
          <ul>
            <li><a href="{donate_href}" data-employee-link>Donate</a></li>
            <li><a href="school-kit.html">School Kit</a></li>
            <li><a href="csr.html">CSR</a></li>
            <li><a href="career.html">Career</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>Ashoka Mall, G4, Bund Garden Rd, Pune</li>
            <li><a href="tel:+918698637796">+91 8698 637 796</a></li>
            <li><a href="mailto:info@wingsfordreams.org">info@wingsfordreams.org</a></li>
            <li><a href="banks.html">Bank details</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© Wings For Dreams</span>
        <span>
          <a href="https://www.facebook.com/wingsfordreamss/" rel="noopener">Facebook</a> ·
          <a href="https://www.instagram.com/wingsfordreamss" rel="noopener">Instagram</a> ·
          <a href="https://www.youtube.com/@wingsfordreamss" rel="noopener">YouTube</a>
        </span>
      </div>
    </div>
  </footer>
</body>
</html>
"""

def donate_url(cause: str | None = None, amount: int | None = None) -> str:
    """Build donate.html URL with optional cause/amount query params."""
    from urllib.parse import urlencode

    q = {}
    if cause:
        q["cause"] = cause
    if amount is not None:
        q["amount"] = str(amount)
    if not q:
        return "donate.html"
    return "donate.html?" + urlencode(q)


def page(
    title,
    description,
    active,
    body,
    donate_cause=None,
    no_motion=False,
    noindex=False,
):
    """Build a page. `no_motion` opts out of animation, `noindex` out of search."""
    donate_href = donate_url(donate_cause)
    return (
        HEAD.format(
            title=title,
            description=description,
            donate_href=donate_href,
            site_url=SITE_URL,
            robots='  <meta name="robots" content="noindex, follow" />\n'
            if noindex
            else "",
            body_class=' class="no-motion"' if no_motion else "",
            scroll_progress="" if no_motion else SCROLL_PROGRESS,
            float_pulse="" if no_motion else FLOAT_PULSE,
        )
        + header(active, donate_href=donate_href)
        + body
        + FOOTER.format(donate_href=donate_href)
    )
pages = {}

pages["index.html"] = page(
    "Home",
    "Join Wings For Dreams NGO in creating real change through education, women’s empowerment, animal care, and environment.",
    "home",
    """
  <main>
    <section class="hero" data-hero-carousel data-interval="5500">
      <div class="hero__slides" aria-hidden="true">
        <div class="hero__slide is-active" style="background-image:url('assets/photos/hero-community-1.webp')"></div>
        <div class="hero__slide" data-bg="assets/photos/hero-community-2.webp"></div>
        <div class="hero__slide" data-bg="assets/photos/hero-community-3.webp"></div>
        <div class="hero__slide" data-bg="assets/photos/child-class.webp"></div>
        <div class="hero__slide" data-bg="assets/photos/women-hero.webp"></div>
      </div>
      <div class="container container--wide hero__content">
        <div class="hero__copy">
          <div class="friendly-chip reveal"><span class="friendly-chip__dot"></span> Open hearts in Pune since 2019</div>
          <p class="hero__brand reveal">Wings For Dreams</p>
          <h1 class="reveal">A safe and joyful place for your lovely children</h1>
          <p class="hero__lede reveal">We walk beside families with education, women’s empowerment, animal care, and greener streets—kindness you can feel.</p>
          <div class="hero__actions reveal">
            <a class="btn btn--light" href="donate.html" data-employee-link>Give with love</a>
            <a class="btn btn--ghost btn--on-dark" href="impact.html">Explore impact</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="about">
      <div class="container split">
        <div class="reveal">
          <p class="eyebrow">About us</p>
          <h2>Change begins with a single act of kindness</h2>
          <p>Founded on 29 March 2019 by Mr. Richard Almeida, Wings For Dreams is a student-led nonprofit. We care for children’s education, women’s dignity, street animals, and the environment—quietly, consistently, with heart.</p>
          <div class="about-stats">
            <div><strong>2019</strong><span>Founded in Pune</span></div>
            <div><strong data-count="10000" data-suffix="+">0</strong><span>Children supported</span></div>
            <div><strong data-count="52" data-suffix="+">0</strong><span>Dogs rescued</span></div>
            <div><strong data-count="17000">0</strong><span>Trees planted (CSR)</span></div>
          </div>
        </div>
        <div class="split__media reveal">
          <div class="media-carousel" data-carousel data-interval="4500">
            <div class="media-carousel__slides">
              <img src="assets/photos/hero-community-2.webp" alt="Wings For Dreams community gathering" loading="lazy" />
              <img src="assets/photos/child-activity.webp" alt="" loading="lazy" />
              <img src="assets/photos/dogs-feed.webp" alt="" loading="lazy" />
              <img src="assets/photos/env-hero.webp" alt="" loading="lazy" />
            </div>
            <div class="media-carousel__dots" data-carousel-dots></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--muted">
      <div class="container">
        <div class="section__head reveal">
          <p class="eyebrow">Our causes</p>
          <h2>Four ways your kindness lands</h2>
          <p>Pick a path that speaks to you—every rupee is guided with care and accountability.</p>
        </div>
        <div class="card-grid card-grid--4 reveal-stagger">
          <a class="cause-card reveal" href="women-empowerment.html">
            <div class="cause-card__media"><img src="assets/photos/women-hero.webp" alt="" loading="lazy" /></div>
            <div class="cause-card__body">
              <h3>Women Empowerment</h3>
              <p>Pads, livelihood, awareness, and self-defense for rural women and girls.</p>
              <span class="cause-card__link">Learn more <span>→</span></span>
            </div>
          </a>
          <a class="cause-card reveal" href="child-education.html">
            <div class="cause-card__media"><img src="assets/photos/child-hero.webp" alt="" loading="lazy" /></div>
            <div class="cause-card__body">
              <h3>Child Education</h3>
              <p>Happy Bachapan, school kits, and creative workshops that keep childhood bright.</p>
              <span class="cause-card__link">Learn more <span>→</span></span>
            </div>
          </a>
          <a class="cause-card reveal" href="dog-feeding.html">
            <div class="cause-card__media"><img src="assets/photos/dogs-hero.webp" alt="" loading="lazy" /></div>
            <div class="cause-card__body">
              <h3>Animal Care</h3>
              <p>Daily meals, rescue, and veterinary care for street dogs who need a friend.</p>
              <span class="cause-card__link">Learn more <span>→</span></span>
            </div>
          </a>
          <a class="cause-card reveal" href="environment.html">
            <div class="cause-card__media"><img src="assets/photos/env-hero.webp" alt="" loading="lazy" /></div>
            <div class="cause-card__body">
              <h3>Environment</h3>
              <p>Trees and cloth bags—small green habits that cool our shared home.</p>
              <span class="cause-card__link">Learn more <span>→</span></span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="section section--blush">
      <div class="container">
        <div class="section__head reveal">
          <p class="eyebrow">Peek inside</p>
          <h2>Stories that stay with us</h2>
        </div>
        <div class="impact-tabs reveal" data-impact-tabs>
          <button type="button" class="impact-tab is-active" data-tab="bachapan">Happy Bachapan</button>
          <button type="button" class="impact-tab" data-tab="women">Women rising</button>
          <button type="button" class="impact-tab" data-tab="trees">17,000 trees</button>
          <button type="button" class="impact-tab" data-tab="dogs">Street dog care</button>
        </div>
        <div class="impact-spotlight reveal">
          <div class="impact-spotlight__content" data-impact-panels>
            <div class="impact-panel is-active" data-panel="bachapan" data-visual="assets/photos/child-class.webp">
              <h3>Standing with migrant children</h3>
              <p>We met children on a construction site—hungry for food, language, and dignity. Happy Bachapan brings meals, festivals, and learning so childhood isn’t lost to migration.</p>
              <a class="btn btn--primary btn--sm" href="child-education.html">See the program</a>
            </div>
            <div class="impact-panel" data-panel="women" data-visual="assets/photos/women-hero.webp">
              <h3>Dignity starts with basics</h3>
              <p>Rural pads plants, free napkins, hygiene awareness, and free self-defense training—practical care that helps women and girls move through the world safer and stronger.</p>
              <a class="btn btn--primary btn--sm" href="women-empowerment.html">Meet the work</a>
            </div>
            <div class="impact-panel" data-panel="trees" data-visual="assets/photos/env-hero.webp">
              <h3>Mission 17,000 Trees</h3>
              <p>At Holkarwadi, volunteers planted nearly 17,000 trees across 5 acres—neem, tamarind, sacred fig, and more—turning CSR into living shade.</p>
              <a class="btn btn--primary btn--sm" href="csr.html">CSR partnerships</a>
            </div>
            <div class="impact-panel" data-panel="dogs" data-visual="assets/photos/dogs-feed.webp">
              <h3>Feed. Rescue. Heal.</h3>
              <p>Street dogs face hunger and injury daily. Together we’ve rescued 52+ dogs and keep meals and vet care moving through the community.</p>
              <a class="btn btn--primary btn--sm" href="dog-feeding.html">Help an animal</a>
            </div>
          </div>
          <div class="impact-spotlight__visual">
            <img src="assets/photos/child-class.webp" alt="" data-impact-visual loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section__head reveal">
          <p class="eyebrow">Why families trust us</p>
          <h2>Soft values. Steady hands.</h2>
        </div>
        <div class="value-row reveal-stagger">
          <div class="value-item reveal"><h3>Kindness</h3><p>Small acts, shared widely—that’s how neighborhoods change.</p></div>
          <div class="value-item reveal"><h3>Creativity</h3><p>Imagination is a classroom too. We make space for it.</p></div>
          <div class="value-item reveal"><h3>Care</h3><p>Every childhood deserves warmth, safety, and someone who shows up.</p></div>
          <div class="value-item reveal"><h3>Courage</h3><p>We try new ways when old ones leave people behind.</p></div>
        </div>
      </div>
    </section>

    <section class="section section--cyan">
      <div class="container split">
        <div class="reveal">
          <p class="eyebrow">Transparency</p>
          <h2>Clear books. Open hearts.</h2>
          <p>Registered in India with 80G and 12A. Ask for documents anytime—your trust is part of the gift.</p>
          <div class="trust-strip trust-strip--spaced">
            <span class="trust-pill">80G</span>
            <span class="trust-pill">12A</span>
            <span class="trust-pill">NGO Certificate</span>
            <span class="trust-pill">PAN</span>
            <span class="trust-pill">Annual Report</span>
          </div>
          <p class="note">PAN AAATW5579L · Registration MAH542/2019</p>
        </div>
        <div class="reveal">
          <div class="donate-panel">
            <h3>Give any amount. Save on tax.</h3>
            <p>Section 80G benefits apply. You’ll receive an official receipt for completed gifts on the live site.</p>
            <a class="btn btn--primary" href="donate.html" data-employee-link>Start a donation</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section__head reveal">
          <p class="eyebrow">Good to know</p>
          <h2>Friendly answers</h2>
        </div>
        <div class="accordion reveal">
          <div class="accordion__item">
            <button class="accordion__trigger" type="button" aria-expanded="false">Is my donation tax-exempt? <span class="accordion__icon">+</span></button>
            <div class="accordion__panel"><div class="accordion__panel-inner">Yes—eligible donations can claim benefits under Section 80G. We issue receipts for verified gifts.</div></div>
          </div>
          <div class="accordion__item">
            <button class="accordion__trigger" type="button" aria-expanded="false">Can I sponsor a school kit? <span class="accordion__icon">+</span></button>
            <div class="accordion__panel"><div class="accordion__panel-inner">Absolutely. Kits start at ₹700 or ₹2,000, and we top up each kit so a child gets everything they need—plus photo feedback when possible.</div></div>
          </div>
          <div class="accordion__item">
            <button class="accordion__trigger" type="button" aria-expanded="false">How else can I help? <span class="accordion__icon">+</span></button>
            <div class="accordion__panel"><div class="accordion__panel-inner">Volunteer, intern, or partner through CSR. Visit Career or Contact—we’d love to meet you.</div></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--primary">
      <div class="container cta-band reveal">
        <h2>Ready to brighten a child’s day?</h2>
        <div class="cta-actions">
          <a class="btn btn--light" href="donate.html" data-employee-link>Donate</a>
          <a class="btn btn--ghost btn--on-dark" href="school-kit.html">Sponsor a kit</a>
        </div>
      </div>
    </section>
  </main>
""",
)

pages["about.html"] = page(
    "About Us",
    "Learn about Wings For Dreams, founded by Richard Almeida in Pune on 29 March 2019.",
    "about",
    """
  <main>
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/hero-community-3.webp,assets/photos/hero-community-1.webp,assets/photos/child-hero.webp,assets/photos/women-hero.webp">
      <div class="container">
        <p class="eyebrow">About Us</p>
        <h1>A student-led nonprofit for dignity and care</h1>
        <p>From 29 March 2019 to today, Wings For Dreams has worked to bring positive change to needy people, children, and students across Pune and beyond.</p>
      </div>
    </section>
    <section class="section">
      <div class="container split">
        <div class="reveal">
          <h2>Our story</h2>
          <p>Founded by Mr. Richard Almeida, Wings For Dreams is a non-profit, student-based organization. We focus on children’s education, women’s and girls’ empowerment (health, education, economic), environment, public awareness, food donation, street animals, elderly people, and disabled children.</p>
          <p>Change begins with a single act of kindness. When we come together, small actions create a ripple that transforms communities.</p>
        </div>
        <div class="split__media reveal">
          <img src="assets/photos/about-portrait.webp" alt="Wings For Dreams" loading="lazy" />
        </div>
      </div>
    </section>
    <section class="section section--muted">
      <div class="container">
        <div class="section__head reveal">
          <p class="eyebrow">How we work</p>
          <h2>Empowering young minds, transforming futures</h2>
        </div>
        <div class="card-grid card-grid--3 reveal-stagger">
          <div class="program-item reveal"><h3>Holistic development</h3><p>Learning beyond textbooks—values, creativity, and emotional well-being.</p></div>
          <div class="program-item reveal"><h3>Dedicated mentors</h3><p>Passionate volunteers and teachers guiding every step.</p></div>
          <div class="program-item reveal"><h3>Safe &amp; supportive</h3><p>Supervision with love and care for every child we serve.</p></div>
        </div>
      </div>
    </section>
  </main>
""",
)

pages["impact.html"] = page(
    "Impact",
    "Explore Wings For Dreams impact areas: women empowerment, child education, environment, and animal care.",
    "impact",
    """
  <main>
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/hero-community-2.webp,assets/photos/env-hero.webp,assets/photos/dogs-hero.webp,assets/photos/child-class.webp">
      <div class="container">
        <p class="eyebrow">Impact</p>
        <h1>Where your support becomes change</h1>
        <p>Four cause areas. One mission—dignity for people, animals, and the planet we share.</p>
      </div>
    </section>
    <section class="section">
      <div class="container card-grid card-grid--2 reveal-stagger">
        <a class="cause-card reveal" href="women-empowerment.html">
          <div class="cause-card__media"><img src="assets/photos/women-hero.webp" alt="" loading="lazy" /></div>
          <div class="cause-card__body">
            <h3>Women Empowerment</h3>
            <p>Sanitary pads plants, free napkins, awareness, and self-defense training.</p>
            <span class="cause-card__link">Open →</span>
          </div>
        </a>
        <a class="cause-card reveal" href="child-education.html">
          <div class="cause-card__media"><img src="assets/photos/child-hero.webp" alt="" loading="lazy" /></div>
          <div class="cause-card__body">
            <h3>Child Education</h3>
            <p>Happy Bachapan, educational kits, and extracurricular workshops in slums.</p>
            <span class="cause-card__link">Open →</span>
          </div>
        </a>
        <a class="cause-card reveal" href="environment.html">
          <div class="cause-card__media"><img src="assets/photos/env-hero.webp" alt="" loading="lazy" /></div>
          <div class="cause-card__body">
            <h3>Environment</h3>
            <p>Tree plantation and cloth-bag distribution to reduce plastic waste.</p>
            <span class="cause-card__link">Open →</span>
          </div>
        </a>
        <a class="cause-card reveal" href="dog-feeding.html">
          <div class="cause-card__media"><img src="assets/photos/dogs-hero.webp" alt="" loading="lazy" /></div>
          <div class="cause-card__body">
            <h3>Dog Feeding &amp; Care</h3>
            <p>Meals, rescue (52+ dogs), and veterinary support for street animals.</p>
            <span class="cause-card__link">Open →</span>
          </div>
        </a>
      </div>
    </section>
  </main>
""",
)

pages["women-empowerment.html"] = page(
    "Women Empowerment",
    "Sanitary pads distribution, livelihood for rural women, and self-defense training.",
    "impact",
    """
  <main>
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/women-hero.webp,assets/photos/women-art.webp,assets/photos/cause-women.webp,assets/photos/strip-1.webp">
      <div class="container">
        <p class="eyebrow">Impact</p>
        <h1>Women Empowerment</h1>
        <p>“What you do makes a difference, and you have to decide what kind of difference you want to make.”</p>
      </div>
    </section>
    <section class="section">
      <div class="container split">
        <div class="split__media split__media--coral reveal">
          <div class="media-carousel" data-carousel data-interval="4200">
            <div class="media-carousel__slides">
              <img src="assets/photos/women-art.webp" alt="Women empowerment program" loading="lazy" />
              <img src="assets/photos/women-art-2.webp" alt="" loading="lazy" />
              <img src="assets/photos/women-hero.webp" alt="" loading="lazy" />
            </div>
            <div class="media-carousel__dots" data-carousel-dots></div>
          </div>
        </div>
        <div class="program-list">
          <article class="program-item reveal">
            <h3>Sanitary pads distribution</h3>
            <p>We establish sanitary-pads making plants in rural areas, generate employment for rural women, provide free sanitary napkins to girls and women, and run awareness campaigns on safe hygiene.</p>
          </article>
          <article class="program-item reveal">
            <h3>Women safety &amp; self-defense</h3>
            <p>We offer free self-defense training so girls and women learn practical techniques for personal safety.</p>
          </article>
          <article class="program-item reveal">
            <h3>Motivation to women</h3>
            <p>There is no tool for development more effective than the empowerment of women. Empowering one woman motivates another—progress for generations.</p>
          </article>
        </div>
      </div>
      <div class="container">
        <div class="photo-grid reveal-stagger">
          <div class="photo-grid__item"><img src="assets/photos/women-art-2.webp" alt="" loading="lazy" /></div>
          <div class="photo-grid__item"><img src="assets/photos/cause-women.webp" alt="" loading="lazy" /></div>
          <div class="photo-grid__item"><img src="assets/photos/strip-1.webp" alt="" loading="lazy" /></div>
        </div>
      </div>
    </section>
    <section class="section section--primary">
      <div class="container cta-band reveal">
        <h2>Fund pads, training, and dignity</h2>
        <a class="btn btn--light" href="donate.html?cause=Women%20Empowerment%20And%20Hygiene" data-employee-link>Donate now</a>
      </div>
    </section>
  </main>
""",
    donate_cause="Women Empowerment",
)

pages["child-education.html"] = page(
    "Child Education",
    "Happy Bachapan, school kits, virtual adoptions, and workshops for underprivileged children.",
    "impact",
    """
  <main>
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/child-hero.webp,assets/photos/child-class.webp,assets/photos/child-kit.webp,assets/photos/child-activity.webp">
      <div class="container">
        <p class="eyebrow">Impact</p>
        <h1>Child Education</h1>
        <p>“Education is for improving the lives of others and for leaving your community and world better than you found it.”</p>
      </div>
    </section>
    <section class="section">
      <div class="container split">
        <div class="reveal">
          <h2>Happy Bachapan</h2>
          <p>During lockdown we met children of migrant workers living on a construction site—no wages, no food, no gas. Thirty-two children in that chaul needed food, language, education, toilets, and childhood itself. Wings For Dreams stood with them through meals, festivals, and learning, wherever families migrate.</p>
          <a class="btn btn--primary" href="school-kit.html">Donate a school kit</a>
        </div>
        <div class="split__media reveal">
          <div class="media-carousel" data-carousel data-interval="4200">
            <div class="media-carousel__slides">
              <img src="assets/photos/child-class.webp" alt="Children in Happy Bachapan program" loading="lazy" />
              <img src="assets/photos/child-kit.webp" alt="" loading="lazy" />
              <img src="assets/photos/child-activity.webp" alt="" loading="lazy" />
            </div>
            <div class="media-carousel__dots" data-carousel-dots></div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--muted">
      <div class="container card-grid card-grid--3 reveal-stagger">
        <div class="program-item reveal"><h3>Virtual adoptions</h3><p>Supporting girl-child education and protection so opportunity is not lost to poverty or exploitation.</p></div>
        <div class="program-item reveal"><h3>Extracurricular workshops</h3><p>Drawing, painting, and creative sessions in slum areas—time and care that unlocks dreams.</p></div>
        <div class="program-item reveal"><h3>Educational kits</h3><p>Year-round kits for rural and slum children so girls and boys can pursue academics without financial barriers.</p></div>
      </div>
      <div class="container">
        <div class="photo-grid reveal-stagger">
          <div class="photo-grid__item"><img src="assets/photos/child-kit.webp" alt="" loading="lazy" /></div>
          <div class="photo-grid__item"><img src="assets/photos/child-activity.webp" alt="" loading="lazy" /></div>
          <div class="photo-grid__item"><img src="assets/photos/cause-child.webp" alt="" loading="lazy" /></div>
        </div>
        <div class="stack-sm reveal" style="margin-top:1.5rem">
          <a class="btn btn--primary" href="donate.html?cause=Child%20Education" data-employee-link>Donate for child education</a>
        </div>
      </div>
    </section>
  </main>
""",
    donate_cause="Child Education",
)

pages["environment.html"] = page(
    "Environment",
    "Tree plantation and cloth bag distribution for a greener Pune.",
    "impact",
    """
  <main>
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/env-hero.webp,assets/photos/csr-1.webp,assets/photos/csr-2.webp,assets/photos/strip-4.webp">
      <div class="container">
        <p class="eyebrow">Impact</p>
        <h1>Environment</h1>
        <p>“I don’t want to protect the environment—I want to create a world where the environment does not need protecting.”</p>
      </div>
    </section>
    <section class="section">
      <div class="container split">
        <div class="split__media split__media--green reveal">
          <div class="media-carousel" data-carousel data-interval="4200">
            <div class="media-carousel__slides">
              <img src="assets/photos/env-hero.webp" alt="Tree plantation drive" loading="lazy" />
              <img src="assets/photos/csr-1.webp" alt="" loading="lazy" />
              <img src="assets/photos/csr-2.webp" alt="" loading="lazy" />
            </div>
            <div class="media-carousel__dots" data-carousel-dots></div>
          </div>
        </div>
        <div class="reveal">
          <h2>Tree plantation</h2>
          <p>Planting trees removes carbon dioxide, releases oxygen, and strengthens biodiversity. Our drives improve green cover and community stewardship of shared land.</p>
          <div class="stack-sm cta-actions">
            <a class="btn btn--primary" href="csr.html">See CSR Mission 17,000 Trees</a>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--muted">
      <div class="container split split--reverse">
        <div class="reveal">
          <h2>Cloth bag distribution</h2>
          <p>We work to reduce plastic bags and increase cloth alternatives while supporting forest-based livelihoods and ecosystem services—carbon sequestration, water, biodiversity, fuel, and fodder.</p>
          <div class="stack-sm cta-actions">
            <a class="btn btn--primary" href="donate.html?cause=Environment" data-employee-link>Support cloth bag drives</a>
          </div>
        </div>
        <div class="split__media split__media--green reveal">
          <div class="media-carousel" data-carousel data-interval="4200">
            <div class="media-carousel__slides">
              <img src="assets/photos/csr-1.webp" alt="Community environment activity" loading="lazy" />
              <img src="assets/photos/env-hero.webp" alt="" loading="lazy" />
              <img src="assets/photos/strip-4.webp" alt="" loading="lazy" />
            </div>
            <div class="media-carousel__dots" data-carousel-dots></div>
          </div>
        </div>
      </div>
    </section>
  </main>
""",
    donate_cause="Environment",
)

pages["dog-feeding.html"] = page(
    "Dog Feeding",
    "Feed, rescue, and care for street dogs with Wings For Dreams.",
    "impact",
    """
  <main>
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/dogs-hero.webp,assets/photos/dogs-feed.webp,assets/photos/dogs-photo.webp,assets/photos/dogs-care.webp">
      <div class="container">
        <p class="eyebrow">Animal care</p>
        <h1>Dog Feeding &amp; Rescue</h1>
        <p>“The greatness of a nation and its moral progress can be judged by the way its animals are treated.”</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section__head reveal">
          <h2>Support our mission to feed and care for street dogs</h2>
          <p>Street dogs face hunger, injury, and disease every day. Your support funds meals, veterinary care, and safe recovery.</p>
        </div>
        <div class="photo-grid reveal-stagger">
          <div class="photo-grid__item photo-grid__item--tall"><img src="assets/photos/dogs-feed.webp" alt="Feeding street dogs" loading="lazy" /></div>
          <div class="photo-grid__item photo-grid__item--tall"><img src="assets/photos/dogs-photo.webp" alt="Dog care activity" loading="lazy" /></div>
          <div class="photo-grid__item photo-grid__item--tall"><img src="assets/photos/dogs-care.webp" alt="Rescued dog" loading="lazy" /></div>
        </div>
        <div class="card-grid card-grid--3 reveal-stagger">
          <div class="program-item reveal"><h3>Feeding</h3><p>Daily meals reduce hunger-driven aggression and give street dogs a chance at healthier lives.</p></div>
          <div class="program-item reveal"><h3>Rescue</h3><p>Medical treatment for injured animals—more than 52 dogs rescued by the Wings For Dreams team so far.</p></div>
          <div class="program-item reveal"><h3>Care</h3><p>Skin conditions and infections are common outdoors; we connect dogs to veterinary diagnosis and treatment.</p></div>
        </div>
        <div class="stack-sm reveal">
          <a class="btn btn--primary" href="donate.html?cause=Animal%20Care" data-employee-link>Donate for animal care</a>
        </div>
      </div>
    </section>
  </main>
""",
    donate_cause="Animal Care",
)

pages["csr.html"] = page(
    "CSR",
    "Corporate Social Responsibility partnerships including Mission 17,000 Trees in Pune.",
    "csr",
    """
  <main>
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/csr-1.webp,assets/photos/csr-2.webp,assets/photos/env-hero.webp,assets/photos/hero-community-2.webp">
      <div class="container">
        <p class="eyebrow">CSR</p>
        <h1>Corporate Social Responsibility</h1>
        <p>Partnering with Wings For Dreams to foster a sustainable future—from Pune outward.</p>
      </div>
    </section>
    <section class="section">
      <div class="container program-list">
        <article class="program-item reveal"><h3>Women empowerment</h3><p>Sanitary pads plants, free napkins, rural employment, and hygiene awareness campaigns.</p></article>
        <article class="program-item reveal"><h3>Environment</h3><p>Tree planting for biodiversity, oxygen, and community green cover.</p></article>
        <article class="program-item reveal"><h3>Child education</h3><p>Moving beyond bookish knowledge to habits, skills, and attitudes that help children thrive despite poverty and stress.</p></article>
        <article class="program-item reveal"><h3>Animals</h3><p>Food, water, and medical care for street dogs who struggle to survive each day.</p></article>
        <article class="program-item reveal"><h3>Road safety</h3><p>Awareness against a backdrop of rising accidents—one serious injury every minute nationally.</p></article>
        <article class="program-item reveal"><h3>Spread happiness</h3><p>Festival surplus sweets redistributed to people in need instead of waste.</p></article>
      </div>
    </section>
    <section class="section section--muted">
      <div class="container split">
        <div class="reveal">
          <p class="eyebrow">Latest project</p>
          <h2>Mission 17,000 Trees</h2>
          <p>In 2021, Impact for Change Foundation funding supported Mission 17,000 Trees at Holkarwadi, Pune. From November 2021 to February 2022, volunteers planted nearly 17,000 trees across 5 acres—including Terminalia bellirica, Bauhinia variegata, neem, tamarind, sacred fig, and more.</p>
          <a class="btn btn--primary" href="contact.html">Talk CSR partnership</a>
        </div>
        <div class="split__media split__media--green reveal">
          <div class="media-carousel" data-carousel data-interval="4200">
            <div class="media-carousel__slides">
              <img src="assets/photos/csr-2.webp" alt="Mission 17,000 Trees CSR plantation" loading="lazy" />
              <img src="assets/photos/csr-1.webp" alt="" loading="lazy" />
              <img src="assets/photos/env-hero.webp" alt="" loading="lazy" />
            </div>
            <div class="media-carousel__dots" data-carousel-dots></div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="photo-grid reveal-stagger">
          <div class="photo-grid__item"><img src="assets/photos/env-hero.webp" alt="" loading="lazy" /></div>
          <div class="photo-grid__item"><img src="assets/photos/csr-1.webp" alt="" loading="lazy" /></div>
          <div class="photo-grid__item"><img src="assets/photos/strip-4.webp" alt="" loading="lazy" /></div>
        </div>
      </div>
    </section>
  </main>
""",
)

DONATE_DESCRIPTION = (
    "Donate to Wings For Dreams \u2014 enter the donation details and scan the "
    "auto-generated UPI QR code to pay."
)

DONATE_BODY = """
  <main class="donate-main">
    <section class="page-hero page-hero--compact page-hero--donate">
      <div class="container">
        <p class="eyebrow">Donate</p>
        <h1>Give a little. Help a lot.</h1>
        <p>Fill in the donation details and scan the QR code to pay.</p>
      </div>
    </section>
    <section class="section section--donate">
      <div class="container panel-narrow">
        <div class="employee-share" data-employee-share hidden>
          <p class="form-label-title">Your public donation link</p>
          <p class="note">Share this with donors — they only see the normal donate form.</p>
          <div class="employee-share__row">
            <input type="text" readonly data-employee-share-url aria-label="Your public donation link" />
            <button type="button" class="btn btn--ghost btn--sm" data-employee-share-copy>Copy</button>
          </div>
        </div>

        <form class="donate-panel form give-form" data-upi-form data-donate-form novalidate>
          <input type="hidden" name="employeeId" data-employee-id value="" />

          <div class="gateway-banner" data-gateway-banner hidden></div>

          <section class="give-section">
            <h2 class="give-section__title">How much would you like to donate today?</h2>
            <p class="give-section__desc">All donations directly impact our organization and help us further our mission.</p>
            <div class="amount-field" data-amount-field>
              <span class="amount-field__currency" aria-hidden="true">₹</span>
              <input
                type="text"
                inputmode="numeric"
                autocomplete="off"
                placeholder="1"
                aria-label="Donation amount in rupees"
                name="give-amount"
                data-custom-amount
                value="1"
              />
            </div>
            <p class="give-custom-amount-text">Custom Amount</p>
            <div class="amount-grid amount-grid--simple" data-amount-group>
              <button type="button" class="amount-option" data-amount="100">₹100</button>
              <button type="button" class="amount-option" data-amount="500">₹500</button>
              <button type="button" class="amount-option" data-amount="1000">₹1,000</button>
              <button type="button" class="amount-option" data-amount="2000">₹2,000</button>
              <button type="button" class="amount-option" data-amount="5000">₹5,000</button>
            </div>
            <p class="give-amount-min">Pick a suggested amount or type your own. Minimum ₹1.</p>
          </section>

          <section class="give-section">
            <h2 class="give-section__title">Who’s giving today?</h2>
            <p class="give-section__desc">We’ll never share this information with anyone.</p>
            <div class="form-row">
              <label class="form-field">
                <span class="form-field__label">First Name <span class="req" aria-hidden="true">*</span><span class="sr-only">required</span></span>
                <input type="text" name="give_first" autocomplete="given-name" placeholder="First Name" data-donor-first maxlength="150" required />
              </label>
              <label class="form-field">
                <span class="form-field__label">Last Name</span>
                <input type="text" name="give_last" autocomplete="family-name" placeholder="Last Name" data-donor-last maxlength="150" />
              </label>
            </div>
            <label class="form-field">
              <span class="form-field__label">Email Address <span class="req" aria-hidden="true">*</span><span class="sr-only">required</span></span>
              <input type="email" name="give_email" autocomplete="email" placeholder="Email Address" data-donor-email maxlength="254" required />
            </label>
            <label class="form-field">
              <span class="form-field__label">Phone</span>
              <input type="tel" name="phone" placeholder="Phone" data-donor-phone autocomplete="tel" inputmode="tel" maxlength="18" />
            </label>
            <label class="form-field">
              <span class="form-field__label">Cause <span class="req" aria-hidden="true">*</span><span class="sr-only">required</span></span>
              <select name="cause" data-cause-select required>
                <option value="" disabled selected>- select -</option>
                <option value="Women Empowerment">Women Empowerment</option>
                <option value="Child Education">Child Education</option>
                <option value="Animal Care">Animal Care</option>
                <option value="Environment">Environment</option>
              </select>
            </label>
            <label class="form-field">
              <span class="form-field__label">PAN No.</span>
              <input type="text" name="pan_no" placeholder="PAN No." data-donor-pan autocapitalize="characters" spellcheck="false" maxlength="10" />
            </label>
            <label class="form-field">
              <span class="form-field__label">Aadhar</span>
              <input type="text" name="aadhar" placeholder="Aadhar" data-donor-aadhar inputmode="numeric" maxlength="14" />
            </label>
            <label class="form-field">
              <span class="form-field__label">City</span>
              <input type="text" name="city" placeholder="City" data-donor-city maxlength="120" />
            </label>
            <label class="form-field">
              <span class="form-field__label">Payment Type <span class="req" aria-hidden="true">*</span><span class="sr-only">required</span></span>
              <select name="payment_type" data-payment-type required>
                <option value="" disabled selected>- select -</option>
                <option value="UPI">UPI</option>
                <option value="Swipe">Swipe</option>
                <option value="Cash">Cash</option>
                <option value="NEFT/RTGS">NEFT/RTGS</option>
                <option value="Cheque">Cheque</option>
              </select>
            </label>
            <label class="form-field">
              <span class="form-field__label"><span data-payment-id-label>Payment Id</span> <span class="req" aria-hidden="true">*</span><span class="sr-only">required</span></span>
              <input type="text" name="payment_id" placeholder="Payment Id" data-payment-id maxlength="60" required />
            </label>
            <label class="form-field">
              <span class="form-field__label">Fundraiser <span class="req" aria-hidden="true">*</span><span class="sr-only">required</span></span>
              <input type="text" name="fundraiser" placeholder="Fundraiser" data-fundraiser maxlength="150" required />
            </label>
          </section>

          <section class="give-section">
            <h2 class="give-section__title">How would you like to pay today?</h2>
            <p class="give-section__desc">This donation is a secure and encrypted payment.</p>
            <div class="upi-result is-visible" data-upi-result>
              <p class="form-label-title upi-result__step" data-upi-title>Scan this QR code to pay</p>
              <p class="upi-result__amount" data-upi-amount-label>₹1</p>
              <p class="upi-result__meta" data-upi-cause-label>Donation</p>
              <div class="upi-result__qrwrap">
                <div class="upi-result__qr" data-upi-qr></div>
                <span class="upi-result__lockbadge" aria-hidden="true">Locked</span>
              </div>
              <p class="upi-result__lock" data-upi-lock role="status" hidden></p>
              <p class="upi-result__vpa" data-upi-vpa></p>
              <div class="upi-result__actions">
                <a class="btn btn--primary btn--pay" data-upi-launch href="#">Pay with UPI</a>
                <button type="button" class="btn btn--ghost btn--sm" data-upi-copy>Copy link</button>
              </div>
              <p class="upi-hint">The QR code updates automatically with the amount and cause above. On phone, tap Pay. On desktop, scan the QR, then enter the Payment Id.</p>
            </div>
          </section>

          <section class="give-section give-section--total">
            <p class="give-total">
              <span class="give-total__label">Donation Total:</span>
              <strong class="give-total__value" data-donate-total>₹1</strong>
            </p>
            <button type="submit" class="btn btn--primary btn--pay give-submit" data-donate-submit>Donate Now</button>
            <p class="note" data-form-note role="status" aria-live="polite"></p>
          </section>

          <div class="payment-success" data-payment-success hidden>
            <p class="payment-success__title">Thank you for your kindness</p>
            <p class="payment-success__meta" data-payment-success-meta></p>
            <a class="btn btn--primary" data-whatsapp-utr href="#" target="_blank" rel="noopener">Share UTR on WhatsApp</a>
            <div class="payment-success__wa-qr" data-whatsapp-qr hidden>
              <div class="payment-success__wa-qr-frame" data-whatsapp-qr-mount aria-hidden="true"></div>
              <p class="payment-success__wa-qr-hint">On desktop? Scan with your phone’s WhatsApp</p>
            </div>
          </div>
        </form>
        <p class="donate-bank-link"><a href="banks.html">Prefer bank transfer? See account details</a></p>
      </div>
    </section>
  </main>

  <div class="pay-sticky" data-pay-sticky hidden>
    <div class="pay-sticky__meta">
      <strong data-sticky-amount>₹1</strong>
      <span data-sticky-cause>Donation</span>
    </div>
    <a class="btn btn--primary" data-sticky-pay href="#">Pay with UPI</a>
  </div>
"""


def slugify(name: str) -> str:
    return "-".join(name.lower().split())


def with_site_base(html: str, base: str) -> str:
    """Point relative asset URLs at the site root for nested pages."""
    return html.replace(
        '<meta name="viewport" content="width=device-width, initial-scale=1" />',
        '<meta name="viewport" content="width=device-width, initial-scale=1" />\n'
        f'  <base href="{base}" />',
    )


def donate_body(fundraiser: str = "") -> str:
    """Donate body, optionally bound to one fundraiser like the live /donations/amir/ page."""
    if not fundraiser:
        return DONATE_BODY
    # data-autofill="1" marks the name as ours, so a signed-in staff member's own
    # name replaces it while anything the donor types is left alone.
    return DONATE_BODY.replace(
        'placeholder="Fundraiser" data-fundraiser',
        f'placeholder="Fundraiser" value="{fundraiser}" data-autofill="1" data-fundraiser',
    ).replace(
        '<p class="eyebrow">Donate</p>',
        f'<p class="eyebrow">Donate \u00b7 {fundraiser}</p>',
    )


pages["donate.html"] = page("Donate", DONATE_DESCRIPTION, "donate", donate_body())

# One donation page per fundraiser, mirroring the live /donations/<name>/ links.
FUNDRAISERS = ["Amir", "Priya Sharma", "Arjun Mehta", "Neha Patil"]

for person in FUNDRAISERS:
    pages[f"donations/{slugify(person)}/index.html"] = with_site_base(
        page(
            person,
            f"Donate to Wings For Dreams through {person} \u2014 scan the UPI QR code to pay.",
            "donate",
            donate_body(person),
            noindex=True,
        ),
        "../../",
    )

pages["school-kit.html"] = page(
    "Donate School Kit",
    "Sponsor a school kit for ₹700 or ₹2,000. Wings For Dreams tops up each kit.",
    "school",
    """
  <main>
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/child-kit.webp,assets/photos/child-activity.webp,assets/photos/child-class.webp,assets/photos/child-hero.webp">
      <div class="container">
        <p class="eyebrow">One Kit, One Smile</p>
        <h1>Donate school kits today</h1>
        <p>With ₹700 or ₹2,000 you help send a child to school. Our NGO adds ₹250 or ₹200 so every kit is complete.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="trust-strip trust-strip--spaced reveal">
          <span class="trust-pill">12A &amp; 80G</span>
          <span class="trust-pill">10,000+ children</span>
          <span class="trust-pill">Photo feedback</span>
          <span class="trust-pill">100% transparent</span>
        </div>
        <div class="photo-frame reveal" style="min-height:260px;margin-bottom:1.75rem">
          <div class="media-carousel" data-carousel data-interval="4000">
            <div class="media-carousel__slides">
              <img src="assets/photos/child-activity.webp" alt="Children receiving school support" loading="lazy" />
              <img src="assets/photos/child-kit.webp" alt="" loading="lazy" />
              <img src="assets/photos/child-class.webp" alt="" loading="lazy" />
              <img src="assets/photos/child-hero.webp" alt="" loading="lazy" />
            </div>
            <div class="media-carousel__dots" data-carousel-dots></div>
          </div>
        </div>
        <div class="card-grid card-grid--2 kit-grid reveal-stagger" data-kit-group>
          <div class="kit-card kit-card--featured reveal is-selected">
            <p class="eyebrow">Donors’ best choice</p>
            <h2>Full kit</h2>
            <div class="kit-card__price">₹2,000</div>
            <p class="kit-card__meta">Market value ~₹2,200 · NGO adds ₹200</p>
            <p class="kit-card__copy">You’ll get a photo and note from the child when we can share one—proof with a smile.</p>
            <a class="btn btn--primary" href="donate.html?amount=2000&amp;cause=Child%20Education" data-employee-link>Donate full kit</a>
          </div>
          <div class="kit-card reveal">
            <p class="eyebrow">Half kit</p>
            <h2>Essential kit</h2>
            <div class="kit-card__price">₹700</div>
            <p class="kit-card__meta">Market value ~₹950 · NGO adds ₹250</p>
            <p class="kit-card__copy">A lighter gift that still fills a school bag—and a child’s week.</p>
            <a class="btn btn--ghost" href="donate.html?amount=700&amp;cause=Child%20Education" data-employee-link>Donate half kit</a>
          </div>
        </div>
      </div>
    </section>
  </main>
""",
    donate_cause="Child Education",
)

pages["contact.html"] = page(
    "Contact Us",
    "Contact Wings For Dreams in Pune — Ashoka Mall, Bund Garden Road.",
    "contact",
    """
  <main>
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">Contact</p>
        <h1>We would love to hear from you</h1>
        <p>Reach the team for donations, volunteering, CSR, or general questions.</p>
      </div>
    </section>
    <section class="section">
      <div class="container contact-grid">
        <div class="reveal">
          <div class="contact-detail"><h3>Address</h3><p>G4 Ashoka Mall, Bund Garden Road, Pune</p></div>
          <div class="contact-detail"><h3>Phone</h3><p><a href="tel:+918698637796">+91 8698 637 796</a></p></div>
          <div class="contact-detail"><h3>Email</h3><p><a href="mailto:info@wingsfordreams.org">info@wingsfordreams.org</a></p></div>
          <div class="contact-detail"><h3>Also see</h3><p><a href="career.html">Careers</a> · <a href="banks.html">Bank details</a></p></div>
        </div>
        <form class="donate-panel form reveal" data-mock>
          <label>Name<input type="text" placeholder="Your name" /></label>
          <label>Email<input type="email" placeholder="you@example.com" /></label>
          <label>Message<textarea placeholder="How can we help?"></textarea></label>
          <button class="btn btn--primary" type="submit">Send message</button>
          <p class="note" data-form-note>Prototype form — messages are not sent from this demo.</p>
        </form>
      </div>
    </section>
  </main>
""",
)

pages["banks.html"] = page(
    "Bank Details",
    "ICICI and HDFC bank account details for Wings For Dreams donations.",
    "contact",
    """
  <main>
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">Donate by transfer</p>
        <h1>Bank details</h1>
        <p>Account name on both accounts: WINGS FOR DREAMS · Branch: Bund Garden</p>
      </div>
    </section>
    <section class="section">
      <div class="container card-grid card-grid--2">
        <div class="bank-card">
          <h3>ICICI Bank</h3>
          <dl>
            <div><dt>Account name</dt><dd>WINGS FOR DREAMS</dd></div>
            <div><dt>Account number</dt><dd>000501065406 <button type="button" class="copy-btn" data-copy="000501065406">Copy</button></dd></div>
            <div><dt>IFSC</dt><dd>ICIC0000005 <button type="button" class="copy-btn" data-copy="ICIC0000005">Copy</button></dd></div>
            <div><dt>Branch</dt><dd>Bund Garden</dd></div>
          </dl>
        </div>
        <div class="bank-card">
          <h3>HDFC Bank</h3>
          <dl>
            <div><dt>Account name</dt><dd>WINGS FOR DREAMS</dd></div>
            <div><dt>Account number</dt><dd>50100349745342 <button type="button" class="copy-btn" data-copy="50100349745342">Copy</button></dd></div>
            <div><dt>IFSC</dt><dd>HDFC0001210 <button type="button" class="copy-btn" data-copy="HDFC0001210">Copy</button></dd></div>
            <div><dt>Branch</dt><dd>Bund Garden</dd></div>
          </dl>
        </div>
      </div>
      <div class="container stack-sm">
        <p class="note">Please email the transfer reference to info@wingsfordreams.org for an 80G receipt.</p>
      </div>
    </section>
  </main>
""",
    no_motion=True,
)

# Private staff login + admin live under STAFF_DIR. Bookmark the folder URL;
# nothing on the public site links here, and robots.txt must not name the path.
pages[f"{STAFF_DIR}/index.html"] = with_site_base(
    page(
        "Staff login",
        "Staff sign-in for Wings For Dreams donation tracking.",
        "login",
        f"""
  <main>
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">Staff</p>
        <h1>Staff login</h1>
        <p>Sign in with your employee ID to get your public donation link for donors.</p>
      </div>
    </section>
    <section class="section">
      <div class="container panel-narrow">
        <form class="donate-panel form" data-employee-login>
          <label class="form-field">Employee ID
            <input type="text" name="employeeId" placeholder="e.g. E001" data-login-id autocomplete="username" required />
          </label>
          <button class="btn btn--primary" type="submit">Log in</button>
          <p class="note" data-login-note>Demo IDs: E001, E002, E003</p>
        </form>

        <div class="donate-panel form" data-staff-home hidden>
          <p class="form-label-title" data-staff-home-greeting>Signed in</p>
          <p class="note">Copy your public link and share it with donors. They will not see staff tools.</p>
          <div class="employee-share" data-employee-share>
            <div class="employee-share__row">
              <input type="text" readonly data-employee-share-url aria-label="Your public donation link" />
              <button type="button" class="btn btn--ghost btn--sm" data-employee-share-copy>Copy</button>
            </div>
          </div>
          <div class="stack-sm" style="display:flex;flex-wrap:wrap;gap:0.65rem;margin-top:1rem">
            <a class="btn btn--primary" data-staff-open-page href="#">Open my donation page</a>
            <a class="btn btn--ghost" href="{STAFF_DIR}/admin.html">Admin CSV</a>
            <button type="button" class="btn btn--ghost" data-staff-logout>Log out</button>
          </div>
        </div>

        <div class="employee-demo-list reveal" data-staff-demo>
          <p class="form-label-title">Demo employees</p>
          <ul>
            <li><strong>E001</strong> — Priya Sharma</li>
            <li><strong>E002</strong> — Arjun Mehta</li>
            <li><strong>E003</strong> — Neha Patil</li>
          </ul>
          <p class="note stack-sm"><a href="{STAFF_DIR}/admin.html">Admin: download donations CSV →</a></p>
        </div>
      </div>
    </section>
  </main>
""",
        noindex=True,
    ),
    "../",
)

pages[f"{STAFF_DIR}/admin.html"] = with_site_base(
    page(
        "Admin · Donations",
        "Download recorded donations as CSV anytime.",
        "login",
        """
  <main>
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">Admin</p>
        <h1>Donation records</h1>
        <p>Payments marked done are stored here. Download the CSV whenever you need it.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="admin-toolbar reveal">
          <p class="note" data-admin-count>No donations recorded yet.</p>
          <div class="admin-toolbar__actions">
            <button type="button" class="btn btn--primary" data-admin-download>Download CSV</button>
            <button type="button" class="btn btn--ghost" data-admin-clear>Clear records</button>
          </div>
        </div>
        <div class="admin-table-wrap reveal">
          <table class="admin-table" data-admin-table>
            <thead>
              <tr>
                <th>Time (IST)</th>
                <th>Transaction ID</th>
                <th>Gateway Txn</th>
                <th>UTR</th>
                <th>Donor</th>
                <th>Email</th>
                <th>Phone</th>
                <th>PAN</th>
                <th>Aadhar</th>
                <th>City</th>
                <th>Pin</th>
                <th>Cause</th>
                <th>Amount</th>
                <th>Payment Type</th>
                <th>Payment Id</th>
                <th>Fundraiser</th>
                <th>Employee ID</th>
              </tr>
            </thead>
            <tbody data-admin-rows>
              <tr><td colspan="17">No records yet. Record a donation on Donate first.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
""",
        noindex=True,
    ),
    "../",
)

pages["career.html"] = page(
    "Career",
    "Volunteer and career opportunities with Wings For Dreams.",
    "contact",
    """
  <main>
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">Career</p>
        <h1>Join the mission</h1>
        <p>We are a student-based nonprofit. Volunteers, interns, and partners help programs reach further.</p>
      </div>
    </section>
    <section class="section">
      <div class="container panel-narrow">
        <div class="card-grid card-grid--2 stack-md">
          <div class="program-item reveal"><h3>Volunteer</h3><p>Field support for education drives, feeding, plantation, and events.</p></div>
          <div class="program-item reveal"><h3>Internship</h3><p>Hands-on nonprofit experience across programs and community outreach.</p></div>
        </div>
        <form class="donate-panel form reveal" data-mock>
          <label>Full name<input type="text" /></label>
          <label>Email<input type="email" /></label>
          <label>Interest
            <select>
              <option>Volunteer</option>
              <option>Internship</option>
              <option>Full-time / partnership</option>
            </select>
          </label>
          <label>Tell us about yourself<textarea></textarea></label>
          <button class="btn btn--primary" type="submit">Submit interest</button>
          <p class="note" data-form-note>Prototype only — email info@wingsfordreams.org to apply for real.</p>
        </form>
      </div>
    </section>
  </main>
""",
)

# Extra noindex keys (fundraiser clones and the staff folder already pass noindex=True).
NOINDEX_PAGES = set()

HERO_PRELOAD = (
    '  <link rel="preload" as="image" href="assets/photos/hero-community-1.webp"'
    ' fetchpriority="high" />\n'
)

ORG_JSONLD = """  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "Wings For Dreams",
    "url": "%(site)s/",
    "logo": "%(site)s/assets/icon-512.png",
    "image": "%(site)s/assets/social-card.jpg",
    "description": "Pune-based nonprofit working on child education, women's empowerment, animal care and the environment.",
    "foundingDate": "2019-03-29",
    "email": "info@wingsfordreams.org",
    "telephone": "+91-8698-637796",
    "taxID": "AAATW5579L",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ashoka Mall, G4, Bund Garden Rd",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.facebook.com/wingsfordreamss/",
      "https://www.instagram.com/wingsfordreamss",
      "https://www.youtube.com/@wingsfordreamss"
    ]
  }
  </script>
""" % {"site": SITE_URL}


def canonical_for(name: str) -> str:
    """Absolute URL for a generated file, with directory indexes collapsed."""
    if name == "index.html":
        return f"{SITE_URL}/"
    if name.endswith("/index.html"):
        return f"{SITE_URL}/{name[: -len('index.html')]}"
    return f"{SITE_URL}/{name}"


indexable = []

for name, html in pages.items():
    html = html.replace("__PAGE_URL__", canonical_for(name))
    if name in NOINDEX_PAGES and 'name="robots"' not in html:
        html = html.replace(
            '<link rel="canonical"',
            '<meta name="robots" content="noindex, follow" />\n  <link rel="canonical"',
            1,
        )
    if name == "index.html":
        # The first hero slide is the largest paint on the home page.
        html = html.replace("</head>", f"{HERO_PRELOAD}{ORG_JSONLD}</head>", 1)
    if 'name="robots"' not in html:
        indexable.append(name)
    target = ROOT / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html, encoding="utf-8")
    print("wrote", name)

MANIFEST = """{
  "name": "Wings For Dreams",
  "short_name": "Wings",
  "description": "Donate to Wings For Dreams — child education, women's empowerment, animal care and the environment in Pune.",
  "start_url": "./index.html",
  "display": "browser",
  "background_color": "#ffffff",
  "theme_color": "#ae0d36",
  "icons": [
    { "src": "assets/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "assets/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
"""
(ROOT / "site.webmanifest").write_text(MANIFEST, encoding="utf-8")

# Do not Disallow the staff folder here — robots.txt is public and would
# advertise the unguessable path. Staff pages are already noindex.
# Note: on a github.io project site only the domain-root robots.txt is honoured;
# this file becomes authoritative once the site runs on its own domain.
(ROOT / "robots.txt").write_text(
    f"User-agent: *\nAllow: /\n\nSitemap: {SITE_URL}/sitemap.xml\n",
    encoding="utf-8",
)

# Drop the old public staff entry points so they stop shipping on Pages.
for obsolete in ("login.html", "admin.html"):
    stale = ROOT / obsolete
    if stale.exists():
        stale.unlink()
        print("removed", obsolete)

urls = "\n".join(
    f"  <url><loc>{canonical_for(name)}</loc></url>" for name in sorted(indexable)
)
(ROOT / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    f"{urls}\n</urlset>\n",
    encoding="utf-8",
)

print("done", len(pages), "pages,", len(indexable), "in sitemap")
