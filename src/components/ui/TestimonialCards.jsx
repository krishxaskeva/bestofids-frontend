import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import Rating from './Rating';

const TYPING_INTERVAL_MS = 25;
const HOLD_AFTER_TYPING_MS = 10000; // 10 seconds after typing ends

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
];

export default function TestimonialCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const holdTimerRef = useRef(null);

  const review = reviewsData[activeIndex];

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

  // After typing ends, wait 10 seconds then advance to next review
  useEffect(() => {
    if (isTyping) return;
    holdTimerRef.current = setTimeout(() => {
      setActiveIndex(prev => (prev + 1) % reviewsData.length);
    }, HOLD_AFTER_TYPING_MS);
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, [isTyping, activeIndex]);

  const handleReviewerClick = (index) => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setActiveIndex(index);
  };

  return (
    <div className="cs_tabs cs_style1 cs_testimonial_with_card">
      <ul className="cs_tab_links">
        {reviewsData.map((r, i) => (
          <li key={i} className={activeIndex === i ? 'active' : ''}>
            <div
              className="cs_tab_link_in"
              onClick={() => handleReviewerClick(i)}
              onKeyDown={(e) => e.key === 'Enter' && handleReviewerClick(i)}
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
        ))}
      </ul>
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
