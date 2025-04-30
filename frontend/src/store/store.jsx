import { configureStore } from '@reduxjs/toolkit';
import quotesReducer from '../slices/QuotesSlice';
import userReducer from '../slices/UserSlice';

const store = configureStore({
    reducer: {
        quotes: quotesReducer,
        user: userReducer,
    },
});

export default store;