import { iocHook } from "@di";

import { IDevicesStore } from "../Devices.types";

export const useDevicesStore = iocHook(IDevicesStore);
