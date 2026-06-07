import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular/standalone';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastCtrl = inject(ToastController);

  if (authService.isLoggedIn()) {
    return true;
  }

  toastCtrl.create({
    message: 'You must be logged in to access this page.',
    duration: 3000,
    color: 'danger',
    position: 'bottom'
  }).then(toast => toast.present());

  return router.parseUrl('/login');
};
