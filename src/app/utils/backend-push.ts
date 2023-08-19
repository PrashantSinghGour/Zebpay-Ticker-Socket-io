import { Injectable } from "@angular/core";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from "src/environments/environment";
import { DeviceRegistrationService } from "../services/device-registration.service";
import { MainService } from "../services/main.service";
import { registerServiceWorker, showLocalNotification } from "../services/service-worker";

@Injectable({
  providedIn: 'root'
})
export class BackendPush {
  constructor(
    private mainService: MainService,
    private devReg: DeviceRegistrationService
  ) { }


  async requestPermission() {
    const messaging = getMessaging();
    const swReg = await registerServiceWorker();
    getToken(messaging,
      { vapidKey: environment.firebase.vapidKey, serviceWorkerRegistration: swReg }).then(
        (currentToken) => {
          if (currentToken) {
            this.devReg.setDeviceReg(currentToken);
            this.mainService.deviceRegId = currentToken;
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
    });
  }
}
