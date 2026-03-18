import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import Rating from './Rating';

const TYPING_INTERVAL_MS = 25;
const VISIBLE_REVIEWERS_COUNT = 4;
const LIST_SLIDE_ANIM_MS = 260;

const reviewsData = [
  {
    name: 'Eric Basumatary',
    text: 'Dr. Suresh is a phenomenal doctor with the right amount of expertise in his field. Guided me throughout my ill phase. Very supportive.',
    rating: 5,
  },
  {
    name: 'Shyamal Paul',
    text: "He is so down to earth person.... He explaines so nicely about the problem..... It's was a great thought of consulting him as he took my half pai by his beautiful words and relaxation which he gave him... Further If I want there I would always prefer him first....",
    rating: 5,
  },
  {
    name: 'Manoj LK',
    text: 'Doctor Suresh patiently clarified all doubts and it helped a lot. Thank you Doctor',
    rating: 5,
  },
  {
    name: 'Padmanabhan Renganathan',
    text: 'One of the best doctor and sound knowledge in infection disease specialist in Chennai. I am fully recovered from the disease under his treatment. Thank you so much doctor.',
    rating: 5,
  },
  {
    name: 'anupriya vinoth',
    text: 'Dr. Suresh is very kind and easily reachable person. When I spoke to him in the phone, he responded very well. The diagnosis also very good. He is best infectious disease consultant.',
    rating: 5,
  },
  {
    name: 'Valarmathi Dilli Babu',
    text: 'Such an excellent Doctor, he is best infection disease consultant, who saved our life. We are very much happy with his treatment.',
    rating: 5,
  },
  {
    name: 'SONA MONI BARMAN',
    text: 'One of the best infection disease specialist.I had the opportunity to consult the doctor. Had the best experience with Dr. Suresh Kumar in Chennai Appollo. Thank you',
    rating: 5,
  },
];

export default function TestimonialCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null); // 'up' | 'down' | null
  // Keep list "resting" at -1 step so we always have a buffer item above.
  // Next: animate to -2, then snap back to -1 with updated index.
  // Prev: animate to 0, then snap back to -1 with updated index.
  const [translateY, setTranslateY] = useState(-1);
  const [disableTransition, setDisableTransition] = useState(false);
  const listAnimTimerRef = useRef(null);
  const resetRafRef = useRef(null);

  const review = reviewsData[activeIndex];
  const reviewsLen = reviewsData.length;
  const mod = (n) => ((n % reviewsLen) + reviewsLen) % reviewsLen;
  const at = (i) => reviewsData[mod(i)];

  const getWindowOffsets = () => {
    const base = visibleStartIndex;
    // Always render 6 items: one above + four visible + one below.
    // The list itself stays anchored at translateY(-1 step) when idle.
    return [-1, 0, 1, 2, 3, 4].map((o) => base + o);
  };
  const windowOffsets = getWindowOffsets();

  const triggerListSlide = (direction) => {
    setSlideDirection(direction);
    setIsSliding(true);
    if (listAnimTimerRef.current) clearTimeout(listAnimTimerRef.current);
  };

  // Typing effect: show text letter by letter
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const fullText = review.text;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, TYPING_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [activeIndex, review.text]);

  useEffect(() => {
    return () => {
      if (listAnimTimerRef.current) clearTimeout(listAnimTimerRef.current);
      if (resetRafRef.current) cancelAnimationFrame(resetRafRef.current);
    };
  }, []);

  const handleReviewerClick = (index) => {
    setActiveIndex(index);
  };

  const slideNames = (direction) => {
    if (isSliding) return;
    if (direction !== 'up' && direction !== 'down') return;
    triggerListSlide(direction);
    // Step size is controlled by CSS var so animation doesn't depend on layout measuring.
    // Idle is -1.
    setTranslateY(direction === 'down' ? -2 : 0);
  };

  const handleListTransitionEnd = () => {
    if (!isSliding || (slideDirection !== 'up' && slideDirection !== 'down')) return;

    const nextStart =
      slideDirection === 'down'
        ? mod(visibleStartIndex + 1)
        : mod(visibleStartIndex - 1);

    // Snap back to -1 without transition, then allow next animation.
    setDisableTransition(true);
    setVisibleStartIndex(nextStart);
    setTranslateY(-1);
    setIsSliding(false);
    setSlideDirection(null);

    resetRafRef.current = requestAnimationFrame(() => {
      setDisableTransition(false);
    });
  };

  return (
    <div className="cs_tabs cs_style1 cs_testimonial_with_card">
      <div className="cs_review_list_panel" aria-label="Reviewer list">
        <button
          type="button"
          className="cs_review_list_arrow cs_review_list_arrow_top"
          onClick={() => slideNames('up')}
          aria-label="Show previous reviewers"
        >
          <Icon icon="fa6-solid:chevron-up" aria-hidden />
        </button>

        <div className="cs_review_list_viewport">
          <ul
            className="cs_tab_links cs_review_list_sliding"
            style={{
              transform: `translateY(calc(var(--cs_review_step) * ${translateY}))`,
              transition: disableTransition
                ? 'none'
                : isSliding
                  ? `transform ${LIST_SLIDE_ANIM_MS}ms ease`
                  : 'none',
            }}
            onTransitionEnd={handleListTransitionEnd}
          >
            {windowOffsets.map((offset, i) => {
              const realIndex = mod(offset);
              const r = at(offset);
              const key = `${visibleStartIndex}-${i}-${realIndex}`;
              return (
              <li
                key={key}
                className={activeIndex === realIndex ? 'active' : ''}
              >
                <div
                  className="cs_tab_link_in"
                  onClick={() => handleReviewerClick(realIndex)}
                  onKeyDown={(e) => e.key === 'Enter' && handleReviewerClick(realIndex)}
                  role="button"
                  tabIndex={0}
                  aria-label={r.name}
                >
                  <h3 className="cs_fs_24 cs_semibold mb-2">{r.name}</h3>
                  <div className="cs_tab_link_rating">
                    <Rating ratingNumber={r.rating} />
                  </div>
                </div>
              </li>
            );
          })}
          </ul>
        </div>

        <button
          type="button"
          className="cs_review_list_arrow cs_review_list_arrow_bottom"
          onClick={() => slideNames('down')}
          aria-label="Show next reviewers"
        >
          <Icon icon="fa6-solid:chevron-down" aria-hidden />
        </button>
      </div>
      <div className="cs_tab_body">
        <div className="cs_testimonial_review_card">
          <div className="cs_testimonial_card_quote">
            <Icon icon="fa6-solid:quote-left" aria-hidden />
          </div>
          <div className="cs_testimonial_card_text_wrap">
            <p className="cs_testimonial_card_text_sizer" aria-hidden>
              {review.text}
            </p>
            <p className="cs_testimonial_card_text cs_testimonial_card_text_visible">
              {displayedText}
              {isTyping && <span className="cs_typing_cursor" aria-hidden>|</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
