import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild('loginTitle') loginTitle: ElementRef<HTMLElement>;
  @ViewChild('signupTitle') signupTitle: ElementRef<HTMLElement>;
  @ViewChild('underline') underline: ElementRef<HTMLHRElement>;
  @ViewChild('formContainer') formContainer: ElementRef<HTMLDivElement>;
  error: any;
  signedup: boolean = false;
  isLoading: boolean = false;
  isBio: boolean = false;
  userSub: Subscription;
  isAuthenticated: boolean = false;
  signupTimeout: any;
  loginTimeout: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService,
    @Inject(PLATFORM_ID) private platformId,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userSub = this.authService.user.subscribe((user) => {
        if (!!user) {
          this.router.navigate(['/']);
        }
      });

      if (location.pathname == '/signup') {
        this.signupControl();
      }

      this.authService.sucessMessage.subscribe((success) => {
        if (!!success) {
          if (location.pathname == '/signup') {
            this.signedup = false;
            this.loginControl();
          } else {
            this.router.navigate(['../'], { relativeTo: this.route });
          }
        }
      });

      this.authService.errorMessage.subscribe((error) => {
        console.log(error);
        this.error = error;
        this.isLoading = false;
        this.isBio = false;
      });
    }
  }

  onLogin(form: NgForm) {
    if (this.isBio) return;
    this.isLoading = true;
    if (!form.valid) {
      this.error = 'invalid form';
      this.isLoading = false;
      this.isBio = false;
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authService.login(email, password).subscribe(
      (resData) => {
        this.isLoading = false;
        this.isBio = false;
        console.log(resData);
        form.reset();
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
        this.isBio = false;
      },
    );
  }

  onSignup(form: NgForm) {
    this.isLoading = true;
    if (!form.valid) {
      this.error = 'invalid form';
      this.isLoading = false;
      this.isBio = false;
      return;
    }
    const email: string = form.value.email;
    const password: string = form.value.password;
    const confirmPassword: string = form.value.confirmPassword;
    const fullName: string = form.value.fullName;
    this.authService
      .signup(email, fullName, password, confirmPassword)
      .subscribe({
        next: (resData) => {
          this.isLoading = false;
          this.isBio = false;
          console.log(resData);
          form.reset();
          this.signedup = true;
        },
        error: (errorMessage: any) => {
          this.error = errorMessage;
          this.isLoading = false;
          this.isBio = false;
        },
      });
  }

  async onGoogleAuth(type: boolean) {
    const { idToken } = await this.socialAuthService.signIn(
      GoogleLoginProvider.PROVIDER_ID,
    );

    this.authService.googleAuth(idToken).subscribe(
      (resData) => {
        console.log(resData);
        this.signedup = type;
        if (!type) this.router.navigate(['../'], { relativeTo: this.route });
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      },
    );
  }

  webauthnLogin(form: NgForm) {
    if (this.isLoading) return;
    this.isBio = true;
    this.authService.webauthnLogin(form.value.email).subscribe({
      next: () => console.log('Verifying...'),
      error: (err) => {
        if (err) {
          console.log(err);
          this.error =
            err.toString().length > 40
              ? 'Operation timed out or not allowed'
              : err;
          this.isLoading = false;
          this.isBio = false;
        }
      },
    });
  }

  signupControl() {
    if (this.loginTimeout) clearTimeout(this.loginTimeout);
    setTimeout(() => {
      this.underline.nativeElement.style.transform = 'translateX(100%)';
      this.formContainer.nativeElement.style.transform = 'translateX(-50%)';
      this.loginTitle.nativeElement.classList.remove('active');
      this.signupTitle.nativeElement.classList.add('active');
      this.router.navigate(['signup']);
    }, 1);
  }

  loginControl() {
    if (this.signupTimeout) clearTimeout(this.signupTimeout);
    this.loginTitle.nativeElement.classList.add('active');
    this.signupTitle.nativeElement.classList.remove('active');
    this.underline.nativeElement.style.transform = 'translateX(0)';
    this.formContainer.nativeElement.style.transform = 'translateX(0)';
    this.loginTimeout = setTimeout(() => {
      this.router.navigate(['login']);
    }, 500);
  }

  previousPage() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userSub.unsubscribe();
    }
  }
}
