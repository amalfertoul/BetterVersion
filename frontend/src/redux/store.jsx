import { createStore, combineReducers } from "redux";
import bookmarkReducer from "./bookmarkReducer";
import taskReducer from "./taskReducer";


const rootReducer = combineReducers({
  bookmark: bookmarkReducer,
  task: taskReducer,
});

const store = createStore(rootReducer);

export default store;
