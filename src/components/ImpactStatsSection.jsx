import React, { useRef, useState, useEffect } from 'react';

const DURATION_MS = 1600;
const EASE_OUT_CUBIC = (t) => 1 - (1 - t) ** 3;

function formatStatValue(value, target, suffix) {
  if (target >= 1e6) {
    if (value >= 1e6) return '1M+';
    if (value >= 1000) return `${Math.round(value / 1000)}K+`;
    return Math.round(value) + suffix;
  }
  if (target >= 1000) {
    return Math.round(value).toLocaleString() + suffix;
  }
  return Math.round(value) + suffix;
}

const statsData = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M24 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M16 32v-2c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <circle cx="24" cy="22" r="2.5" fill="currentColor"/>
        <path d="M20 36h-2c-2.2 0-4-1.8-4-4v-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M34 36h2c2.2 0 4-1.8 4-4v-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    target: 1e6,
    suffix: '+',
    description: 'Patients Supported through clinical guidance',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M24 6L8 14v20l16 8 16-8V14L24 6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
        <path d="M24 6v40M8 14l16 8 16-8M8 34l16 8 16-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <rect x="20" y="18" width="8" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
        <path d="M18 24h12M20 27h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    target: 100,
    suffix: '+',
    description: 'Hospitals assisted with infection prevention',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M24 4L8 10v12c0 10 6 18 16 22 10-4 16-12 16-22V10L24 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
        <path d="M18 24l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    target: 100000,
    suffix: '+',
    description: 'Healthcare professionals reached through education initiatives',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M26 8H12c-1.1 0-2 .9-2 2v28c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V16l-12-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
        <path d="M26 8v8h12M14 20h20M14 26h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M8 12h4v28H8a2 2 0 01-2-2V14a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    target: 50,
    suffix: '+',
    description: 'Books published in Infectious Diseases literature',
  },
];

export default function ImpactStatsSection() {
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayValues, setDisplayValues] = useState(statsData.map(() => 0));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || hasAnimated) return;
        setHasAnimated(true);
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const start = performance.now();
    const targets = statsData.map((s) => s.target);

    const tick = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / DURATION_MS, 1);
      const eased = EASE_OUT_CUBIC(t);

      setDisplayValues(targets.map((target) => target * eased));

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplayValues(targets);
      }
    };
    requestAnimationFrame(tick);
  }, [hasAnimated]);

  return (
    <section className="cs_impact_stats_section" ref={sectionRef}>
      <div className="container">
        <div className="cs_impact_stats_card">
          <div className="cs_impact_stats_wrap">
            {statsData.map((item, index) => (
              <div className="cs_impact_stat_item" key={index}>
                <div className="cs_impact_stat_icon" aria-hidden>
                  {item.icon}
                </div>
                <div className="cs_impact_stat_content">
                  <span className="cs_impact_stat_number">
                    {formatStatValue(displayValues[index], item.target, item.suffix)}
                  </span>
                  <p className="cs_impact_stat_desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
