import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('nav') navBar: ElementRef<HTMLElement>;
  @ViewChild('backdrop') backdrop: ElementRef<HTMLElement>;
  isAuthenticated: boolean = false;
  private userSub: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  openNav() {
    const nav = this.navBar.nativeElement;
    const backdrop = this.backdrop.nativeElement;
    nav.style.animation = 'slideIn 0.5s linear';
    nav.style.display = 'flex';
    backdrop.style.display = 'block';
    setTimeout(() => {
      nav.style.right = '0';
    }, 500);
  }

  closeNav() {
    const nav = this.navBar.nativeElement;
    const backdrop = this.backdrop.nativeElement;
    nav.style.animation = 'slideOut 0.5s linear';
    nav.style.right = '-70vw';
    setTimeout(() => {
      nav.style.display = 'none';
      backdrop.style.display = 'none';
    }, 500);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate['/'];
    this.closeNav()
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
