import { GlobalTypes } from "./types";
import { Action } from "./actions";
import { Dispatch } from "redux";
import { Task } from "../utils/types";

export const setHasDeletedTask = (taskDeletedId: string) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type: GlobalTypes.HAS_DELETED_A_TASK,
            payload: taskDeletedId,
        });
    };
};

export const setHasUpdatedTask = (taskUpdated: Task) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type: GlobalTypes.HAS_UPDATED_A_TASK,
            payload: taskUpdated,
        });
    };
};
