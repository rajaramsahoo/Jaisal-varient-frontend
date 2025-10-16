// utils/getDeviceId.js
import { v4 as uuidv4 } from "uuid";

export const getDeviceId = () => {
  try {
    let deviceId = localStorage.getItem("guest_device_id");

    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("guest_device_id", deviceId);
    }

    return deviceId;
  } catch (e) {
    console.error("Error accessing localStorage", e);
    return null;
  }
};
