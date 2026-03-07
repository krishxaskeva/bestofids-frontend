import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Popover, Drawer } from 'antd';
import { useAuth } from '../store/hooks';
import SocialWidget from './SocialWidget';
import Newsletter from './Newsletter';
import IconBox from './ui/IconBox';
import Spacing from './Spacing';
import { getAssetUrl } from '../config';

export default function Header({ logoSrc, variant }) {
  const { isSuperAdmin, isLoggedIn, logout } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [mobileToggle, setMobileToggle] = useState(false);
  const [sideNav, setSideNav] = useState(false);
  const [avatarPopoverOpen, setAvatarPopoverOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const navListRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const wrap = navListRef.current;
      const activeLink = wrap?.querySelector('.cs_nav_link_active');
      if (activeLink && wrap) {
        const linkRect = activeLink.getBoundingClientRect();
        const wrapRect = wrap.getBoundingClientRect();
        setIndicator({
          left: linkRect.left - wrapRect.left,
          width: linkRect.width,
        });
      }
    };
    updateIndicator();
    const t = setTimeout(updateIndicator, 50);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <>
      <header
        className={`cs_site_header cs_style1 cs_sticky_header ${
          mobileToggle ? 'cs_mobile_toggle_active' : ''
        } ${variant} ${isSticky ? 'cs_active_sticky' : ''}`}
      >
        <div className="cs_main_header">
          <div className="container">
            <div className="cs_main_header_in">
              <div className="cs_main_header_left">
                <Link className="cs_site_branding" to="/">
                  <img src={getAssetUrl(logoSrc)} alt="Logo" />
                </Link>
              </div>
              <div className="cs_main_header_center">
                <nav className="cs_nav">
                  <div className="cs_nav_list_wrap" ref={navListRef}>
                    <ul
                      className={`${
                        mobileToggle ? 'cs_nav_list cs_active' : 'cs_nav_list'
                      }`}
                    >
                      <li>
                      <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                          isActive ? 'cs_nav_link cs_nav_link_active' : 'cs_nav_link'
                        }
                        onClick={() => setMobileToggle(false)}
                      >
                        Home
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/our-services"
                        className={({ isActive }) =>
                          isActive ? 'cs_nav_link cs_nav_link_active' : 'cs_nav_link'
                        }
                        onClick={() => setMobileToggle(false)}
                      >
                        Appointments & Our Services
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/patient-care-appointments"
                        className={({ isActive }) =>
                          isActive ? 'cs_nav_link cs_nav_link_active' : 'cs_nav_link'
                        }
                        onClick={() => setMobileToggle(false)}
                      >
                        Patient Care & Knowledge
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/doctor-hospital-services"
                        className={({ isActive }) =>
                          isActive ? 'cs_nav_link cs_nav_link_active' : 'cs_nav_link'
                        }
                        onClick={() => setMobileToggle(false)}
                      >
                        Doctor & Hospital Services
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/id-education-knowledge-hub"
                        className={({ isActive }) =>
                          isActive ? 'cs_nav_link cs_nav_link_active' : 'cs_nav_link'
                        }
                        onClick={() => setMobileToggle(false)}
                      >
                        ID Education & Knowledge Hub
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/contact-testimonials"
                        className={({ isActive }) =>
                          isActive ? 'cs_nav_link cs_nav_link_active' : 'cs_nav_link'
                        }
                        onClick={() => setMobileToggle(false)}
                      >
                        Contact & Testimonials
                      </NavLink>
                    </li>
                  </ul>
                  <span
                    className="cs_nav_indicator"
                    style={{
                      left: indicator.left,
                      width: indicator.width,
                    }}
                    aria-hidden
                  />
                  </div>
                  <span
                    className={
                      mobileToggle
                        ? 'cs_menu_toggle cs_teggle_active'
                        : 'cs_menu_toggle'
                    }
                    onClick={() => setMobileToggle(!mobileToggle)}
                  >
                    <span></span>
                  </span>
                </nav>
              </div>
              <div className="cs_main_header_right">
                <div className="cs_toolbox">
                  <Popover
                    content={
                      <div className="cs_avatar_dropdown" role="menu" style={{ minWidth: 200 }}>
                        {isSuperAdmin && (
                          <>
                            <Link
                              to="/admin"
                              className="cs_avatar_dropdown_item"
                              role="menuitem"
                              onClick={() => setAvatarPopoverOpen(false)}
                            >
                              <Icon icon="mdi:cog" aria-hidden />
                              <span>Admin Panel</span>
                            </Link>
                            <button
                              type="button"
                              className="cs_avatar_dropdown_item cs_avatar_dropdown_btn"
                              role="menuitem"
                              onClick={() => {
                                setAvatarPopoverOpen(false);
                                logout();
                              }}
                            >
                              <Icon icon="mdi:logout" aria-hidden />
                              <span>Logout</span>
                            </button>
                          </>
                        )}
                        {!isSuperAdmin && isLoggedIn && (
                          <>
                            <Link
                              to="/profile"
                              className="cs_avatar_dropdown_item"
                              role="menuitem"
                              onClick={() => setAvatarPopoverOpen(false)}
                            >
                              <Icon icon="mdi:account" aria-hidden />
                              <span>Profile</span>
                            </Link>
                            <Link
                              to="/my-learning"
                              className="cs_avatar_dropdown_item"
                              role="menuitem"
                              onClick={() => setAvatarPopoverOpen(false)}
                            >
                              <Icon icon="mdi:school" aria-hidden />
                              <span>My Learning</span>
                            </Link>
                            <Link
                              to="/patient-care-appointments"
                              className="cs_avatar_dropdown_item"
                              role="menuitem"
                              onClick={() => setAvatarPopoverOpen(false)}
                            >
                              <Icon icon="mdi:calendar-account" aria-hidden />
                              <span>Patient Care & Knowledge</span>
                            </Link>
                            <button
                              type="button"
                              className="cs_avatar_dropdown_item cs_avatar_dropdown_btn"
                              role="menuitem"
                              onClick={() => {
                                setAvatarPopoverOpen(false);
                                logout();
                              }}
                            >
                              <Icon icon="mdi:logout" aria-hidden />
                              <span>Logout</span>
                            </button>
                          </>
                        )}
                        {!isSuperAdmin && !isLoggedIn && (
                          <>
                            <Link
                              to="/login"
                              className="cs_avatar_dropdown_item"
                              role="menuitem"
                              onClick={() => setAvatarPopoverOpen(false)}
                            >
                              <Icon icon="mdi:login" aria-hidden />
                              <span>Login</span>
                            </Link>
                            <Link
                              to="/signup"
                              className="cs_avatar_dropdown_item"
                              role="menuitem"
                              onClick={() => setAvatarPopoverOpen(false)}
                            >
                              <Icon icon="mdi:account-plus" aria-hidden />
                              <span>Sign Up</span>
                            </Link>
                          </>
                        )}
                      </div>
                    }
                    trigger="click"
                    open={avatarPopoverOpen}
                    onOpenChange={setAvatarPopoverOpen}
                    placement="bottomRight"
                    arrow={false}
                    overlayClassName="cs_avatar_popover"
                  >
                    <button
                      type="button"
                      className="cs_toolbox_btn cs_header_user_avatar"
                      aria-label="User menu"
                      aria-expanded={avatarPopoverOpen}
                      aria-haspopup="true"
                    >
                      <Icon icon="mdi:account-circle" aria-hidden />
                    </button>
                  </Popover>
                  <button
                    className="cs_toolbox_btn cs_sidebar_toggle_btn"
                    type="button"
                    onClick={() => setSideNav(true)}
                  >
                    <svg
                      width={35}
                      height={30}
                      viewBox="0 0 35 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.483887 2.46544C0.483887 1.10383 1.14618 0 1.96315 0H33.5208C34.3377 0 35 1.10383 35 2.46544C35 3.82708 34.3377 4.93088 33.5208 4.93088H1.96315C1.14618 4.93088 0.483887 3.82708 0.483887 2.46544Z"
                        fill="currentColor"
                      />
                      <path
                        d="M0.483887 14.6694C0.483887 13.3074 1.14618 12.2039 1.96315 12.2039H33.5208C34.3377 12.2039 35 13.3074 35 14.6694C35 16.0309 34.3377 17.1348 33.5208 17.1348H1.96315C1.14618 17.1348 0.483887 16.0309 0.483887 14.6694Z"
                        fill="currentColor"
                      />
                      <path
                        d="M0.483887 26.6267C0.483887 25.2648 1.14618 24.1613 1.96315 24.1613H33.5208C34.3377 24.1613 35 25.2648 35 26.6267C35 27.9883 34.3377 29.0922 33.5208 29.0922H1.96315C1.14618 29.0922 0.483887 27.9883 0.483887 26.6267Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Drawer
        title={null}
        placement="right"
        open={sideNav}
        onClose={() => setSideNav(false)}
        width={620}
        styles={{ body: { padding: 0 } }}
        rootClassName="cs_header_sidenav_drawer"
        closeIcon={<img src={getAssetUrl('/images/icons/close.svg')} alt="Close" />}
      >
        <div className="cs_sidenav_in">
          <div className="cs_logo_box" style={{ marginBottom: 24 }}>
            <img src={getAssetUrl(logoSrc)} alt="Logo" />
            <div className="cs_height_15" />
            <h3 className="cs_fs_24 cs_semibold mb-0">
              Your Partner in Health and Wellness
            </h3>
          </div>
          <hr />
          <Spacing md="35" lg="50" xl="35" />
          <IconBox
            title="Phone"
            subTitle="123-456-7890"
            iconSrc={getAssetUrl('/images/contact/icon_1.svg')}
          />
          <Spacing md="30" lg="30" xl="30" />
          <IconBox
            title="Email"
            subTitle="hellocallcenter@gmail.com"
            iconSrc={getAssetUrl('/images/contact/icon_2.svg')}
          />
          <Spacing md="30" lg="30" xl="30" />
          <IconBox
            title="Location"
            subTitle="123 Anywhere St., Any City, 12345"
            iconSrc={getAssetUrl('/images/contact/icon_3.svg')}
          />
          <Spacing md="60" lg="60" xl="60" />
          <Newsletter />
          <Spacing md="70" lg="50" xl="50" />
          <hr />
          <Spacing md="70" lg="50" xl="50" />
          <SocialWidget />
        </div>
      </Drawer>
    </>
  );
}
