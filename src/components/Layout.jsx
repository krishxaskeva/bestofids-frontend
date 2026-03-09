import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import FloatingWhatsApp from './FloatingWhatsApp';

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  return (
    <div className="cs_layout">
      <Header
        logoSrc="/images/best-of-ids-logo.png"
        variant="cs_heading_color"
      />
      <main className="cs_layout_main">
        <div className="cs_layout_content">
          <Outlet />
        </div>
      </main>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}
