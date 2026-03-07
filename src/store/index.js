import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patientCareReducer from './slices/patientCareSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patientCare: patientCareReducer,
  },
});
