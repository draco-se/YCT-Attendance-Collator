import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-cred',
  templateUrl: './cred.component.html',
  styleUrls: ['./cred.component.scss'],
})
export class CredComponent implements OnInit {
  isLoading: boolean = false;
  success: boolean = false;
  available: boolean;
  error: any =
    'Sorry. Your device does not support biometric authentication, kindly skip this step.';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(
        (uvpaa) => {
          if (uvpaa) {
            this.available = !!uvpaa;

            this.authService.errorMessage.subscribe((err) => {
              this.error = err;
            });
          } else {
            this.available = false;
          }
        },
      );
    } else {
      this.available = false;
    }
  }

  onBioReg() {
    this.isLoading = true;
    this.authService.webAuthnReg().subscribe({
      next: () => {
        this.isLoading = false;
        this.success = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err;
      },
    });
  }

  onClose() {
    this.success = false;
    this.authService.sucessMessage.next(true);
  }
}
