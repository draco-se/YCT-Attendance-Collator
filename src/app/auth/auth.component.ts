import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  @ViewChild('loginTitle') loginTitle: ElementRef<HTMLElement>;
  @ViewChild('signupTitle') signupTitle: ElementRef<HTMLElement>;
  @ViewChild('underline') underline: ElementRef<HTMLElement>;
  @ViewChild('formContainer') formContainer: ElementRef<HTMLElement>;
  error: any;
  signedup: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService,
    @Inject(PLATFORM_ID) private platformId,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (location.pathname == '/signup') {
        this.signupControl();
      }

      this.authService.sucessMessage.subscribe((success) => {
        if (!!success) {
          this.signedup = false;
          this.loginControl();
        }
      });
    }
  }

  onLogin(form: NgForm) {
    this.isLoading = true;
    if (!form.valid) {
      this.error = 'invalid form';
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authService.login(email, password).subscribe(
      (resData) => {
        this.isLoading = false;
        console.log(resData);
        form.reset();
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      (errorMessage) => {
        this.error = errorMessage;
      },
    );
  }

  onSignup(form: NgForm) {
    this.isLoading = true;
    if (!form.valid) {
      this.error = 'invalid form';
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const confirmPassword = form.value.confirmPassword;
    const fullName = form.value.fullName;
    this.authService
      .signup(email, fullName, password, confirmPassword)
      .subscribe(
        (resData) => {
          this.isLoading = false;
          console.log(resData);
          form.reset();
          this.signedup = true;
        },
        (errorMessage: any) => {
          this.error = errorMessage;
        },
      );
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
      },
    );
  }

  webauthnLogin(form: NgForm) {
    this.authService.webauthnLogin(form.value.email).subscribe()
  }

  signupControl() {
    setTimeout(() => {
      this.underline.nativeElement.style.transform = 'translateX(100%)';
      this.formContainer.nativeElement.style.transform = 'translateX(-50%)';
      this.loginTitle.nativeElement.classList.remove('active');
      this.signupTitle.nativeElement.classList.add('active');
      this.router.navigate(['signup']);
    }, 1);
  }

  loginControl() {
    this.loginTitle.nativeElement.classList.add('active');
    this.signupTitle.nativeElement.classList.remove('active');
    this.underline.nativeElement.style.transform = 'translateX(0)';
    this.formContainer.nativeElement.style.transform = 'translateX(0)';
    setTimeout(() => {
      this.router.navigate(['login']);
    }, 500);
  }

  previousPage() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
