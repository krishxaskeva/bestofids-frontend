import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { config } from '../config';

const STORAGE_KEY = 'floating_whatsapp_position';
const DRAG_THRESHOLD = 5;
const DOCK_SIZE = 48;
const CIRCLE_SIZE = 48;
const EDGE_PADDING = 20;
const IDLE_DELAY_MS = 3000;
const WHATSAPP_BASE_URL = 'https://wa.me/';

function getWhatsAppUrl() {
  const number = (config.whatsappNumber || '').replace(/\D/g, '');
  if (!number) return WHATSAPP_BASE_URL;
  return `${WHATSAPP_BASE_URL}${number}`;
}

function getStoredPosition() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.edge === 'left' || data.edge === 'right') {
        const top = Number(data.top);
        if (!Number.isNaN(top)) return { edge: data.edge, top };
      }
    }
  } catch (_) {}
  return { edge: 'right', top: 0.3 * (typeof window !== 'undefined' ? window.innerHeight : 300) };
}

function savePosition(edge, top) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ edge, top }));
  } catch (_) {}
}

function snapToNearestVerticalEdge(centerX) {
  const W = window.innerWidth;
  return centerX < W / 2 ? 'left' : 'right';
}

function clampTop(top, height = DOCK_SIZE) {
  const H = window.innerHeight;
  return Math.max(EDGE_PADDING, Math.min(H - height - EDGE_PADDING, top));
}

export default function FloatingWhatsApp() {
  const [position, setPosition] = useState(() => getStoredPosition());
  const [expanded, setExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pixelPos, setPixelPos] = useState({ x: 0, y: EDGE_PADDING });
  const [mounted, setMounted] = useState(false);
  const [idle, setIdle] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const isDraggingRef = useRef(false);
  const expandedRef = useRef(false);
  const pixelPosRef = useRef(pixelPos);
  const idleTimerRef = useRef(null);
  const dropRef = useRef(null);
  const ctaButtonRef = useRef(null);
  const pointerDownTargetRef = useRef(null);

  pixelPosRef.current = pixelPos;
  expandedRef.current = expanded;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const { edge, top } = position;
    const W = window.innerWidth;
    const y = clampTop(top);
    const x = edge === 'left' ? 0 : W - DOCK_SIZE;
    setPixelPos({ x, y });
  }, [mounted, position]);

  useEffect(() => {
    if (expanded) {
      const t = setTimeout(() => setTextVisible(true), 200);
      return () => clearTimeout(t);
    }
    setTextVisible(false);
  }, [expanded]);

  const handlePointerMove = useCallback((e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    if (!isDraggingRef.current && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      if (expandedRef.current) {
        setExpanded(false);
      }
      isDraggingRef.current = true;
      setIsDragging(true);
    }
    if (isDraggingRef.current) {
      const W = window.innerWidth;
      const centerX = clientX - CIRCLE_SIZE / 2;
      const centerY = clientY - CIRCLE_SIZE / 2;
      setPixelPos({
        x: Math.max(0, Math.min(W - CIRCLE_SIZE, centerX)),
        y: clampTop(centerY, CIRCLE_SIZE),
      });
    }
  }, []);

  const handlePointerUp = useCallback((_e) => {
    if (isDraggingRef.current) {
      const pos = pixelPosRef.current;
      const centerX = pos.x + CIRCLE_SIZE / 2;
      const edge = snapToNearestVerticalEdge(centerX);
      const top = clampTop(pos.y);
      setPosition({ edge, top });
      savePosition(edge, top);
      setExpanded(false);
    } else {
      if (expandedRef.current) {
        const target = pointerDownTargetRef.current;
        const isCtaClick = ctaButtonRef.current && target && ctaButtonRef.current.contains(target);
        if (!isCtaClick) {
          setExpanded(false);
        }
        // CTA click: button's onClick will open WhatsApp and collapse
      } else {
        setExpanded(true);
      }
    }
    isDraggingRef.current = false;
    setIsDragging(false);
    pointerDownTargetRef.current = null;
  }, []);

  const handlePointerDown = useCallback(
    (e) => {
      pointerDownTargetRef.current = e.target;
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      dragStart.current = {
        x: clientX,
        y: clientY,
        left: pixelPos.x,
        top: pixelPos.y,
      };
      isDraggingRef.current = false;

      const onMove = (moveEvent) => handlePointerMove(moveEvent);
      const onUp = (upEvent) => {
        handlePointerUp(upEvent);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        if (document) {
          document.removeEventListener('touchmove', onMove, { passive: true });
          document.removeEventListener('touchend', onUp);
        }
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
      if (document) {
        document.addEventListener('touchmove', onMove, { passive: true });
        document.addEventListener('touchend', onUp);
      }
    },
    [pixelPos, handlePointerMove, handlePointerUp]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && expanded) {
        e.preventDefault();
        setExpanded(false);
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!expanded) {
          setExpanded(true);
        }
      }
    },
    [expanded]
  );

  const handleOverlayClick = useCallback(() => {
    setExpanded(false);
  }, []);

  const handleCtaClick = useCallback((e) => {
    e.stopPropagation();
    if (!expandedRef.current) return;
    window.open(getWhatsAppUrl(), '_blank', 'noopener,noreferrer');
    setExpanded(false);
  }, []);

  useEffect(() => {
    if (expanded || isDragging) {
      setIdle(false);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      return;
    }
    idleTimerRef.current = setTimeout(() => setIdle(true), IDLE_DELAY_MS);
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [expanded, isDragging]);

  const handlePointerEnter = useCallback(() => setIdle(false), []);
  const handlePointerLeave = useCallback(() => {
    if (!expanded && !isDragging) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setIdle(true), IDLE_DELAY_MS);
    }
  }, [expanded, isDragging]);

  const style = mounted
    ? isDragging
      ? { left: pixelPos.x, top: pixelPos.y, width: CIRCLE_SIZE, height: CIRCLE_SIZE, right: 'auto' }
      : expanded
        ? position.edge === 'right'
          ? { right: 16, left: 'auto', top: pixelPos.y }
          : { left: 16, right: 'auto', top: pixelPos.y }
        : position.edge === 'right'
          ? { right: 0, left: 'auto', top: pixelPos.y, width: DOCK_SIZE, height: DOCK_SIZE }
          : { left: 0, right: 'auto', top: pixelPos.y, width: DOCK_SIZE, height: DOCK_SIZE }
    : { right: 0, left: 'auto', top: '30%', width: DOCK_SIZE, height: DOCK_SIZE };

  return (
    <>
      <div
        ref={dropRef}
        className={`floating-wa ${position.edge === 'right' ? 'floating-wa--right' : 'floating-wa--left'} ${expanded ? 'floating-wa--expanded' : ''} ${isDragging ? 'floating-wa--dragging' : ''} ${idle ? 'floating-wa--idle' : ''}`}
        style={style}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        role="button"
        tabIndex={0}
        aria-label={expanded ? 'WhatsApp menu' : 'Open WhatsApp menu'}
        aria-expanded={expanded}
      >
        <div className="floating-wa__drop">
          <span className="floating-wa__circle" aria-hidden>
            <span className="floating-wa__icon-wrap floating-wa__icon-wrap--collapsed" aria-hidden>
              <Icon icon="fa6-brands:whatsapp" className="floating-wa__icon floating-wa__icon--collapsed" aria-hidden />
            </span>
            <span className="floating-wa__icon-wrap floating-wa__icon-wrap--expanded" aria-hidden>
              <Icon icon="fa6-brands:whatsapp" className="floating-wa__icon" aria-hidden />
            </span>
          </span>
          <button
            ref={ctaButtonRef}
            type="button"
            className={`floating-wa__cta-btn ${textVisible ? 'floating-wa__cta-btn--visible' : ''}`}
            onClick={handleCtaClick}
            aria-label="Book an Appointment on WhatsApp"
          >
            Book an Appointment
          </button>
        </div>
      </div>

      {expanded && (
        <div
          className="floating-wa__overlay"
          onClick={handleOverlayClick}
          onTouchEnd={(e) => e.target === e.currentTarget && handleOverlayClick()}
          aria-hidden
        />
      )}
    </>
  );
}
