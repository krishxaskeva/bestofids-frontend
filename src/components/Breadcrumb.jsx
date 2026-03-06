import React, { useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function Breadcrumb({ title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(true);

  useEffect(() => {
    // Track if we can go back (disable only on home page if no history)
    const isHomePage = location.pathname === '/';
    setCanGoBack(!isHomePage || window.history.length > 1);
  }, [location]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <div className="cs_breadcrumb_row">
        <button
          type="button"
          onClick={handleBack}
          className={`cs_breadcrumb_back ${!canGoBack ? 'disabled' : ''}`}
          disabled={!canGoBack}
          aria-label="Go back"
        >
          <Icon icon="fa6-solid:arrow-left" aria-hidden />
          <span>Back</span>
        </button>
        <span className="cs_breadcrumb_sep" aria-hidden> &gt; </span>
        <h1 className="cs_breadcrumb_title cs_accent_color mb-0">{title}</h1>
      </div>
    </div>
  );
}
