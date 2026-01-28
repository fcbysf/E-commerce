import Echo from "laravel-echo";
import Pusher from "pusher-js";
window.Pusher = Pusher;

export const createEcho = (token) => {
  return new Echo({
    broadcaster: "reverb",
    key: '9qksayzr2quzrtiwi4jo',
    wsHost: import.meta.env.VITE_REVERB_HOST ?? "localhost",
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    forceTLS: false,
    enabledTransports: ["ws"],
    authEndpoint: "http://localhost:8000/api/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};
