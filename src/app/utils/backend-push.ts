import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from "src/environments/environment";
import { registerServiceWorker, showLocalNotification } from "../services/service-worker";
export class BackendPush {
  constructor() { }


  async requestPermission() {
    const messaging = getMessaging();
    const swReg = await registerServiceWorker();
    getToken(messaging,
      { vapidKey: environment.firebase.vapidKey, serviceWorkerRegistration: swReg }).then(
        (currentToken) => {
          if (currentToken) {
            console.log("Hurraaa!!! we got the token.....");
            console.log(currentToken);
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
        });
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, ({ notification }) => {

      showLocalNotification(notification?.title, notification?.body);
      console.log('Message received. ', notification);
    });
  }
}
