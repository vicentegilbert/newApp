import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  email: string = "";
  password: string = "";

  showPassword = false;

  constructor(
    private NavController: NavController,
    private userService: UserService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  async login() {

    const accessGranted = await this.userService.login(this.email, this.password);

    if (accessGranted) {
      this.email = '';
      this.password = '';
      this.NavController.navigateRoot('/home');
      console.log('Login exitoso');
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Correo o Contraseña Incorrectos!',
        buttons: ['OK']
      });
      await alert.present();
    }    
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
