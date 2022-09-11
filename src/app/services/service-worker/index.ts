const check = () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('No Service Worker support!')
  }
  //Push not using
  // if (!('PushManager' in window)) {
  //   throw new Error('No Push API Support!')
  // }
}

// I added a function that can be used to register a service worker.
const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register("/assets/service.js"); //notice the file name
  return swRegistration;
}

const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission();
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification');
  }
}

const showLocalNotification = async (title: any, body: any) => {
  const swRegistration = await registerServiceWorker();
  const options: NotificationOptions = {
    body,
    vibrate: [200, 100, 200],
    icon: '/assets/icons/icon-48x48.png'
    // here you can add more properties like icon, image, vibrate, etc.
  };
  swRegistration.showNotification(title, options);
}


const initializeNotification = async () => {
  check();
  const permission = await requestNotificationPermission();
  // const interval = setInterval(() => {
  //   showLocalNotification('This is title', 'this is the message');
  //   clearInterval(interval);
  // }, 1000 * 60 * 5);
}


export { initializeNotification, showLocalNotification, registerServiceWorker };

