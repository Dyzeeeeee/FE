self.addEventListener('push', function (event) {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: data.icon,
        badge: data.icon, // Badge for small icon (optional)
        data: { url: data.url }, // Open a URL when the notification is clicked
        actions: [{ action: 'open', title: 'Open App' }]
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification click event
self.addEventListener('notificationclick', function (event) {
    event.notification.close(); // Close the notification
    event.waitUntil(
        clients.openWindow(event.notification.data.url) // Open the URL
    );
});
