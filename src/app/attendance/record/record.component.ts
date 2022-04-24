import { environment } from './../../../environments/environment';
import { AuthService } from './../../auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AttendanceLine, AttendanceService } from '../attendance.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit, OnDestroy {
  attendance: AttendanceLine[] = [];
  date: string;
  isLoading: boolean = true;
  statusProcessing: boolean = false;
  clicked: boolean = false;
  link: string = '';
  minutes: number = 0;
  hours: number = 0;
  clearTimeout: any;
  sessionId: string;
  progId: string;
  courseId: string;
  recordId: string;

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.sessionId = params['year'].toLowerCase();
      this.progId = params['progId'].toLowerCase();
      this.courseId = params['courseId'].toLowerCase();
      this.recordId = params['recordId'].toLowerCase();
      const details = this.attendanceService.getRecord(
        this.sessionId,
        this.progId,
        this.courseId,
        this.recordId,
      );
      this.setAttendance(details);

      this.attendanceService.sessionsChanged.subscribe(() => {
        const details = this.attendanceService.getRecord(
          this.sessionId,
          this.progId,
          this.courseId,
          this.recordId,
        );
        this.setAttendance(details);
      });
    });
  }

  copy(el: HTMLInputElement) {
    if (!navigator.clipboard) {
      el.select();
      return;
    }

    navigator.clipboard
      .writeText(el.value)
      .then(() => alert('Copied to clipboard'))
      .catch((err) => {
        console.log(err);
        alert('Error copying text! Try again or copy manually');
      });
  }

  share(el: HTMLInputElement) {
    if (!navigator.share) {
      el.select();
      return;
    }

    navigator.share({ url: el.value }).catch((err) => {
      console.log(err);
      alert('Error sharing text! Try again or copy manually');
    });
  }

  setAttendance(details) {
    this.isLoading = false;

    this.attendance = [...details.attendance];

    this.date = details.date.split(',')[0].replaceAll('/', '-');

    details.tokenResetExpiration;

    this.authService.user.subscribe((user) => {
      if (new Date(details.tokenResetExpiration) > new Date() && !!user) {
        this.link = `${environment.frontEndAddress}/attendance/${user.id}/${this.sessionId}/${this.progId}/${this.courseId}/${this.recordId}/${details.token}`;
        const time = new Date(
          new Date(details.tokenResetExpiration).getTime() - Date.now(),
        );

        this.hours = time.getUTCHours();
        this.minutes = time.getUTCMinutes();

        this.clearTimeout = setInterval(() => {
          if (this.minutes == 0) {
            this.hours--;
            this.minutes = 60;
          }
          this.minutes--;
        }, 60000);
      }
    });
  }

  changeStatus(status: boolean, id: string) {
    this.statusProcessing = true;
    this.attendanceService
      .markAttendance(
        this.sessionId,
        this.progId,
        this.courseId,
        this.recordId,
        id,
        status,
      )
      .subscribe({
        next: (res) => {
          this.clicked = false;
          this.statusProcessing = false;
        },
        error: (err) => {
          console.error(err.error.message);
          this.statusProcessing = false;
        },
      });
  }

  dropdown(el: HTMLDivElement, list: HTMLUListElement) {
    const centered =
      'display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex;';
    if (!this.clicked) {
      el.nextElementSibling.setAttribute('style', centered);
      el.lastElementChild.setAttribute('style', 'transform: rotateZ(90deg)');
      this.clicked = true;
    } else {
      this.closeDropdown(list);
    }
  }

  closeDropdown(el: HTMLUListElement) {
    const arrow = el.querySelectorAll('.dropdown-arrow');
    const dropdown: NodeList = el.querySelectorAll('.status-opt');
    dropdown.forEach((el: HTMLDivElement, idx) => {
      if (arrow[idx].hasAttribute('style')) arrow[idx].removeAttribute('style');
      el.style.display = 'none';
    });
    this.clicked = false;
  }

  ngOnDestroy(): void {
    clearInterval(this.clearTimeout);
  }
}
