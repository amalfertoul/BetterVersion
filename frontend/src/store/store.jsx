import { configureStore } from '@reduxjs/toolkit';
import quotesReducer from '../slices/QuotesSlice';
import usersReducer from '../slices/UserSlice';
import taskSlice from '../slices/taskSlice';
import userPerformanceSlice from '../slices/userPerformanceSlice';
import imagesSlice from '../slices/imagesSlice';
import visionBoardSlice from '../slices/visionBoardSlice';
import gamesReducer from '../slices/gamesSlice';
import gameUserSlice from '../slices/gameUserSlice';
import categorySlice from '../slices/categorySlice';
import friendRequestsSlice from '../slices/friendRequestSlice'; 
import messageSlice from '../slices/messageSlice'; 

const store = configureStore({
    reducer: {
        quotes: quotesReducer,
        users: usersReducer,
        task : taskSlice,
        userPerformance: userPerformanceSlice,
        images: imagesSlice,
        visionBoard: visionBoardSlice,
        games: gamesReducer,
        gameUser: gameUserSlice,
        categories: categorySlice,
        friendRequests: friendRequestsSlice, 
        messages: messageSlice, 
        // ida makontchi meayta n gae slices awla meaytalom ghalat fixiw omor cz eaqli 7fali

    },
});

export default store;