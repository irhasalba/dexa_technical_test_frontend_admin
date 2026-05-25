import { apiCall } from "../config/axios";

export async function subscribeToTopic(token: string, topic: string) {
  return apiCall.post("/notification/subscribe-topic", {
    token,
    topic,
  });
}
