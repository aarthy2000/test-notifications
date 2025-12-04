// sw.js - Service Worker

// Listen for push events
self.addEventListener("push", event => {
  console.log("Push event received:", event);

  let data = {};
  if (event.data) {
    try {
      data = event.data.json(); // Parse JSON payload
    } catch (err) {
      console.error("Failed to parse push data:", err);
      data = { title: "Default title", body: "No message payload" };
    }
  } else {
    data = { title: "Default title", body: "No message payload" };
  }

  const title = data.title || "Notification";
  const options = {
    body: data.body || "You have a new message.",
    icon: data.icon || "/icon.png",       // optional
    badge: data.badge || "/badge.png",    // optional
    data: data.url || "/"                 // optional, for click handling
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener("notificationclick", event => {
  console.log("Notification click received:", event.notification);

  event.notification.close();

  const url = event.notification.data || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(windowClients => {
      // Focus existing tab if open
      for (let client of windowClients) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      // Otherwise, open new tab
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// Optional: handle notification close
self.addEventListener("notificationclose", event => {
  console.log("Notification closed:", event.notification);
});
