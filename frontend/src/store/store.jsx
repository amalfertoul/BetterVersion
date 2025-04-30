import { configureStore } from '@reduxjs/toolkit';
import quotesReducer from '../slices/QuotesSlice';

const store = configureStore({
    reducer: {
        quotes: quotesReducer,
    },
});

export default store;