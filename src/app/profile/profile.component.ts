import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User;
  firstName: string;
  innitials: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      this.user = user;
      if (!this.user) {
        this.router.navigate(['/']);
      }
    });
    this.firstName = this.user.name.split(' ')[1];
    this.innitials = this.user.name.split(' ')[1][0] + this.user.name[0];
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
