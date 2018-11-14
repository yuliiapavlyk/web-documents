import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  isLogin = false;
  constructor(private router: Router,
    private authService: AuthService) { }

  logout() {
    this.authService.removeUserData();
    this.router.navigate(['/login']);
  }
}
