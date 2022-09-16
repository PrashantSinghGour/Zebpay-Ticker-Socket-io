import { Injectable } from '@angular/core';
import { addDoc, collection, doc, getDocs, getFirestore, } from 'firebase/firestore';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceRegistrationService {

  constructor(
    public mainService: MainService,
  ) { }


  async setDeviceReg(reg: any) {
    getFirestore()
    const app = this.mainService.firebaseInstance;
    const fireStore = getFirestore(app);
    const dbInstance = collection(fireStore, 'Registrations');

    const uniqueId = self.crypto.randomUUID();

    const existingId = localStorage.getItem('uId');
    if (existingId) {
      return;
    }

    localStorage.setItem('uId', uniqueId);
    addDoc(dbInstance, {
      deviceId: uniqueId,
      reg
    }).then(() => {
      console.log('data sent for reg!');
    }).catch((err: any) => {
      console.error(err);
    });

    getDocs(dbInstance)
      .then((response) => {
        const data = [...response.docs.map((item) => {
          return { ...item.data(), id: item.id }
        })]
      });
  }

}
