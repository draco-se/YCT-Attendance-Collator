import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { StudentService } from '../student.service';
import { AttendanceLine, AttendanceService } from './../attendance.service';

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  styleUrls: [
    './../record/record.component.scss',
    './student-attendance.component.scss',
  ],
})
export class StudentAttendanceComponent implements OnInit, OnDestroy {
  attendance: AttendanceLine[] = [];
  date: string;
  isLoading: boolean = true;
  authenticate: boolean;
  minutes: number = 0;
  hours: number = 0;
  clearTimeout: any;
  clicked: boolean = false;
  teacherId: string;
  sessionId: string;
  progId: string;
  courseId: string;
  recordId: string;
  token: string;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.teacherId = params['userId'];
      this.sessionId = params['year'];
      this.progId = params['progId'];
      this.courseId = params['courseId'];
      this.recordId = params['recordId'];
      this.token = params['token'];

      this.studentService
        .fetchRecord(
          this.teacherId,
          this.sessionId,
          this.progId,
          this.courseId,
          this.recordId,
          this.token,
        )
        .subscribe({
          next: (details) => {
            this.setAttendance(details);
          },
          error: (err) => {
            console.error(err.error.message);
            this.isLoading = false;
          },
        });

      this.studentService.studentClose.subscribe((data) => {
        this.authenticate = data;
      });
      this.studentService.studentRecordChanged.subscribe((details) => {
        this.setAttendance(details);
      });
    });

  }

  setAttendance(details) {
    this.isLoading = false;
    if (new Date(details.tokenResetExpiration) < new Date()) return;

    this.attendance = [...details.attendance];

    const time = new Date(
      new Date(details.tokenResetExpiration).getTime() - Date.now(),
    );

    this.hours = time.getUTCHours();
    this.minutes = time.getUTCMinutes();

    this.clearTimeout = setInterval(() => {
      if (this.minutes == 0 && this.hours > 0) {
        this.hours--;
        this.minutes = 60;
      }
      if (this.minutes == 0 && this.hours == 0) {
        this.attendance = [];
        this.date = '';
        return;
      }
      this.minutes--;
    }, 60000);

    this.date = details.date.split(',')[0].replaceAll('/', '-');
  }

  changeStatus(stautus: boolean, idx: number) {
    this.studentService.studentAuthDetails = {
      sessionId: this.sessionId,
      progId: this.progId,
      courseId: this.courseId,
      recordId: this.recordId,
      attendanceId: this.attendance[idx]._id,
      teacherId: this.teacherId,
      linkToken: this.token,
      stautus,
      matricNumber: this.attendance[idx].matricNumber,
      isRegistered: this.attendance[idx].isRegistered,
    };
    this.authenticate = true;
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
