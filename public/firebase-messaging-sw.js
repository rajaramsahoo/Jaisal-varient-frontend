// /* eslint-disable no-undef */
// importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// firebase.initializeApp({
//   apiKey: "AIzaSyBL_lfEbRQx76o7-GO1wtqmIQuDHfc2z94",
//   authDomain: "jaisal-pushnotification.firebaseapp.com",
//   projectId: "jaisal-pushnotification",
//   storageBucket: "jaisal-pushnotification.firebasestorage.app",
//   messagingSenderId: "573677234040",
//   appId: "1:573677234040:web:89a91171704cbaad9c0a8d",
//   measurementId: "G-43PTFRSF3D"
// });


// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
// //   const { title, body } = payload.notification;
// //   self.registration.showNotification(title, {
// //     body,
// //     icon: '/firebase-logo.png' // replace with your app icon
// //   });
// });


/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBL_lfEbRQx76o7-GO1wtqmIQuDHfc2z94",
  authDomain: "jaisal-pushnotification.firebaseapp.com",
  projectId: "jaisal-pushnotification",
  storageBucket: "jaisal-pushnotification.firebasestorage.app",
  messagingSenderId: "573677234040",
  appId: "1:573677234040:web:89a91171704cbaad9c0a8d",
  measurementId: "G-43PTFRSF3D"
});

const messaging = firebase.messaging();

// Handle background messages with data-only payload
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const title = payload.data?.title || 'New Notification';
  const options = {
    body: payload.data?.body || '',
    icon: '/logo.png',
    data: {
      click_action: payload.data?.click_action || '/',
      target: payload.data?.target || '/'
    }
  };

  self.registration.showNotification(title, options);
});

// Handle notification click to redirect
self.addEventListener('notificationclick', function(event) {
  const data = event.notification.data || {};
  const url = data.target || '/';

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
