#!/usr/bin/env python3
"""Generate Wings For Dreams static HTML prototype pages."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title} | Wings For Dreams</title>
  <meta name="description" content="{description}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Aoboshi+One&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/tokens.css" />
  <link rel="stylesheet" href="css/base.css" />
  <link rel="stylesheet" href="css/components.css" />
  <link rel="stylesheet" href="css/pages.css" />
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js" defer></script>
  <script src="js/upi-config.js" defer></script>
  <script src="js/employees.js" defer></script>
  <script src="js/festivals.js" defer></script>
  <script src="js/main.js" defer></script>
</head>
<body>
  <div class="scroll-progress" aria-hidden="true"></div>
  <div class="festive-bar" data-festive-bar hidden>
    <span data-festive-label>Happy festival</span>
    <button type="button" class="festive-bar__demo" data-festive-demo title="Demo emoji bomb">🎉 Demo</button>
  </div>
  <a class="float-donate" href="{donate_href}" data-employee-link><span class="float-donate__pulse" aria-hidden="true"></span> Donate</a>
"""

def header(active: str, donate_href: str = "donate.html") -> str:
    def act(name: str) -> str:
        return ' is-active' if active == name else ''

    return f"""  <header class="site-header">
    <div class="container container--wide site-header__inner">
      <a class="brand" href="index.html" aria-label="Wings For Dreams home">
        <img class="brand__logo" src="assets/logo.png" alt="" width="72" height="52" onerror="this.style.display='none'" />
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
            <li class="nav__item"><a class="nav__link{act('login')}" href="login.html" data-login-nav>Employee</a></li>
          </ul>
          <div class="nav__actions">
            <button type="button" class="festive-demo-btn" data-festive-demo title="Demo festival emoji bomb">🎉</button>
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
            <li><a href="donate.html">Donate</a></li>
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
        <span>© Wings For Dreams · Prototype redesign</span>
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


def page(title, description, active, body, donate_cause=None):
    donate_href = donate_url(donate_cause)
    return (
        HEAD.format(title=title, description=description, donate_href=donate_href)
        + header(active, donate_href=donate_href)
        + body
        + FOOTER
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
        <div class="hero__slide is-active" style="background-image:url('assets/photos/hero-community-1.jpeg')"></div>
        <div class="hero__slide" style="background-image:url('assets/photos/hero-community-2.jpeg')"></div>
        <div class="hero__slide" style="background-image:url('assets/photos/hero-community-3.jpeg')"></div>
        <div class="hero__slide" style="background-image:url('assets/photos/child-class.jpeg')"></div>
        <div class="hero__slide" style="background-image:url('assets/photos/women-hero.jpeg')"></div>
      </div>
      <div class="container container--wide hero__content">
        <div class="hero__copy">
          <div class="friendly-chip reveal"><span class="friendly-chip__dot"></span> Open hearts in Pune since 2019</div>
          <p class="hero__brand reveal">Wings For Dreams</p>
          <h1 class="reveal">A safe and joyful place for your lovely children</h1>
          <p class="hero__lede reveal">We walk beside families with education, women’s empowerment, animal care, and greener streets—kindness you can feel.</p>
          <div class="hero__actions reveal">
            <a class="btn btn--light" href="donate.html">Give with love</a>
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
              <img src="assets/photos/hero-community-2.jpeg" alt="Wings For Dreams community gathering" loading="lazy" />
              <img src="assets/photos/child-activity.jpeg" alt="" loading="lazy" />
              <img src="assets/photos/dogs-feed.jpeg" alt="" loading="lazy" />
              <img src="assets/photos/env-hero.jpg" alt="" loading="lazy" />
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
            <div class="cause-card__media"><img src="assets/photos/women-hero.jpeg" alt="" loading="lazy" /></div>
            <div class="cause-card__body">
              <h3>Women Empowerment</h3>
              <p>Pads, livelihood, awareness, and self-defense for rural women and girls.</p>
              <span class="cause-card__link">Learn more <span>→</span></span>
            </div>
          </a>
          <a class="cause-card reveal" href="child-education.html">
            <div class="cause-card__media"><img src="assets/photos/child-hero.jpeg" alt="" loading="lazy" /></div>
            <div class="cause-card__body">
              <h3>Child Education</h3>
              <p>Happy Bachapan, school kits, and creative workshops that keep childhood bright.</p>
              <span class="cause-card__link">Learn more <span>→</span></span>
            </div>
          </a>
          <a class="cause-card reveal" href="dog-feeding.html">
            <div class="cause-card__media"><img src="assets/photos/dogs-hero.jpeg" alt="" loading="lazy" /></div>
            <div class="cause-card__body">
              <h3>Animal Care</h3>
              <p>Daily meals, rescue, and veterinary care for street dogs who need a friend.</p>
              <span class="cause-card__link">Learn more <span>→</span></span>
            </div>
          </a>
          <a class="cause-card reveal" href="environment.html">
            <div class="cause-card__media"><img src="assets/photos/env-hero.jpg" alt="" loading="lazy" /></div>
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
            <div class="impact-panel is-active" data-panel="bachapan" data-visual="assets/photos/child-class.jpeg">
              <h3>Standing with migrant children</h3>
              <p>We met children on a construction site—hungry for food, language, and dignity. Happy Bachapan brings meals, festivals, and learning so childhood isn’t lost to migration.</p>
              <a class="btn btn--primary btn--sm" href="child-education.html">See the program</a>
            </div>
            <div class="impact-panel" data-panel="women" data-visual="assets/photos/women-hero.jpeg">
              <h3>Dignity starts with basics</h3>
              <p>Rural pads plants, free napkins, hygiene awareness, and free self-defense training—practical care that helps women and girls move through the world safer and stronger.</p>
              <a class="btn btn--primary btn--sm" href="women-empowerment.html">Meet the work</a>
            </div>
            <div class="impact-panel" data-panel="trees" data-visual="assets/photos/env-hero.jpg">
              <h3>Mission 17,000 Trees</h3>
              <p>At Holkarwadi, volunteers planted nearly 17,000 trees across 5 acres—neem, tamarind, sacred fig, and more—turning CSR into living shade.</p>
              <a class="btn btn--primary btn--sm" href="csr.html">CSR partnerships</a>
            </div>
            <div class="impact-panel" data-panel="dogs" data-visual="assets/photos/dogs-feed.jpeg">
              <h3>Feed. Rescue. Heal.</h3>
              <p>Street dogs face hunger and injury daily. Together we’ve rescued 52+ dogs and keep meals and vet care moving through the community.</p>
              <a class="btn btn--primary btn--sm" href="dog-feeding.html">Help an animal</a>
            </div>
          </div>
          <div class="impact-spotlight__visual">
            <img src="assets/photos/child-class.jpeg" alt="" data-impact-visual loading="lazy" />
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
            <a class="btn btn--primary" href="donate.html">Start a donation</a>
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
          <a class="btn btn--light" href="donate.html">Donate</a>
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
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/hero-community-3.jpeg,assets/photos/hero-community-1.jpeg,assets/photos/child-hero.jpeg,assets/photos/women-hero.jpeg">
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
          <img src="assets/photos/about-portrait.png" alt="Wings For Dreams" loading="lazy" />
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
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/hero-community-2.jpeg,assets/photos/env-hero.jpg,assets/photos/dogs-hero.jpeg,assets/photos/child-class.jpeg">
      <div class="container">
        <p class="eyebrow">Impact</p>
        <h1>Where your support becomes change</h1>
        <p>Four cause areas. One mission—dignity for people, animals, and the planet we share.</p>
      </div>
    </section>
    <section class="section">
      <div class="container card-grid card-grid--2 reveal-stagger">
        <a class="cause-card reveal" href="women-empowerment.html">
          <div class="cause-card__media"><img src="assets/photos/women-hero.jpeg" alt="" loading="lazy" /></div>
          <div class="cause-card__body">
            <h3>Women Empowerment</h3>
            <p>Sanitary pads plants, free napkins, awareness, and self-defense training.</p>
            <span class="cause-card__link">Open →</span>
          </div>
        </a>
        <a class="cause-card reveal" href="child-education.html">
          <div class="cause-card__media"><img src="assets/photos/child-hero.jpeg" alt="" loading="lazy" /></div>
          <div class="cause-card__body">
            <h3>Child Education</h3>
            <p>Happy Bachapan, educational kits, and extracurricular workshops in slums.</p>
            <span class="cause-card__link">Open →</span>
          </div>
        </a>
        <a class="cause-card reveal" href="environment.html">
          <div class="cause-card__media"><img src="assets/photos/env-hero.jpg" alt="" loading="lazy" /></div>
          <div class="cause-card__body">
            <h3>Environment</h3>
            <p>Tree plantation and cloth-bag distribution to reduce plastic waste.</p>
            <span class="cause-card__link">Open →</span>
          </div>
        </a>
        <a class="cause-card reveal" href="dog-feeding.html">
          <div class="cause-card__media"><img src="assets/photos/dogs-hero.jpeg" alt="" loading="lazy" /></div>
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
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/women-hero.jpeg,assets/photos/women-art.png,assets/photos/cause-women.png,assets/photos/strip-1.png">
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
              <img src="assets/photos/women-art.png" alt="Women empowerment program" loading="lazy" />
              <img src="assets/photos/women-art-2.png" alt="" loading="lazy" />
              <img src="assets/photos/women-hero.jpeg" alt="" loading="lazy" />
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
          <div class="photo-grid__item"><img src="assets/photos/women-art-2.png" alt="" loading="lazy" /></div>
          <div class="photo-grid__item"><img src="assets/photos/cause-women.png" alt="" loading="lazy" /></div>
          <div class="photo-grid__item"><img src="assets/photos/strip-1.png" alt="" loading="lazy" /></div>
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
    donate_cause="Women Empowerment And Hygiene",
)

pages["child-education.html"] = page(
    "Child Education",
    "Happy Bachapan, school kits, virtual adoptions, and workshops for underprivileged children.",
    "impact",
    """
  <main>
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/child-hero.jpeg,assets/photos/child-class.jpeg,assets/photos/child-kit.jpeg,assets/photos/child-activity.jpeg">
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
              <img src="assets/photos/child-class.jpeg" alt="Children in Happy Bachapan program" loading="lazy" />
              <img src="assets/photos/child-kit.jpeg" alt="" loading="lazy" />
              <img src="assets/photos/child-activity.jpeg" alt="" loading="lazy" />
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
          <div class="photo-grid__item"><img src="assets/photos/child-kit.jpeg" alt="" loading="lazy" /></div>
          <div class="photo-grid__item"><img src="assets/photos/child-activity.jpeg" alt="" loading="lazy" /></div>
          <div class="photo-grid__item"><img src="assets/photos/cause-child.png" alt="" loading="lazy" /></div>
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
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/env-hero.jpg,assets/photos/csr-1.jpg,assets/photos/csr-2.jpg,assets/photos/strip-4.png">
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
              <img src="assets/photos/env-hero.jpg" alt="Tree plantation drive" loading="lazy" />
              <img src="assets/photos/csr-1.jpg" alt="" loading="lazy" />
              <img src="assets/photos/csr-2.jpg" alt="" loading="lazy" />
            </div>
            <div class="media-carousel__dots" data-carousel-dots></div>
          </div>
        </div>
        <div class="reveal">
          <h2>Tree plantation</h2>
          <p>Planting trees removes carbon dioxide, releases oxygen, and strengthens biodiversity. Our drives improve green cover and community stewardship of shared land.</p>
        </div>
      </div>
    </section>
    <section class="section section--muted">
      <div class="container split split--reverse">
        <div class="reveal">
          <h2>Cloth bag distribution</h2>
          <p>We work to reduce plastic bags and increase cloth alternatives while supporting forest-based livelihoods and ecosystem services—carbon sequestration, water, biodiversity, fuel, and fodder.</p>
          <a class="btn btn--primary" href="csr.html">See CSR Mission 17,000 Trees</a>
          <a class="btn btn--ghost" href="donate.html?cause=Emergency%20%26%20Volunteer%20Camp%20Support" data-employee-link style="margin-left:0.5rem">Donate for field support</a>
        </div>
        <div class="split__media split__media--green reveal">
          <div class="media-carousel" data-carousel data-interval="4200">
            <div class="media-carousel__slides">
              <img src="assets/photos/csr-1.jpg" alt="Community environment activity" loading="lazy" />
              <img src="assets/photos/env-hero.jpg" alt="" loading="lazy" />
              <img src="assets/photos/strip-4.png" alt="" loading="lazy" />
            </div>
            <div class="media-carousel__dots" data-carousel-dots></div>
          </div>
        </div>
      </div>
    </section>
  </main>
""",
    donate_cause="Emergency & Volunteer Camp Support",
)

pages["dog-feeding.html"] = page(
    "Dog Feeding",
    "Feed, rescue, and care for street dogs with Wings For Dreams.",
    "impact",
    """
  <main>
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/dogs-hero.jpeg,assets/photos/dogs-feed.jpeg,assets/photos/dogs-photo.jpg,assets/photos/dogs-care.jpg">
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
          <div class="photo-grid__item photo-grid__item--tall"><img src="assets/photos/dogs-feed.jpeg" alt="Feeding street dogs" loading="lazy" /></div>
          <div class="photo-grid__item photo-grid__item--tall"><img src="assets/photos/dogs-photo.jpg" alt="Dog care activity" loading="lazy" /></div>
          <div class="photo-grid__item photo-grid__item--tall"><img src="assets/photos/dogs-care.jpg" alt="Rescued dog" loading="lazy" /></div>
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
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/csr-1.jpg,assets/photos/csr-2.jpg,assets/photos/env-hero.jpg,assets/photos/hero-community-2.jpeg">
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
              <img src="assets/photos/csr-2.jpg" alt="Mission 17,000 Trees CSR plantation" loading="lazy" />
              <img src="assets/photos/csr-1.jpg" alt="" loading="lazy" />
              <img src="assets/photos/env-hero.jpg" alt="" loading="lazy" />
            </div>
            <div class="media-carousel__dots" data-carousel-dots></div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="photo-grid reveal-stagger">
          <div class="photo-grid__item"><img src="assets/photos/env-hero.jpg" alt="" loading="lazy" /></div>
          <div class="photo-grid__item"><img src="assets/photos/csr-1.jpg" alt="" loading="lazy" /></div>
          <div class="photo-grid__item"><img src="assets/photos/strip-4.png" alt="" loading="lazy" /></div>
        </div>
      </div>
    </section>
  </main>
""",
)

pages["donate.html"] = page(
    "Donate",
    "Donate to Wings For Dreams in under a minute — pick a cause, choose an amount, pay with UPI.",
    "donate",
    """
  <main class="donate-main">
    <section class="page-hero page-hero--compact page-hero--donate">
      <div class="container">
        <p class="eyebrow">Donate</p>
        <h1>Give a little. Help a lot.</h1>
        <p>Pick a cause, choose an amount, and pay with any UPI app.</p>
      </div>
    </section>
    <section class="section section--donate">
      <div class="container panel-narrow">
        <div class="donate-mode" data-donate-mode role="tablist" aria-label="Donate as">
          <button type="button" class="donate-mode__btn is-active" role="tab" aria-selected="true" data-mode="donor">
            I’m giving
          </button>
          <button type="button" class="donate-mode__btn" role="tab" aria-selected="false" data-mode="employee">
            I’m staff
          </button>
        </div>

        <div class="donate-mode-panel is-active" data-mode-panel="donor" hidden></div>
        <div class="donate-mode-panel" data-mode-panel="employee" hidden>
          <div class="employee-gate" data-employee-gate>
            <p class="donate-mode-note">Enter your staff ID so gifts are tagged to you.</p>
            <form class="employee-gate__form" data-employee-login-inline>
              <label class="form-field">Employee ID
                <input type="text" placeholder="e.g. E001" data-login-id-inline autocomplete="username" required />
              </label>
              <button class="btn btn--primary" type="submit">Continue</button>
              <p class="note" data-login-note-inline>Try E001, E002, or E003</p>
            </form>
          </div>
          <div class="employee-banner is-visible" data-employee-banner hidden></div>
          <div class="employee-share" data-employee-share hidden>
            <p class="form-label-title">Your share link</p>
            <div class="employee-share__row">
              <input type="text" readonly data-employee-share-url />
              <button type="button" class="btn btn--ghost btn--sm" data-employee-share-copy>Copy</button>
            </div>
            <p class="note">Anyone who pays through this link is tagged to you.</p>
          </div>
        </div>

        <form class="donate-panel form donate-panel--fast" data-upi-form data-donate-form>
          <input type="hidden" name="employeeId" data-employee-id value="" />
          <input type="hidden" name="donateMode" data-donate-mode-value value="donor" />

          <div class="gateway-banner" data-gateway-banner hidden></div>

          <div class="form-block">
            <p class="form-label-title">1. Who are we helping?</p>
            <div class="cause-picker cause-picker--simple">
              <label class="cause-option is-selected" data-label="Women Empowerment And Hygiene">
                <input type="radio" name="cause" checked />
                <span class="cause-option__text">Women &amp; hygiene</span>
              </label>
              <label class="cause-option" data-label="Child Education">
                <input type="radio" name="cause" />
                <span class="cause-option__text">Child education</span>
              </label>
              <label class="cause-option" data-label="Animal Care">
                <input type="radio" name="cause" />
                <span class="cause-option__text">Animal care</span>
              </label>
              <label class="cause-option" data-label="Emergency &amp; Volunteer Camp Support">
                <input type="radio" name="cause" />
                <span class="cause-option__text">Emergency support</span>
              </label>
            </div>
          </div>

          <div class="form-block amount-block">
            <p class="form-label-title">2. How much would you like to give?</p>
            <div class="amount-field" data-amount-field>
              <span class="amount-field__currency" aria-hidden="true">₹</span>
              <input
                type="text"
                inputmode="numeric"
                autocomplete="off"
                placeholder="500"
                aria-label="Donation amount in rupees"
                data-custom-amount
                value="500"
              />
            </div>
            <p class="amount-impact" data-amount-impact>₹500 helps with hygiene kits on the ground.</p>
            <div class="amount-grid amount-grid--simple" data-amount-group>
              <button type="button" class="amount-option is-selected" data-amount="500" data-impact="Helps with hygiene kits on the ground.">₹500</button>
              <button type="button" class="amount-option" data-amount="1000" data-impact="Feeds street dogs or supports a day of outreach.">₹1,000</button>
              <button type="button" class="amount-option" data-amount="2000" data-impact="About one full school kit for a child.">₹2,000</button>
              <button type="button" class="amount-option" data-amount="5000" data-impact="A bigger boost for training and field work.">₹5,000</button>
            </div>
          </div>

          <div class="upi-result is-visible" data-upi-result>
            <p class="form-label-title upi-result__step">3. Pay with UPI</p>
            <p class="upi-result__amount" data-upi-amount-label>₹500</p>
            <p class="upi-result__meta" data-upi-cause-label>Women Empowerment And Hygiene</p>
            <div class="upi-result__qr" data-upi-qr aria-label="UPI payment QR code"></div>
            <p class="upi-result__vpa" data-upi-vpa></p>
            <div class="upi-result__actions">
              <a class="btn btn--primary btn--pay" data-upi-launch href="#">Pay with UPI</a>
              <button type="button" class="btn btn--ghost btn--sm" data-upi-copy>Copy link</button>
            </div>
            <button type="button" class="btn btn--ghost btn--sm upi-result__done" data-payment-done>I’ve paid (demo)</button>
            <p class="upi-hint">On phone, tap Pay. On desktop, scan the QR.</p>
            <p class="note" data-form-note></p>
          </div>

          <p class="pay-trust-line" data-pay-trust data-donor-only>
            Safe &amp; official · 80G tax benefit · Registered NGO · PAN AAATW5579L
          </p>

          <details class="receipt-details" data-donor-only>
            <summary>
              <span class="receipt-details__row">
                <span class="receipt-details__copy">
                  <strong>Need a tax receipt?</strong>
                  <span>Optional — name, email, PAN</span>
                </span>
                <span class="receipt-details__toggle" aria-hidden="true">
                  <span class="receipt-details__hint receipt-details__hint--closed">Add details</span>
                  <span class="receipt-details__hint receipt-details__hint--open">Hide</span>
                  <span class="receipt-details__chevron"></span>
                </span>
              </span>
            </summary>
            <div class="receipt-details__body">
              <label class="form-field">Your name
                <input type="text" name="billing_name" placeholder="Anonymous if blank" data-donor-name maxlength="300" />
              </label>
              <label class="form-field">Email
                <input type="email" name="billing_email" placeholder="For your receipt" data-donor-email maxlength="100" />
              </label>
              <label class="form-field">Mobile
                <input type="tel" name="billing_phone" placeholder="10-digit mobile" data-donor-phone inputmode="numeric" maxlength="10" pattern="[0-9]{10}" />
              </label>
              <div class="form-row">
                <label class="form-field">PAN
                  <input type="text" name="billing_pan" placeholder="PAN" data-donor-pan maxlength="10" />
                </label>
                <label class="form-field">Pin code
                  <input type="text" name="billing_pin" placeholder="Pin code" data-donor-pin inputmode="numeric" maxlength="6" pattern="[0-9]{6}" />
                </label>
              </div>
              <input type="hidden" name="gateway_txn" data-gateway-txn value="" />
              <input type="hidden" name="gateway_utr" data-gateway-utr value="" />
              <input type="hidden" name="gateway_status" data-gateway-status value="" />
            </div>
          </details>

          <div class="employee-receipt" data-employee-only hidden>
            <p class="form-label-title">Optional notes</p>
            <label class="form-field">Donor name
              <input type="text" name="emp_donor_name" placeholder="Anonymous if blank" data-emp-donor-name maxlength="300" />
            </label>
            <label class="form-field">Collected by
              <input type="text" name="billing_fundraiser" placeholder="Your name" data-fundraiser maxlength="300" />
            </label>
          </div>

          <div class="payment-success" data-payment-success hidden>
            <p class="payment-success__title">Thank you for your kindness</p>
            <p class="payment-success__meta" data-payment-success-meta></p>
            <a class="btn btn--primary" data-whatsapp-utr href="#" target="_blank" rel="noopener">Share UTR on WhatsApp</a>
            <div class="payment-success__wa-qr" data-whatsapp-qr hidden>
              <div class="payment-success__wa-qr-frame" data-whatsapp-qr-mount aria-hidden="true"></div>
              <p class="payment-success__wa-qr-hint">On desktop? Scan with your phone’s WhatsApp</p>
            </div>
            <p class="note">Records are saved for <a href="admin.html">Admin → Donations</a>.</p>
          </div>
        </form>
        <p class="donate-bank-link"><a href="banks.html">Prefer bank transfer? See account details</a></p>
      </div>
    </section>
  </main>

  <div class="pay-sticky" data-pay-sticky hidden>
    <div class="pay-sticky__meta">
      <strong data-sticky-amount>₹500</strong>
      <span data-sticky-cause>Women Empowerment And Hygiene</span>
    </div>
    <a class="btn btn--primary" data-sticky-pay href="#">Pay with UPI</a>
  </div>
""",
)

pages["school-kit.html"] = page(
    "Donate School Kit",
    "Sponsor a school kit for ₹700 or ₹2,000. Wings For Dreams tops up each kit.",
    "school",
    """
  <main>
    <section class="page-hero page-hero--photo" data-carousel-bg data-interval="5000" data-images="assets/photos/child-kit.jpeg,assets/photos/child-activity.jpeg,assets/photos/child-class.jpeg,assets/photos/child-hero.jpeg">
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
              <img src="assets/photos/child-activity.jpeg" alt="Children receiving school support" loading="lazy" />
              <img src="assets/photos/child-kit.jpeg" alt="" loading="lazy" />
              <img src="assets/photos/child-class.jpeg" alt="" loading="lazy" />
              <img src="assets/photos/child-hero.jpeg" alt="" loading="lazy" />
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
        <div class="bank-card reveal">
          <h3>ICICI Bank</h3>
          <dl>
            <div><dt>Account name</dt><dd>WINGS FOR DREAMS</dd></div>
            <div><dt>Account number</dt><dd>000501065406 <button type="button" class="copy-btn" data-copy="000501065406">Copy</button></dd></div>
            <div><dt>IFSC</dt><dd>ICIC0000005 <button type="button" class="copy-btn" data-copy="ICIC0000005">Copy</button></dd></div>
            <div><dt>Branch</dt><dd>Bund Garden</dd></div>
          </dl>
        </div>
        <div class="bank-card reveal">
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
)

pages["login.html"] = page(
    "Employee login",
    "Log in with your Wings For Dreams employee ID to track donations.",
    "login",
    """
  <main>
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow">Staff</p>
        <h1>Employee login</h1>
        <p>Sign in with your employee ID. Donation links will include your ID for tracking.</p>
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
        <div class="employee-demo-list reveal">
          <p class="form-label-title">Demo employees</p>
          <ul>
            <li><strong>E001</strong> — Priya Sharma</li>
            <li><strong>E002</strong> — Arjun Mehta</li>
            <li><strong>E003</strong> — Neha Patil</li>
          </ul>
          <p class="note stack-sm"><a href="admin.html">Admin: download donations CSV →</a></p>
        </div>
      </div>
    </section>
  </main>
""",
)

pages["admin.html"] = page(
    "Admin · Donations",
    "Download recorded employee-linked donations as CSV anytime.",
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
                <th>Pin</th>
                <th>Cause</th>
                <th>Amount</th>
                <th>Fundraiser</th>
                <th>Employee ID</th>
              </tr>
            </thead>
            <tbody data-admin-rows>
              <tr><td colspan="13">No records yet. Mark a payment done on Donate first.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
""",
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

for name, html in pages.items():
    (ROOT / name).write_text(html, encoding="utf-8")
    print("wrote", name)

print("done", len(pages), "pages")
