import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { message, Modal } from 'antd';
import { getEducationList, getMyEnrollments, enroll, updateAccess } from '../../services/educationService';
import { useAuth } from '../../contexts/AuthContext';
import { CourseCard, WebinarCard, InfographicCard, PodcastCard } from './ContentCard';

const CATEGORY_MAP = {
  courses: 'course',
  webinars: 'webinar',
  infographics: 'infographic',
  podcasts: 'podcast',
};

const EMPTY_MSG = 'Content coming soon — check back shortly.';

export default function TabContent({ tabKey, webinarFilter }) {
  const { isSuperAdmin } = useAuth();
  const [list, setList] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [infographicLightboxUrl, setInfographicLightboxUrl] = useState(null);

  const category = CATEGORY_MAP[tabKey];

  const loadEnrollments = useCallback(() => {
    getMyEnrollments()
      .then((arr) => setEnrolledIds(new Set(arr.map((e) => e.educationId))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    getEducationList({ category })
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [category]);

  useEffect(() => {
    loadEnrollments();
  }, [loadEnrollments]);

  const handleEnroll = (item) => {
    setEnrollingId(item.id);
    enroll(item.id)
      .then(() => {
        setEnrolledIds((prev) => new Set([...prev, item.id]));
      })
      .catch((err) => {
        message.error(err?.message || 'Enrollment failed. Please try again.');
      })
      .finally(() => setEnrollingId(null));
  };

  const handleAccess = (item) => {
    updateAccess(item.id).catch(() => {});
    if (item.contentLink) window.open(item.contentLink, '_blank');
  };

  const handleViewInfographic = (item) => {
    updateAccess(item.id).catch(() => {});
    if (item.contentLink) setInfographicLightboxUrl(item.contentLink);
  };

  const handleAddToCalendar = (item) => {
    if (item.scheduledAt) {
      const start = new Date(item.scheduledAt);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(item.title)}&dates=${start.toISOString().replace(/[-:]/g, '').slice(0, 15)}/${end.toISOString().replace(/[-:]/g, '').slice(0, 15)}`;
      window.open(url, '_blank');
    }
  };

  let displayList = list;
  if (tabKey === 'webinars' && webinarFilter && webinarFilter !== 'all') {
    const isLive = webinarFilter === 'live';
    displayList = list.filter((i) => (i.type === 'live') === isLive);
  }

  if (loading) {
    return (
      <div className="cs_edu_hub_content_loading">
        <Icon icon="mdi:loading" className="cs_edu_hub_loading_icon" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!displayList.length) {
    return (
      <div className="cs_edu_hub_content_empty">
        <Icon icon="mdi:folder-open-outline" className="cs_edu_hub_empty_icon" />
        <p className="cs_edu_hub_empty_text">{EMPTY_MSG}</p>
      </div>
    );
  }

  const common = {
    onEnroll: handleEnroll,
    loading: enrollingId !== null,
  };

  const hasAccess = (item) => enrolledIds.has(item.id) || (isSuperAdmin && item.contentLink);

  return (
    <div className="cs_edu_hub_content_grid">
      {tabKey === 'courses' &&
        displayList.map((item) => (
          <CourseCard
            key={item.id}
            item={item}
            enrolled={hasAccess(item)}
            onContinue={handleAccess}
            {...common}
          />
        ))}
      {tabKey === 'webinars' &&
        displayList.map((item) => (
          <WebinarCard
            key={item.id}
            item={item}
            enrolled={hasAccess(item)}
            onWatch={handleAccess}
            onAddToCalendar={handleAddToCalendar}
            {...common}
          />
        ))}
      {tabKey === 'infographics' &&
        displayList.map((item) => (
          <InfographicCard
            key={item.id}
            item={item}
            enrolled={hasAccess(item)}
            onView={handleViewInfographic}
            {...common}
          />
        ))}
      {tabKey === 'podcasts' &&
        displayList.map((item) => (
          <PodcastCard
            key={item.id}
            item={item}
            enrolled={hasAccess(item)}
            onPlay={handleAccess}
            {...common}
          />
        ))}
      <Modal
        open={!!infographicLightboxUrl}
        onCancel={() => setInfographicLightboxUrl(null)}
        footer={null}
        width="90%"
        style={{ maxWidth: 900 }}
        centered
        destroyOnClose
      >
        {infographicLightboxUrl && (
          <img src={infographicLightboxUrl} alt="Infographic" style={{ width: '100%', height: 'auto', display: 'block' }} />
        )}
      </Modal>
    </div>
  );
}
