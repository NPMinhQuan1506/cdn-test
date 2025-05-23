// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

//let tokenobj=author_get('fcm');
//let firebaseOBJ=JSON.parse(tokenobj);
//firebase.initializeApp({
//    'messagingSenderId': '303019108302'
//});
 
firebase.initializeApp({
    apiKey: "AIzaSyBHzJ84d6mWKl9q99LOZ0QJ2cjD3Ip3gSM",
    authDomain: "vttech-solution.firebaseapp.com",
    projectId: "vttech-solution",
    storageBucket: "vttech-solution.appspot.com",
    messagingSenderId: "303019108302",
    appId: "1:303019108302:web:1dd063f4a6ae760a7c6d9f",
    measurementId: "G-PZYWWSHF3X",
});

const messaging = firebase.messaging();

/**
 * Here is is the code snippet to initialize Firebase Messaging in the Service
 * Worker when your app is not hosted on Firebase Hosting.

 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here, other Firebase libraries
 // are not available in the service worker.
 

 // Initialize the Firebase app in the service worker by passing in the
 // messagingSenderId.
 

 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 // [END initialize_firebase_in_sw]
 **/


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
    debugger
    //console.log('[firebase-messaging-sw.js] Received background message ', payload);
    //// Customize notification here
    //const notificationTitle = 'Background Message Title';
    //const notificationOptions = {
    //    body: 'Background Message body.',
    //    icon: '/firebase-logo.png'
    //};

    //return self.registration.showNotification(notificationTitle,
    //   notificationOptions);
});
// [END background_handler]
