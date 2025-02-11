import { createStore } from "redux";
import taskReducer from "./reducer";

const store = createStore(taskReducer);

export default store;