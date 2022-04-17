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
  sessionTitle: string;
  programmes: Programme[] = [];
  programmeTitle: string = '';
  courses: Course[] = [];
  courseTitle: string = '';

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.sessions = [...this.attendanceService.getSessions()].reverse();
    this.sessionTitle = this.sessions[0].title;
    this.programmes = [...this.sessions[0].programmes];
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

  onSubmit(form: NgForm) {
    if (
      this.sessions.length == 0 ||
      this.programmes.length == 0 ||
      this.courses.length == 0
      ) {
        this.error = 'All field must already exist in record';
        this.isLoading = false;
        return;
      }
      console.log(form.value)
    }
}
