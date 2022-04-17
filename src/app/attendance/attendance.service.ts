import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Session {
  _id: string;
  title: string;
  programmes: Programme[];
}

export interface Programme {
  _id: string;
  title: string;
  courses: Course[];
}

export interface Course {
  _id: string;
  title: string;
  attendanceRecords?: AttendanceRecord[];
  aggregateAttendance?: AggregateAttendance[];
}

export interface AttendanceRecord {
  _id: string;
  date: any;
  attendance: AttendanceLine[];
}

export interface AttendanceLine {
  _id: string;
  name: string;
  matricNumber: string;
  status: string;
}

export interface AggregateAttendance {
  date: Date;
  attendance: AggregateAttendanceLine[];
}

export interface AggregateAttendanceLine {
  name: string;
  matricNumber: string;
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  sessions: Session[] = [];

  sessionsChanged = new Subject<Session[]>();

  constructor(private http: HttpClient) {}

  setSessions(sessions: Session[]) {
    this.sessions = sessions;
    this.sessionsChanged.next(this.sessions);
  }

  getSessions() {
    return this.sessions;
  }

  getProgrammes(id: string) {
    const session = this.sessions.find((session) => session._id == id) || {
      programmes: [],
    };
    return session.programmes;
  }

  getRecords(id: string, progId: string, courseId: string) {
    const records = this.getProgrammes(id)
      .find((programme) => programme._id == progId)
      .courses.find((course) => course._id == courseId).attendanceRecords;

    return records;
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
        );
    }
  }

  fetchSessions() {
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
}
