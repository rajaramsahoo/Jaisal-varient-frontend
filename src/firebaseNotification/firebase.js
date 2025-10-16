// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBL_lfEbRQx76o7-GO1wtqmIQuDHfc2z94",
  authDomain: "jaisal-pushnotification.firebaseapp.com",
  projectId: "jaisal-pushnotification",
  storageBucket: "jaisal-pushnotification.appspot.com",
  messagingSenderId: "573677234040",
  appId: "1:573677234040:web:89a91171704cbaad9c0a8d",
  measurementId: "G-43PTFRSF3D",
};

//  VAPID key for web push
const vapidKey = "BJupG4GD2be5k5BQeZ6DKYnyVXe24sgYnND8sLEjfzyyo1FhWI9GO_6SwsOm1QxPtJ14HiYW2AUWKYD_Mq3zrNQ";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize messaging
const messaging = getMessaging(app);

// Function to request and get FCM token
export const requestFcmToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const currentToken = await getToken(messaging, { vapidKey });
      if (currentToken) {
        // console.log("FCM Token:", currentToken);
        return currentToken;
      } else {
        console.log("No registration token available. Request permission to generate one.");
        return null;
      }
    } else {
      console.log("Notification permission not granted.");
      return null;
    }
  } catch (err) {
    console.error("An error occurred while retrieving token. ", err);
    return null;
  }
};
