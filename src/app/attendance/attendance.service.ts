import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Subject,
  tap,
  throwError,
} from 'rxjs';
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
  token: string;
  tokenResetExpiration: string;
  attendance: AttendanceLine[];
}

export interface AttendanceLine {
  _id: string;
  name: string;
  matricNumber: string;
  status: string;
}

export interface AggregateAttendance {
  _id: string;
  date: Date;
  attendance: AggregateAttendanceLine[];
}

export interface AggregateAttendanceLine {
  _id: string;
  name: string;
  matricNumber: string;
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  sessions: Session[] = [];
  studentRecord: AttendanceRecord;

  studentRecordChanged = new Subject<AttendanceRecord>();

  sessionsChanged = new Subject<Session[]>();
  link = new BehaviorSubject<{ token: string; tokenResetExpiration: string }>(
    null,
  );

  constructor(private http: HttpClient) {}

  setSessions(sessions: Session[]) {
    this.sessions = sessions;
    this.sessionsChanged.next(this.sessions);
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
        },
      )
      .pipe(
        map((res: any) => {
          this.setSessions(res.sessions);

          return res.res;
        }),
      );
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

  markAttendance(
    sessionId: string,
    progId: string,
    courseId: string,
    recordId: string,
    id: string,
    status: boolean,
    userId?: string,
    token?: string,
  ) {
   if (!!userId) {
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
   } else {
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
      }),
    );
   }
  }
}
