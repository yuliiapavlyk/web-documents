import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (this.authService.isLogined()) {
      this.router.navigate(['/docs']);
    }
  }

  cancel(form?: NgForm): void {
    if (form != null) {
      form.reset();
    }
  }

  OnSubmit(form: NgForm) {
    if (this.authService.setUserData(form.value)) {
      this.router.navigate(['/docs']);
      return;
    }

    form.reset();
    this.snackBar.open('Username or password is incorrect', '', {
      duration: 2000,
    });

  }
}
