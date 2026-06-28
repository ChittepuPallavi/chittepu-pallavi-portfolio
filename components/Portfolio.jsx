'use client';

import { useRef, useEffect, useState } from 'react';
import VideoIntro from './VideoIntro';
import styles from '../styles/Portfolio.module.css';

// ── Typed cycling text ─────────────────────────────────────────
const roles = [
  'Java Developer',
  'AI Enthusiast',
  'Competitive Programmer',
  'Problem Solver',
  'Full Stack Learner',
  'Open Source Contributor',
  'Software Engineer Aspirant',
];

function TypedRole() {
  const [idx, setIdx]     = useState(0);
  const [text, setText]   = useState('');
  const [deleting, setDel]= useState(false);

  useEffect(() => {
    const full = roles[idx];
    let timeout;
    if (!deleting && text.length < full.length) {
      timeout = setTimeout(() => setText(full.slice(0, text.length + 1)), 70);
    } else if (!deleting && text.length === full.length) {
      timeout = setTimeout(() => setDel(true), 1800);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(full.slice(0, text.length - 1)), 38);
    } else if (deleting && text.length === 0) {
      setDel(false);
      setIdx((i) => (i + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, idx]);

  return (
    <span className={styles.typed}>
      {text}
      <span className={styles.cursor} aria-hidden="true">|</span>
    </span>
  );
}

// ── Skills data ───────────────────────────────────────────────
const skills = {
  Languages:   ['Java', 'Python', 'C', 'JavaScript', 'HTML5', 'CSS3', 'SQL'],
  'Frameworks': ['React.js', 'Next.js', 'Node.js', 'GSAP', 'Three.js'],
  Database:    ['MySQL'],
  Tools:       ['VS Code', 'Git', 'GitHub', 'Arduino IDE', 'Postman'],
  Concepts:    ['OOP', 'Data Structures', 'Algorithms', 'DBMS', 'OS', 'Computer Networks'],
};

// ── Projects ──────────────────────────────────────────────────
const projects = [
  {
    emoji: '🏧', title: 'ATM Interface',
    desc: 'Java desktop application implementing core banking operations with secure PIN validation.',
    tags: ['Java', 'OOP', 'Collections', 'File Handling'],
    highlight: false,
  },
  {
    emoji: '💱', title: 'Currency Converter',
    desc: 'Java Swing application for real-time currency conversion with clean UI and exception handling.',
    tags: ['Java', 'Swing', 'OOP'],
    highlight: false,
  },
  {
    emoji: '🎮', title: 'Number Guessing Game',
    desc: 'Interactive Java game featuring difficulty levels, score tracking, and multiple attempt handling.',
    tags: ['Java', 'Random', 'Score Tracking'],
    highlight: false,
  },
  {
    emoji: '🎓', title: 'Student Grade Calculator',
    desc: 'Grade, percentage, and GPA computation tool with detailed result analysis.',
    tags: ['Java', 'OOP'],
    highlight: false,
  },
  {
    emoji: '🤖', title: 'AI Medical Image Analysis',
    desc: 'Current project — AI-powered medical imaging platform assisting healthcare professionals through intelligent image analysis.',
    tags: ['AI', 'Deep Learning', 'Medical Imaging', 'Web Dev'],
    highlight: true,
  },
  {
    emoji: '🌐', title: 'Personal Portfolio Website',
    desc: 'Modern cinematic developer portfolio built with Next.js, Three.js, GSAP, and responsive design.',
    tags: ['Next.js', 'Three.js', 'GSAP'],
    highlight: false,
  },
];

// ── Nav ───────────────────────────────────────────────────────
const navLinks = ['Home','About','Skills','Projects','Experience','Achievements','Contact'];

// ── Main component ────────────────────────────────────────────
export default function Portfolio() {
  const aboutRef   = useRef(null);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setNavOpen(false);
    const el = document.getElementById(id.toLowerCase());
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ── NAV ─────────────────────────────────────── */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navLogo} onClick={() => scrollTo('home')}>
          <span className={styles.navLogoAccent}>CP</span>
        </div>
        <div className={`${styles.navLinks} ${navOpen ? styles.navOpen : ''}`}>
          {navLinks.map(l => (
            <button key={l} className={styles.navLink} onClick={() => scrollTo(l)}>
              {l}
            </button>
          ))}
        </div>
        <button className={styles.navBurger} onClick={() => setNavOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── HERO ────────────────────────────────────── */}
      <VideoIntro
        videoSrc="/portfolio.mp4"
        firstName="Chittepu"
        lastName="Pallavi"
        tagline="Software Developer · Java · AI · Full Stack"
        role="Passionate B.Tech Computer Science student focused on building scalable software solutions using Java, AI, Full Stack Development, and Modern Web Technologies."
        nextSectionRef={aboutRef}
      />

      {/* ── ABOUT ───────────────────────────────────── */}
      <section id="about" ref={aboutRef} className={styles.section}>
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>Who I Am</p>
          <h2 className={styles.sectionTitle}>About <span className={styles.accent}>Me</span></h2>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <p>Hi, I'm <strong>Chittepu Pallavi</strong> — a Software Developer, Java Programmer, and AI Enthusiast currently pursuing my B.Tech in Computer Science & Engineering.</p>
              <p>I am passionate about building real-world applications that solve practical problems, while continuously sharpening my programming and development skills across Java, AI, and modern web technologies.</p>
              <p>My goal is to become a highly skilled Software Engineer capable of creating scalable, user-friendly, and intelligent applications that make a real difference.</p>
              <div className={styles.aboutRole}>
                <span className={styles.aboutRoleLabel}>Currently —</span>
                <TypedRole />
              </div>
            </div>
            <div className={styles.aboutStats}>
              {[
                { num: '4+',  label: 'Java Projects' },
                { num: '1',   label: 'AI Project (Active)' },
                { num: 'B.Tech', label: 'CS & Engineering' },
                { num: '∞',   label: 'Curiosity' },
              ].map(s => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statNum}>{s.num}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className={styles.eduCard}>
            <div className={styles.eduIcon}>🎓</div>
            <div>
              <h3 className={styles.eduTitle}>Bachelor of Technology — Computer Science & Engineering</h3>
              <p className={styles.eduSub}>Expected Graduation: 2026 &nbsp;·&nbsp; India</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ──────────────────────────────────── */}
      <section id="skills" className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>What I Work With</p>
          <h2 className={styles.sectionTitle}>Technical <span className={styles.accent}>Skills</span></h2>
          <div className={styles.skillsGrid}>
            {Object.entries(skills).map(([cat, items]) => (
              <div key={cat} className={styles.skillGroup}>
                <h3 className={styles.skillCat}>{cat}</h3>
                <div className={styles.skillTags}>
                  {items.map(s => (
                    <span key={s} className={styles.skillTag}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ────────────────────────────────── */}
      <section id="projects" className={styles.section}>
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>What I've Built</p>
          <h2 className={styles.sectionTitle}>Featured <span className={styles.accent}>Projects</span></h2>
          <div className={styles.projectsGrid}>
            {projects.map(p => (
              <div key={p.title} className={`${styles.projectCard} ${p.highlight ? styles.projectHighlight : ''}`}>
                {p.highlight && <span className={styles.projectBadge}>🔥 Active</span>}
                <div className={styles.projectEmoji}>{p.emoji}</div>
                <h3 className={styles.projectTitle}>{p.title}</h3>
                <p className={styles.projectDesc}>{p.desc}</p>
                <div className={styles.projectTags}>
                  {p.tags.map(t => <span key={t} className={styles.projectTag}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ──────────────────────────────── */}
      <section id="experience" className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>Where I've Worked</p>
          <h2 className={styles.sectionTitle}>Internship <span className={styles.accent}>Experience</span></h2>
          <div className={styles.expCard}>
            <div className={styles.expHeader}>
              <div>
                <h3 className={styles.expRole}>Java Programming Intern</h3>
                <p className={styles.expCompany}>DecodeLabs</p>
              </div>
              <span className={styles.expBadge}>Completed</span>
            </div>
            <p className={styles.expDesc}>Worked on multiple industry-level Java applications focusing on core development best practices.</p>
            <div className={styles.expSkills}>
              {['Core Java','OOP','Exception Handling','Collections Framework','File Handling','GUI Applications','Software Dev Best Practices'].map(s => (
                <span key={s} className={styles.skillTag}>{s}</span>
              ))}
            </div>
            <div className={styles.expProjects}>
              <p className={styles.expProjectsLabel}>Projects completed during internship:</p>
              <div className={styles.expProjectList}>
                {['ATM Interface','Number Guessing Game','Student Grade Calculator','Currency Converter'].map(p => (
                  <span key={p} className={styles.expProject}>✓ {p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS ────────────────────────────── */}
      <section id="achievements" className={styles.section}>
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>Milestones</p>
          <h2 className={styles.sectionTitle}>Achieve<span className={styles.accent}>ments</span></h2>
          <div className={styles.achieveGrid}>
            {[
              { icon: '🧠', text: 'Solved Data Structures & Algorithms problems' },
              { icon: '☕', text: 'Built multiple production-quality Java applications' },
              { icon: '🌐', text: 'Developed responsive full-stack websites' },
              { icon: '🤖', text: 'Exploring Artificial Intelligence & Deep Learning' },
              { icon: '🐙', text: 'Active GitHub contributor with real project portfolio' },
              { icon: '📚', text: 'Continuous learner — always upskilling' },
            ].map(a => (
              <div key={a.text} className={styles.achieveCard}>
                <span className={styles.achieveIcon}>{a.icon}</span>
                <p className={styles.achieveText}>{a.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.interestsWrap}>
            <h3 className={styles.interestsTitle}>Areas of Interest</h3>
            <div className={styles.interestTags}>
              {['Artificial Intelligence','Software Engineering','Full Stack Development','Cloud Computing','Machine Learning','UI/UX Design','Open Source'].map(i => (
                <span key={i} className={styles.interestTag}>{i}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────── */}
      <section id="contact" className={`${styles.section} ${styles.sectionDark} ${styles.contactSection}`}>
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>Get In Touch</p>
          <h2 className={styles.sectionTitle}>Let's <span className={styles.accent}>Connect</span></h2>
          <p className={styles.contactSub}>I'm open to opportunities, collaborations, and conversations. Reach out anytime.</p>
          <div className={styles.contactGrid}>
            {[
              { icon: '✉️', label: 'Email-1',    val: 'my-email-1@gmail.com',           href: 'mailto:chittepupallavi18@gmail.com' },
              { icon: '✉️', label: 'Email-2',    val: 'my-email2@gmail.com',           href: 'mailto:pallavichittepu18@gmail.com' },
              { icon: '🐙', label: 'GitHub-1',   val: 'github.com/ChittepuPallavi',     href: 'https://github.com/ChittepuPallavi' },
              { icon: '🐙', label: 'GitHub-2',   val: 'github.com/ChittepuPallavi123',     href: 'https://github.com/chittepupallavi123' },
              { icon: '💼', label: 'LinkedIn', val: 'linkedin.com/in/pallavi-profile',   href: 'https://www.linkedin.com/in/pallavi-chittepu-a98a26273?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
              { icon: '📍', label: 'Location', val: 'India',                        href: null },
            ].map(c => (
              <div key={c.label} className={styles.contactCard}>
                <span className={styles.contactIcon}>{c.icon}</span>
                <span className={styles.contactLabel}>{c.label}</span>
                {c.href
                  ? <a href={c.href} className={styles.contactVal} target="_blank" rel="noreferrer">{c.val}</a>
                  : <span className={styles.contactVal}>{c.val}</span>
                }
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className={styles.footer}>
        <p>© 2025 <span className={styles.accent}>Chittepu Pallavi</span> · Built with Next.js, Three.js & GSAP</p>
      </footer>
    </>
  );
}


