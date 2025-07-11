import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../core/Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  canActivate: CanActivateFn = () => {
    if (isPlatformBrowser(this.platformId) && this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  };
}