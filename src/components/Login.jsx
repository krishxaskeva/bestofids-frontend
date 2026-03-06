import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { pageTitle } from '../utils/PageTitle';
import { useAuth } from '../contexts/AuthContext';
import { getAssetUrl } from '../config';

export default function Login() {
  pageTitle('Login');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    login(email.trim(), password)
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch((err) => {
        setError(err.message || 'Invalid email or password. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="cs_login_page_wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="cs_contact_form cs_style_1 cs_white_bg cs_radius_30 cs_login_form">
              <div className="cs_login_card_logo_wrap">
                <img
                  src={getAssetUrl('/images/best-of-ids-logo.png')}
                  alt="Best of IDs"
                  className="cs_login_card_logo"
                />
              </div>
              <h2 className="cs_form_title cs_heading_color cs_fs_32 cs_semibold mb-4">
                Sign in to your account
              </h2>
              {error && (
                <div className="cs_login_error mb-3" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="cs_input_label cs_heading_color" htmlFor="login-email">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    className="cs_form_field"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="cs_input_label cs_heading_color" htmlFor="login-password">
                    Password
                  </label>
                  <input
                    id="login-password"
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
                <button type="submit" className="cs_btn cs_style_1 w-100" disabled={loading}>
                  <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                  <i>
                    <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                    <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                  </i>
                </button>
                <p className="cs_login_register_link mt-4 mb-0 text-center">
                  Don&apos;t have an account?{' '}
                  <Link to="/signup" className="cs_accent_color">
                    Sign up
                  </Link>
                </p>
                <div className="cs_login_admin_wrap text-center mt-3 pt-3 cs_login_register_link">
                  <Link
                    to="/login/admin"
                    className="cs_btn cs_btn_outline_primary cs_login_admin_btn"
                  >
                    Login as admin
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
