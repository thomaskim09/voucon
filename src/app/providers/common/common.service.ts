import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    public toastCtrl: ToastController,
    public alertCtrl: AlertController) { }

  async presentToast(title) {
    const toast = await this.toastCtrl.create({
      message: title,
      duration: 2500,
      position: 'top'
    });
    toast.present();
  }

  async presentAlert() {
    return new Promise(async resolve => {
      const alert = await this.alertCtrl.create({
        header: 'Confirm?',
        message: 'Click confirm to start action',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => resolve(false)
          },
          {
            text: 'Okay',
            handler: () => resolve(true)
          }
        ]
      });
      await alert.present();
    });
  }
}
