import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated = new Subject<boolean>();
  constructor() { }

  setUserData(user: User): boolean {
    this.removeUserData();
    if (user.login.toLowerCase() === 'admin' && user.password.toLowerCase() === 'admin') {
      localStorage.setItem('user', JSON.stringify(user));
      this.authenticated.next(true);
      return true;
    }
    this.authenticated.next(false);
    return false;
  }

  isAuthenticated(): Subject<boolean> {
    return this.authenticated;
  }

  isLogined(): boolean {
    if (JSON.parse(localStorage.getItem('user')) != null) {
      let user: User = JSON.parse(localStorage.getItem('user'))
      if (user.login.toLowerCase() === 'admin' && user.password.toLowerCase() === 'admin') {
        this.authenticated.next(true);
        return true;
      }
    }
    this.authenticated.next(false);
    return false;
  }

  removeUserData(): void {
    localStorage.clear();
    this.authenticated.next(false);
  }
}
