import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton,
  IonIcon, IonText, IonLoading, AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline, personAddOutline, mailOutline } from 'ionicons/icons';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton,
    IonIcon, IonText, IonLoading
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  emailControl = new FormControl('', [Validators.required, Validators.email]);
  isLoading = false;

  constructor() {
    addIcons({ logInOutline, personAddOutline, mailOutline });
  }



  onSubmit(event: Event) {
    event.preventDefault();
    if (this.emailControl.invalid) return;

    const email = this.emailControl.value!;
    this.isLoading = true;

    this.authService.findUser(email)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (user) => {
          if (user) {
            this.authService.setCurrentUser(user);
            this.router.navigate(['/tasks']);
          } else {
            this.promptCreateUser(email);
          }
        },
        error: async (err) => {
          const alert = await this.alertCtrl.create({
            header: 'Connection Error',
            message: 'An error occurred while connecting to the server.',
            buttons: ['OK']
          });
          await alert.present();
          console.error(err);
        }
      });
  }

  async promptCreateUser(email: string) {
    const alert = await this.alertCtrl.create({
      header: 'Create a new user',
      message: `The email ${email} is not registered. Do you want to register it now?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Yes, register it!',
          handler: () => {
            this.registerUser(email);
          }
        }
      ]
    });

    await alert.present();
  }

  private registerUser(email: string) {
    this.isLoading = true;
    this.authService.createUser(email)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: async (user) => {
          this.authService.setCurrentUser(user);
          
          const toast = await this.toastCtrl.create({
            message: 'User registered successfully!',
            duration: 2000,
            color: 'success',
            position: 'bottom'
          });
          await toast.present();
          
          this.router.navigate(['/tasks']);
        },
        error: async () => {
          const alert = await this.alertCtrl.create({
            header: 'Error',
            message: 'Could not create user. Please try again.',
            buttons: ['OK']
          });
          await alert.present();
        }
      });
  }
}
