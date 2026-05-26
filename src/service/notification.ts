import { apiCall } from "../config/axios";

export async function saveDeviceToken(deviceToken: string, userId: string) {
  return apiCall.post("/notification/save-device-token", {
    deviceToken,
    userId,
  });
}

export async function subscribeToTopic(token: string, topic: string) {
  return apiCall.post("/notification/subscribe-topic", {
    token,
    topic,
  });
}
