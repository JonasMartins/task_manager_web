import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { reducers } from "./Global/GlobalReducer";

export const store = createStore(reducers, {}, applyMiddleware(thunk));
