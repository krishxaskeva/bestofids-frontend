import React from 'react';
import { useAuth } from '../store/hooks';
import { pageTitle } from '../utils/PageTitle';
import MarketingView from './educationHub/MarketingView';
import HubTabsView from './educationHub/HubTabsView';

export default function EducationKnowledgeHub() {
  pageTitle('ID Education & Knowledge Hub');
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return isLoggedIn ? <HubTabsView /> : <MarketingView />;
}
