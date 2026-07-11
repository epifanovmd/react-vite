import { iocHook } from "@di";

import { INotificationService } from "./Notification.types";

export const useNotification = iocHook(INotificationService);
