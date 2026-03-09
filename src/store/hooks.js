import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { getStoredToken } from '../api/client';
import {
  fetchMe,
  loginUser,
  loginAdmin,
  signupUser,
  logout as logoutAction,
  setLoadingFalse,
} from './slices/authSlice';
import {
  addPost as addPostAction,
  updatePost as updatePostAction,
  deletePost as deletePostAction,
  setPosts as setPostsAction,
  selectPublishedPosts,
  CATEGORIES,
} from './slices/patientCareSlice';

// ----- Auth selectors -----
const selectUser = (state) => state.auth.user;
const selectAuthLoading = (state) => state.auth.loading;
const selectAuthError = (state) => state.auth.error;

/**
 * useAuth – Redux-backed hook with same API as old AuthContext.
 * Use this instead of contexts/AuthContext.
 */
export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const isSuperAdmin = user?.role === 'admin';
  const isLoggedIn = !!user;
  const isAuthenticated = isLoggedIn;
  const role = user?.role ?? null;
  const token = getStoredToken();

  const login = useCallback(
    async (email, password) => {
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)) return result.payload;
      throw new Error(result.payload || 'Login failed');
    },
    [dispatch]
  );

  const adminLogin = useCallback(
    async (email, password) => {
      const result = await dispatch(loginAdmin({ email, password }));
      if (loginAdmin.fulfilled.match(result)) return result.payload;
      throw new Error(result.payload || 'Admin login failed');
    },
    [dispatch]
  );

  const signup = useCallback(
    async (name, email, password, roleType, phone) => {
      const result = await dispatch(
        signupUser({ name, email, password, roleType, phone })
      );
      if (signupUser.fulfilled.match(result)) return result.payload;
      throw new Error(result.payload || 'Signup failed');
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const loginAsSuperAdmin = () => {};
  const loginAsMember = () => {};

  return {
    user,
    token,
    isAuthenticated,
    role,
    loading,
    isSuperAdmin,
    isLoggedIn,
    error,
    loginAsSuperAdmin,
    loginAsMember,
    login,
    adminLogin,
    signup,
    logout,
  };
}

/**
 * usePatientCare – Redux-backed hook with same API as old PatientCareContext.
 * Use this instead of contexts/PatientCareContext.
 */
export function usePatientCare() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.patientCare.posts);
  const publishedPosts = useSelector(selectPublishedPosts);

  const addPost = useCallback(
    (post) => {
      const id = String(Date.now());
      dispatch(addPostAction({ ...post, id }));
      return id;
    },
    [dispatch]
  );

  const updatePost = useCallback(
    (id, updates) => {
      dispatch(updatePostAction({ id, updates }));
    },
    [dispatch]
  );

  const deletePost = useCallback(
    (id) => {
      dispatch(deletePostAction(id));
    },
    [dispatch]
  );

  const setPosts = useCallback(
    (newPosts) => {
      dispatch(setPostsAction(newPosts));
    },
    [dispatch]
  );

  const getPostById = useCallback(
    (id) => posts.find((p) => p.id === id),
    [posts]
  );

  return {
    posts,
    setPosts,
    addPost,
    updatePost,
    deletePost,
    getPostById,
    getPublishedPosts: () => publishedPosts,
    categories: CATEGORIES,
  };
}

/**
 * Run once on app mount: if token exists, fetch current user; else set loading false.
 */
export function useAuthInit() {
  const dispatch = useDispatch();
  const runOnce = useCallback(() => {
    if (getStoredToken()) {
      dispatch(fetchMe());
    } else {
      dispatch(setLoadingFalse());
    }
  }, [dispatch]);
  return runOnce;
}
