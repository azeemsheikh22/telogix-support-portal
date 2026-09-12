import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../features/categoriesSlice';
import productReducer from '../features/productSlice';
import reportReducer from '../features/reportsSlice';

const store = configureStore({
	reducer: {
		categories: categoriesReducer,
		products: productReducer,
		reports: reportReducer,
	},
});

export default store;
