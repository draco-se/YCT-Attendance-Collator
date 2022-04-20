import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from './../../auth/auth.service';
import { AttendanceLine, AttendanceService } from './../attendance.service';

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  styleUrls: [
    './../record/record.component.scss',
    './student-attendance.component.scss',
  ],
})
export class StudentAttendanceComponent implements OnInit {
  attendance: AttendanceLine[] = [];
  date: string;
  clicked: boolean = false;
  expired: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const sessionId = params['year'].toLowerCase();
      const progId = params['progId'].toLowerCase();
      const courseId = params['courseId'].toLowerCase();
      const recordId = params['recordId'].toLowerCase();
      const details = this.attendanceService.getRecord(
        sessionId,
        progId,
        courseId,
        recordId,
      );

      if (new Date(details.tokenResetExpiration) < new Date()) return;

      this.attendance = [...details.attendance];

      this.date = details.date.replaceAll('/', '-');
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
}
