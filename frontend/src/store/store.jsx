import { configureStore } from '@reduxjs/toolkit';
import quotesReducer from '../slices/QuotesSlice';
import usersReducer from '../slices/UserSlice';
import taskSlice from '../slices/taskSlice';
import userPerformanceSlice from '../slices/userPerformanceSlice';
import imagesSlice from '../slices/imagesSlice';
import visionBoardSlice from '../slices/visionBoardSlice';

const store = configureStore({
    reducer: {
        quotes: quotesReducer,
        users: usersReducer,
        task : taskSlice,
        userPerformance: userPerformanceSlice,
        images: imagesSlice,
        visionBoard: visionBoardSlice,
    },
});

export default store;