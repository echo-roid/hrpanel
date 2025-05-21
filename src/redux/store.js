// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './slices/employeeSlice';
import projectSelectionReducer from './slices/projectSelectionSlice';
import projectReducer from './slices/projectSlice';
import authReducer from './slices/authSlice';


const store = configureStore({
  reducer: {
    employee: employeeReducer,
    projectSelection: projectSelectionReducer,
    auth: authReducer,
    projects: projectReducer,
  },
});

export default store;
