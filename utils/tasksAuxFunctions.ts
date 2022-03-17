import { TaskBadge } from "./consts";
import { Task as TaskType } from "./../utils/types";

export const getBadgeColor = (badge: TaskBadge | null): string => {
    if (!badge) {
        return "grey.100";
    }
    let color = "";

    switch (badge) {
        case TaskBadge.BLUE:
            color = "blue.400";
            break;
        case TaskBadge.GREEN:
            color = "green";
            break;
        case TaskBadge.ORANGE:
            color = "orange";
            break;
        case TaskBadge.RED:
            color = "red";
            break;
        case TaskBadge.YELLOW:
            color = "yellow.300";
            break;
        default:
            color = "grey.100";
    }
    return color;
};

export const filterTasksByBadge = (
    index: number,
    tasks: Array<TaskType>
): Array<TaskType> => {
    switch (index) {
        case 0:
            return tasks;
        case 1:
            return tasks.filter((x) => !x.badge);
        case 2:
            return tasks.filter((x) => x.badge === TaskBadge.RED);
        case 3:
            return tasks.filter((x) => x.badge === TaskBadge.ORANGE);
        case 4:
            return tasks.filter((x) => x.badge === TaskBadge.YELLOW);
        case 5:
            return tasks.filter((x) => x.badge === TaskBadge.GREEN);
        case 6:
            return tasks.filter((x) => x.badge === TaskBadge.BLUE);

        default:
            return tasks;
    }
};

export const filterByTitle = (term: string, tasks: Array<TaskType>) => {
    return tasks.filter((x) =>
        x.title.toLowerCase().includes(term.toLowerCase())
    );
};
