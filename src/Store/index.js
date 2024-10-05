import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './Slices/RootReducers';

const store = configureStore({
    reducer: rootReducer
});

export default store;