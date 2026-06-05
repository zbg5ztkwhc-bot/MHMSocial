importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:"AIzaSyB5nSGTgCt3NeRq8U1nLXDTRPDXbX3llVQ",
  authDomain:"mhmchat-c8ccf.firebaseapp.com",
  projectId:"mhmchat-c8ccf",
  storageBucket:"mhmchat-c8ccf.firebasestorage.app",
  messagingSenderId:"790097914100",
  appId:"1:790097914100:web:5ae7a123b140b158f096a1",
  databaseURL:"https://mhmchat-c8ccf-default-rtdb.firebaseio.com",
});

const messaging=firebase.messaging();

// Handle background FCM messages
messaging.onBackgroundMessage(payload=>{
  const title=payload.notification?.title||'MHMSocial';
  const body=payload.notification?.body||'You have a new notification';
  return self.registration.showNotification(title,{
    body,
    icon:'/icon-192.png',
    badge:'/icon-192.png',
    vibrate:[200,100,200,100,200],
    tag:'mhm-fcm',
    renotify:true,
    data:payload.data||{},
    actions:[{action:'open',title:'Open MHMSocial'}]
  });
});
