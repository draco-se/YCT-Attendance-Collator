import { AttendanceService } from './attendance/attendance.service';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { StudentService } from './attendance/student.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'yct-biometric-auth';
  loaded: boolean = false;

  constructor(
    private authService: AuthService,
    private attendanceSerice: AttendanceService,
    private studentService: StudentService,
    @Inject(PLATFORM_ID) private platformId,
  ) {}

  ngOnInit(): void {
    this.attendanceSerice.isLoading.subscribe((res) => {
      this.loaded = res;
    });

    if (isPlatformBrowser(this.platformId)) {
      this.authService.autoLogin();

      if (location.pathname.includes('attendance')) this.loaded = true;
      setTimeout(() => {
        this.loaded = true;
      }, 2000);
    }
  }
}
