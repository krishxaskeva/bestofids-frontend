import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'bestofids_patient_care_posts';

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

/** Standalone getter for published posts (e.g. api/patientCare). Same filter as selectPublishedPosts. */
export function getPatientCarePostsFromStorage() {
  return loadFromStorage().filter(
    (p) => p.status === 'published' && p.showInWebsite !== false
  );
}

function saveToStorage(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.warn('Failed to save patient care posts', e);
  }
}

export const CATEGORIES = [
  { value: 'Health Tips', label: 'Health Tips', color: 'green' },
  { value: 'Patient Guidelines', label: 'Patient Guidelines', color: 'blue' },
  { value: 'Announcements', label: 'Announcements', color: 'orange' },
  { value: 'Awareness Campaigns', label: 'Awareness Campaigns', color: 'purple' },
  { value: 'Treatment Updates', label: 'Treatment Updates', color: 'cyan' },
];

const patientCareSlice = createSlice({
  name: 'patientCare',
  initialState: {
    posts: loadFromStorage(),
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      saveToStorage(state.posts);
    },
    addPost: (state, action) => {
      const post = action.payload;
      const id = post.id || String(Date.now());
      const newPost = {
        ...post,
        id,
        createdAt: post.createdAt || new Date().toISOString().slice(0, 10),
      };
      state.posts = [newPost, ...state.posts];
      saveToStorage(state.posts);
    },
    updatePost: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.posts.findIndex((p) => p.id === id);
      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...updates };
        saveToStorage(state.posts);
      }
    },
    deletePost: (state, action) => {
      const id = action.payload;
      state.posts = state.posts.filter((p) => p.id !== id);
      saveToStorage(state.posts);
    },
  },
});

export const { setPosts, addPost, updatePost, deletePost } = patientCareSlice.actions;
export default patientCareSlice.reducer;

/** Selector: get post by id */
export const selectPostById = (state, id) =>
  state.patientCare.posts.find((p) => p.id === id);

/** Selector: published posts with showInWebsite true */
export const selectPublishedPosts = (state) =>
  state.patientCare.posts.filter(
    (p) => p.status === 'published' && p.showInWebsite !== false
  );
