import { Coordinates } from './../map/map.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Subject,
  tap,
  throwError
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { AggregateAttendanceLine, AttendanceRecord, Programme, Session } from '../shared/shared.model';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  sessions: Session[] = [];
  sessionsChanged = new Subject<Session[]>();
  isLoading = new Subject<boolean>();
  link = new BehaviorSubject<{ token: string; tokenResetExpiration: string }>(
    null,
  );

  constructor(private http: HttpClient) {}

  setSessions(sessions: Session[]) {
    this.sessions = sessions;
    this.sessionsChanged.next(this.sessions);
    this.isLoading.next(true);
  }

  getSessions(): Session[] {
    return this.sessions;
  }

  getProgrammes(id: string): Programme[] {
    const session = this.sessions.find((session) => session._id == id) || {
      programmes: [],
    };
    return session.programmes;
  }

  getAggregateRecord(
    id: string,
    progId: string,
    courseId: string,
  ): AggregateAttendanceLine[] {
    const records = this.getProgrammes(id)
      .find((programme) => programme._id == progId)
      .courses.find((course) => course._id == courseId).aggregateAttendance;

    return records;
  }

  getRecords(id: string, progId: string, courseId: string): AttendanceRecord[] {
    const records = this.getProgrammes(id)
      .find((programme) => programme._id == progId)
      .courses.find((course) => course._id == courseId).attendanceRecords;

    return records;
  }

  getRecord(
    id: string,
    progId: string,
    courseId: string,
    recordId: string,
  ): AttendanceRecord {
    const attendance = this.getRecords(id, progId, courseId).find(
      (attendance) => attendance._id == recordId,
    );

    return attendance;
  }

  createSession(
    session: string,
    programme: string,
    course: string,
    firstMatric: string,
    indexNumber: number,
    totalStudent: number,
    edit: boolean,
  ) {
    if (edit) {
      return this.http
        .post(environment.restApiAddress + '/modify-record', {
          session,
          programme,
          course,
          firstMatric,
          indexNumber,
          totalStudent,
        })
        .pipe(
          map((resData: any) => {
            return resData.sessions;
          }),
          tap((sessions) => {
            console.log(sessions);
            this.setSessions(sessions);
          }),
        );
    } else {
      return this.http
        .post(environment.restApiAddress + '/create-record', {
          session,
          programme,
          course,
          firstMatric,
          indexNumber,
          totalStudent,
        })
        .pipe(
          map((resData: any) => {
            return resData.sessions;
          }),
          tap((sessions) => {
            this.setSessions(sessions);
          }),
          catchError((err) => throwError(err)),
        );
    }
  }

  createAttendance(
    session: string,
    programme: string,
    course: string,
    hours: number,
    minutes: number,
    coordinates: Coordinates
  ) {
    return this.http
      .post<{ message: string }>(
        environment.restApiAddress + '/create-attandance',
        {
          session,
          programme,
          course,
          hours,
          minutes,
          coordinates
        },
      )
      .pipe(
        catchError(this.handleErrors),
        map((res: any) => {
          this.setSessions(res.sessions);

          return res.res;
        }),
      );
  }

  fetchSessions() {
    this.isLoading.next(false);
    return this.http
      .get<Session[]>(environment.restApiAddress + '/sessions')
      .pipe(
        map((resData: any) => {
          return resData.sessions;
        }),
        tap((sessions) => {
          this.setSessions(sessions);
        }),
        catchError((err: HttpErrorResponse) => throwError(err)),
      );
  }

  markAttendance(
    sessionId: string,
    progId: string,
    courseId: string,
    recordId: string,
    id: string,
    status: boolean,
  ) {
    return this.http
      .post<{ attendanceRecord: AttendanceRecord }>(
        environment.restApiAddress + '/mark-attendance',
        {
          sessionId,
          progId,
          courseId,
          recordId,
          id,
          status,
        },
      )
      .pipe(
        map((resData: any) => {
          return resData.sessions;
        }),
        tap((sessions) => {
          this.setSessions(sessions);
        })
      );
  }

  private handleErrors(errorRes: HttpErrorResponse) {
    let errorMeassge = 'An unknown error occurred';

    console.log(errorRes.error);

    if (!errorRes.error) {
      return throwError(errorMeassge);
    }

    switch (errorRes.error.message) {
      case 'INVALID_FIELD':
        errorMeassge = 'Some fields are invalid!';
        break;

      case 'FIELD_NOT_FOUND':
        errorMeassge = 'Some fields are not in record!';
        break;

      case 'ATTENDANCE_LIMIT_EXCEEDED':
        errorMeassge = 'One attendance per day, for a course!';
        break;

      case 'INVALID_COORD':
        errorMeassge = 'Invalid coordinates! Try again.';
        break;

      case 'INACCURATE_LOCATION':
        errorMeassge =
          'Your location is inaccurate! This might be due to your network.';
        break;
    }

    return throwError(errorMeassge);
  }
}

