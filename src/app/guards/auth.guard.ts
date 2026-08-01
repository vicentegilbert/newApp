import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

function hasActiveSession(): boolean {
  return localStorage.getItem('user') !== null;
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  return hasActiveSession() || router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  return !hasActiveSession() || router.createUrlTree(['/home']);
};
