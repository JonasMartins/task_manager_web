import { TaskBadge, TaskPriority } from "./consts";

export type Maybe<T> = T | null;
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    DateTime: any;
    Upload: any;
};

export type hashedPasswordType = {
    salt: string;
    hash: string;
};

export type errorResponse = {
    field: string;
    message: string;
};

export type User = {
    __typename?: "User";
    id: Scalars["ID"];
    name: string;
    email: string;
    password: string;
    picture: Maybe<string>;
    createdAt: Scalars["DateTime"];
    updatedAt: Scalars["DateTime"];
    tasks: Array<Task>;
};

export type Task = {
    __typename?: "Task";
    id: Scalars["ID"];
    title: string;
    description: string;
    priority: TaskPriority;
    badge: Maybe<TaskBadge>;
    done: boolean;
    creator: User;
    start: Scalars["DateTime"];
    finish: Scalars["DateTime"];
    createdAt: Scalars["DateTime"];
    updatedAt: Scalars["DateTime"];
};

export type DeletedType = {
    data: {
        deleted?: Maybe<boolean>;
        error?: Maybe<any>;
    };
};

export type TaskResponse = {
    data: {
        errors?: errorResponse[];
        task?: Task;
    };
};

export type TasksResponse = {
    data: {
        errors?: errorResponse[];
        tasks?: Array<Task>;
    };
};

export type UserResponse = {
    data: {
        errors?: errorResponse[];
        user?: User;
    };
};

export type LoginResponse = {
    data: {
        access_token?: string;
        errors?: errorResponse[];
    };
};
