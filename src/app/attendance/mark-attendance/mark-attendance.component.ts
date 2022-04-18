import { MapService } from './../../map/map.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Session,
  AttendanceService,
  Programme,
  Course,
} from './../attendance.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';

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

  constructor(private attendanceService: AttendanceService, private mapService: MapService) {}

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

  getLocation() {

  }

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
        next: (res) => {
          this.isLoading = false;

          this.mapService.locateUserHandler()
          // if (!!this.sessionTitle) {
          //   this.router.navigate(['/programmes/' + this.sessionId]);

          // } else {
          //   this.router.navigate(['/sessions']);
          // }
        },
        error: (err) => {
          this.error = err.error.message;

          this.isLoading = false;
        },
        // complete: () => console.info('Created Successfully'),
      });
  }
}
