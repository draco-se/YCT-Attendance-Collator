import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AttendanceService,
  Course,
  Programme,
  Session,
} from './../attendance.service';

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: [
    './../create-record/create-record.component.scss',
    './mark-attendance.component.scss',
  ],
})
export class MarkAttendanceComponent implements OnInit {
  isLoading: boolean = false;
  error: any;
  sessions: Session[] = [];
  sessionTitle: string = '';
  programmes: Programme[] = [];
  programmeTitle: string = '';
  courses: Course[] = [];
  courseTitle: string = '';
  mappingTime: boolean = true;

  constructor(
    private attendanceService: AttendanceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.sessions = [...this.attendanceService.getSessions()].reverse();
    if (this.sessions.length > 0) {
      this.sessionTitle = this.sessions[0].title;
      this.programmes = [...this.sessions[0].programmes];
    }
  }

  autoFilter(input: NgModel) {
    if (input.value == '')
      this.sessions = [...this.attendanceService.getSessions()];
    this.sessions = [...this.sessions].filter((session) =>
      session.title.includes(input.value),
    );
  }

  autoFilterProg(prog: NgModel) {
    if (prog.value == '')
      this.sessions = [...this.attendanceService.getSessions()];
    const session = this.sessions.find(
      (session) => session.title == this.sessionTitle,
    );
    if (session) {
      this.programmes = [...session.programmes].filter((programme) =>
        programme.title.includes(prog.value.toUpperCase()),
      );
    } else {
      this.programmes = [];
    }
  }

  autoFilterCourse(course: NgModel) {
    if (course.value == '')
      this.sessions = [...this.attendanceService.getSessions()];
    const programme = this.programmes.find(
      (programme) => programme.title == this.programmeTitle,
    );
    if (programme) {
      this.courses = [...programme.courses].filter((filteredCourse) =>
        filteredCourse.title.includes(course.value.toUpperCase()),
      );
    } else {
      this.courses = [];
    }
  }

  getLocation() {}

  onSubmit(form: NgForm) {
    this.isLoading = true;

    this.attendanceService
      .createAttendance(
        form.value.session,
        form.value.programme,
        form.value.course,
        form.value.hours,
        form.value.minutes,
      )
      .subscribe({
        next: (res: {
          attendanceRecordId: string;
          courseId: string;
          programmeId: string;
          sessionId: string;
        }) => {
          this.isLoading = false;

          this.mappingTime = true;
          // this.router.navigate([
          //   '/programmes',
          //   res.sessionId,
          //   res.programmeId,
          //   res.courseId,
          //   res.attendanceRecordId,
          // ]);
        },
        error: (err) => {
          this.error = err.error.message;

          this.isLoading = false;
        },
      });
  }
}
