import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router,
        private authService: AuthService) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (this.authService.isLogined()) {
            if (state.url === '/signin' || state.url === '/') {
                this.router.navigate(['/docs']);
                return false;
            }
            return true;
        }
        if (state.url === '/docs') {
            this.router.navigate(['/not-auth']);
            return false;
        }
        if (state.url === '/') {
            this.router.navigate(['/']);
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }
}