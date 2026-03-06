import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'bestofids_patient_care_posts';

const PatientCareContext = createContext(null);

const CATEGORIES = [
  { value: 'Health Tips', label: 'Health Tips', color: 'green' },
  { value: 'Patient Guidelines', label: 'Patient Guidelines', color: 'blue' },
  { value: 'Announcements', label: 'Announcements', color: 'orange' },
  { value: 'Awareness Campaigns', label: 'Awareness Campaigns', color: 'purple' },
  { value: 'Treatment Updates', label: 'Treatment Updates', color: 'cyan' },
];

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return [];
}

function saveToStorage(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.warn('Failed to save patient care posts', e);
  }
}

export function PatientCareProvider({ children }) {
  const [posts, setPosts] = useState(loadFromStorage);

  useEffect(() => {
    saveToStorage(posts);
  }, [posts]);

  const addPost = useCallback((post) => {
    const newPost = {
      ...post,
      id: String(Date.now()),
      createdAt: post.createdAt || new Date().toISOString().slice(0, 10),
    };
    setPosts((prev) => [newPost, ...prev]);
    return newPost.id;
  }, []);

  const updatePost = useCallback((id, updates) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deletePost = useCallback((id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getPostById = useCallback(
    (id) => posts.find((p) => p.id === id),
    [posts]
  );

  /** Published posts with showInWebsite true - for website display & GET /api/patient-care */
  const getPublishedPosts = useCallback(() => {
    return posts.filter(
      (p) => p.status === 'published' && p.showInWebsite !== false
    );
  }, [posts]);

  const value = {
    posts,
    setPosts,
    addPost,
    updatePost,
    deletePost,
    getPostById,
    getPublishedPosts,
    categories: CATEGORIES,
  };

  return (
    <PatientCareContext.Provider value={value}>
      {children}
    </PatientCareContext.Provider>
  );
}

export function usePatientCare() {
  const ctx = useContext(PatientCareContext);
  if (!ctx) {
    throw new Error('usePatientCare must be used within PatientCareProvider');
  }
  return ctx;
}

/** API-style getter for website / external use (e.g. GET /api/patient-care in a real app) */
export function getPatientCarePosts() {
  return loadFromStorage().filter(
    (p) => p.status === 'published' && p.showInWebsite !== false
  );
}

export { CATEGORIES };
