import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return true;
  }
  Swal.fire({
    position: "top-end",
    icon: "error",
    title: "AuthGuard",
    text: "You must be logged in to access this page!.",
    showConfirmButton: false,
    timer: 5000
  });
  return router.parseUrl('/login');
};
