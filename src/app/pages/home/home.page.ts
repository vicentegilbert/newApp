import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  user: any;

  constructor(
      private navCtrl: NavController,
      private alertController: AlertController
  ) { }

  ngOnInit(){
    this.user = JSON.parse(localStorage.getItem("user") || '');
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?', 
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Logout cancelado');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            // Elimina el usuario del almacenamiento local
            localStorage.removeItem('user');
            // Redirige a la página de login
            this.navCtrl.navigateRoot('/login');
            console.log('Cerrando sesión...');
          }
        }
      ]
    });
    // Muestra la alerta
    await alert.present();
  }

}
