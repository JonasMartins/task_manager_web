import { Task } from "../utils/types";
import { GlobalTypes } from "./types";

export type UpdateTask = {
    type: typeof GlobalTypes.HAS_UPDATED_A_TASK;
    payload: Task;
};

export type DeleteTask = {
    type: typeof GlobalTypes.HAS_DELETED_A_TASK;
    payload: string;
};

export type SetUpdateTaskCount = {
    type: typeof GlobalTypes.HAS_UPDATED_TASK_COUNT;
    payload: number;
};

export type Action = UpdateTask | SetUpdateTaskCount | DeleteTask;

export * as actionCreators from "./actionCreators";
