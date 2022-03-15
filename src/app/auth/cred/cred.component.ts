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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onBioReg() {
    this.isLoading = true;
    this.authService.webAuthnReg().subscribe(() => {
      this.isLoading = false;
      this.success = true;
    });
  }

  onClose() {
    this.success = false;
    this.authService.sucessMessage.next(true);
  }
}
