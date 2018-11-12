import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) {
    if (this.authService.isLogined()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
  }

  cancel(form?: NgForm): void {
    if (form != null) {
      form.reset();
    }
  }

  OnSubmit(form: NgForm) {
    if (this.authService.setUserData(form.value)) {
      this.router.navigate(['/']);
      return;
    }

    form.reset();
    this.snackBar.open('Username or password is incorrect', '', {
      duration: 2000,
    });

  }
}
