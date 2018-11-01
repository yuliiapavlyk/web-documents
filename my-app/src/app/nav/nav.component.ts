import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isLogin = false;
  constructor(private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.removeUserData();
    this.router.navigate(['/login']);
  }
}
