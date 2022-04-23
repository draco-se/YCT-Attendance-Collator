import { environment } from 'src/environments/environment';
import { AttendanceRecord } from './attendance.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  studentClose = new BehaviorSubject<boolean>(false);
  studentRecordChanged = new Subject<AttendanceRecord>();
  studentAuthDetails: {
    matricNumber: string;
    isRegistered: boolean;
  }

  constructor(private http: HttpClient) {}

  close() {
    this.studentClose.next(false);
  }

  markAttendance(
    sessionId: string,
    progId: string,
    courseId: string,
    recordId: string,
    id: string,
    status: boolean,
    userId: string,
    token: string,
  ) {
    return this.http
      .post<{ attendanceRecord: AttendanceRecord }>(
        environment.restApiAddress + '/student-mark-attendance',
        {
          userId,
          sessionId,
          progId,
          courseId,
          recordId,
          token,
          id,
          status,
        },
      )
      .pipe(
        map((resData) => {
          return resData.attendanceRecord;
        }),
        tap((attendanceRecord) => {
          this.studentRecordChanged.next(attendanceRecord);
        }),
      );
  }

  fetchRecord(
    userId: string,
    sessionId: string,
    progId: string,
    courseId: string,
    recordId: string,
    token: string,
  ) {
    return this.http
      .post<{ attendanceRecord: AttendanceRecord }>(
        environment.restApiAddress + '/student-attendance',
        {
          userId,
          sessionId,
          progId,
          courseId,
          recordId,
          token,
        },
      )
      .pipe(
        map((resData) => {
          return resData.attendanceRecord;
        }),
        tap((attendanceRecord) => {
          this.studentRecordChanged.next(attendanceRecord);
        }),
      );
  }
}
