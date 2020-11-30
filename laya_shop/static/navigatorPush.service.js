var getTitle = function (title) {
        if (title === "") {
                title = "TITLE DEFAULT";
        }
        return title;
};
var getNotificationOptions = function (message, message_tag) {
        var options = {
                body: message,
                tag: message_tag,
                vibrate: [200, 100, 200, 100, 200, 100, 200]
        };
        return options;
};

self.addEventListener('install', function (event) {
        self.skipWaiting();
});

self.addEventListener('push', function(event) {
        try {
                console.log('PUSH NOTIFICATION')
                // Push is a JSON
                var response_json = event.data.json();
                var title = response_json.title;
                var message = response_json.message;
                var message_tag = response_json.tag;
        } catch (err) {
                // Push is a simple text
                console.log(err)
        }
         const message = JSON.parse(event.data.text())
        self.registration.showNotification(getTitle(title), getNotificationOptions(message.message, ''));
        // Optional: Comunicating with our js application. Send a signal
        self.clients.matchAll({includeUncontrolled: true, type: 'window'})
        .then(function (clients) {
                clients.forEach(function (client) {
                        client.postMessage({
                                "data": '',
                                "data_title": message.title,
                                "data_body": message.message});
                        });
        });
});

// Optional: Added to that the browser opens when you click on the notification push web.
self.addEventListener('notificationclick', function(event) {
        // Android doesn't close the notification when you click it
        // See http://crbug.com/463146
        event.notification.close();
        // Check if there's already a tab open with this URL.
        // If yes: focus on the tab.
        // If no: open a tab with the URL.
        event.waitUntil(clients.matchAll({type: 'window', includeUncontrolled: true})
        .then(function(windowClients) {
                        for (var i = 0; i < windowClients.length; i++) {
                                var client = windowClients[i];
                                if ('focus' in client) {
                                        return client.focus();
                                }
                        }
                })
        );
})