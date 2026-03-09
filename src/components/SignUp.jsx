import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { pageTitle } from '../utils/PageTitle';
import { getAssetUrl } from '../config';

export default function SignUp() {
  pageTitle('Sign up');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    // Placeholder: add your sign-up API call here
    navigate('/login', { replace: true });
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
                Create your account
              </h2>
              {error && (
                <div className="cs_login_error mb-3" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="cs_input_label cs_heading_color" htmlFor="signup-email">
                    Email
                  </label>
                  <input
                    id="signup-email"
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
                  <label className="cs_input_label cs_heading_color" htmlFor="signup-password">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    className="cs_form_field"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="cs_input_label cs_heading_color" htmlFor="signup-confirm-password">
                    Confirm password
                  </label>
                  <input
                    id="signup-confirm-password"
                    type="password"
                    className="cs_form_field"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="cs_height_18" />
                <button type="submit" className="cs_btn cs_style_1 w-100">
                  <span>Sign up</span>
                  <i>
                    <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                    <img src={getAssetUrl('/images/icons/arrow_white.svg')} alt="" aria-hidden />
                  </i>
                </button>
                <p className="cs_login_register_link mt-4 mb-0 text-center">
                  Already have an account?{' '}
                  <Link to="/login" className="cs_accent_color">
                    Sign in
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
