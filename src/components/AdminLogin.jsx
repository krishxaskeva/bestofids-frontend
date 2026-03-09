import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { pageTitle } from '../utils/PageTitle';
import { useAuth } from '../store/hooks';
import { getAssetUrl } from '../config';

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = '#India123';

export default function AdminLogin() {
  pageTitle('Admin Login');
  const navigate = useNavigate();
  const { loginAsSuperAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      loginAsSuperAdmin();
      navigate('/', { replace: true });
      return;
    }
    setError('Invalid admin credentials. Please try again.');
  };

  return (
    <div className="cs_login_page_wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="cs_contact_form cs_style_1 cs_white_bg cs_radius_30 cs_login_form cs_admin_login_form">
              <div className="cs_login_card_logo_wrap">
                <img
                  src={getAssetUrl('/images/best-of-ids-logo.png')}
                  alt="Best of IDs"
                  className="cs_login_card_logo"
                />
              </div>
              <h2 className="cs_form_title cs_heading_color cs_fs_32 cs_semibold mb-4">
                Admin sign in
              </h2>
              <p className="cs_heading_color mb-4 opacity-75">
                Sign in with your administrator credentials.
              </p>
              {error && (
                <div className="cs_login_error mb-3" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="cs_input_label cs_heading_color" htmlFor="admin-login-email">
                    Admin email
                  </label>
                  <input
                    id="admin-login-email"
                    type="email"
                    className="cs_form_field"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="cs_input_label cs_heading_color" htmlFor="admin-login-password">
                    Password
                  </label>
                  <input
                    id="admin-login-password"
                    type="password"
                    className="cs_form_field"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
                <div className="cs_height_18" />
                <button type="submit" className="cs_btn cs_style_1 w-100">
                  <span>Sign in as admin</span>
                  <i>
                    <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                    <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                  </i>
                </button>
                <p className="cs_login_register_link mt-4 mb-0 text-center">
                  <Link to="/login" className="cs_accent_color">
                    ← Back to user login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
