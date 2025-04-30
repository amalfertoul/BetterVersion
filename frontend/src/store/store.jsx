import { configureStore } from '@reduxjs/toolkit';
import quotesReducer from '../slices/QuotesSlice';
import usersReducer from '../slices/UserSlice';

const store = configureStore({
    reducer: {
        quotes: quotesReducer,
        users: usersReducer,
    },
});

export default store;