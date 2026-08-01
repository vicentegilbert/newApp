import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {

  showPassword = false;

  user = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9Kk]{1}"), this.validateRUT()]),
    name: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-zÑñ]+(\\s[A-Za-zÑñ]+)*$")]),
    lastName: new FormControl('', [Validators.required, Validators.pattern("^[A-Za-zÑñ]+(\\s[A-Za-zÑñ]+)*$")]),
    gender: new FormControl('', [Validators.required]), 
    dateOfBirth: new FormControl('', [Validators.required]),
    email: new FormControl('',[Validators.required, Validators.pattern("[A-Za-zÑñ0-9.]+(@gmail.com)")]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
    confirmPassword: new FormControl('', [Validators.required]),
    userType: new FormControl('User'),
  });

  constructor(
    private router: Router,
    private alertController: AlertController,
    private userService: UserService
  ) { }

  ngOnInit() {
  }
  
  async register() {
    const rut = this.user.controls.rut.value;
    const correo = this.user.controls.email.value;
  
    // Verificar si el usuario tiene 18 años o más
    if (!this.validateAge18(this.user.controls.dateOfBirth.value || "")) {
      await this.showAlert("Error", "Debe ser mayor de 18 años para registrarse!");
      return;
    }
  
    // Verificar si las contraseñas coinciden
    if (this.user.controls.password.value !== this.user.controls.confirmPassword.value) {
      await this.showAlert("Error", "Las contraseñas no coinciden!");
      return;
    }
  
    // Si todo es correcto, crear el usuario
    if (await this.userService.createUser(this.user.value)) {
      await this.showAlert("Éxito", "Usuario creado con éxito!");
      
      // Guardar en localStorage después de un registro exitoso
      const saveUser = this.user.value;
      localStorage.setItem('usuario', JSON.stringify(saveUser));
      this.user.reset();
  
      // Redirigir al login después de un registro exitoso
      this.router.navigate(['/login']);
    } else {
      await this.showAlert("Error", "No se pudo crear el Usuario");
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validateAge18(dateOfBirth: string){
    var edad = 0;
    if(dateOfBirth){
      const fecha_date = new Date(dateOfBirth);
      const timeDiff = Math.abs(Date.now() - fecha_date.getTime());
      edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    }
    return edad >= 18;
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  validateRUT(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const rutValue = control.value;
      if (!rutValue) return null;

      const [rutBody, dvIngresado] = rutValue.split('-');
      if (!rutBody || !dvIngresado) return { invalidRUT: true };

      const dvCalculado = this.calculateDV(rutBody);
      return dvCalculado.toLowerCase() === dvIngresado.toLowerCase() ? null : { invalidRUT: true };
    };
  }

  calculateDV(rut: string): string {
    let addition = 0;
    let multiplier = 2;

    for (let i = rut.length - 1; i >= 0; i--) {
      addition += parseInt(rut[i], 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const resto = 11 - (addition % 11);
    if (resto === 11) return '0';
    if (resto === 10) return 'K';
    return resto.toString();
  }
}
