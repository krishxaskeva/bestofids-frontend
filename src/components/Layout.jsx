import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import FloatingWhatsApp from './FloatingWhatsApp';

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  return (
    <>
      <Header
        logoSrc="/images/best-of-ids-logo.png"
        variant={isHome ? 'cs_white_color' : 'cs_heading_color'}
      />
      <Outlet />
      <FloatingWhatsApp />
      <Footer />
    </>
  );
}
