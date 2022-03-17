import { Action } from "./../actions";
import { GlobalTypes } from "./../types";
import { combineReducers } from "redux";
import { Task } from "../../utils/types";

export interface globalState {
    updatedTask: Task | null;
    deletedTaskId: string | null;
}
const initialState = {
    deletedTaskId: "",
    updatedTask: null,
};

export const globalReducer = (
    state: globalState = initialState,
    action: Action
) => {
    switch (action.type) {
        case GlobalTypes.HAS_UPDATED_A_TASK: {
            return { ...state, updatedTask: action.payload };
        }
        case GlobalTypes.HAS_DELETED_A_TASK: {
            return { ...state, deletedTask: action.payload };
        }
        default:
            return state;
    }
};

export const reducers = combineReducers({
    globalReducer,
});

export type RootState = ReturnType<typeof reducers>;
