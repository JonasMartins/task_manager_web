import { TaskBadge } from "./consts";

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
