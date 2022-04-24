import { base64URLStringToBuffer } from './../auth/auth.service';
import { environment } from 'src/environments/environment';
import { AttendanceRecord } from './attendance.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  map,
  tap,
  catchError,
  switchMap,
  throwError,
} from 'rxjs';
import { bufferToBase64URLString } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  studentClose = new BehaviorSubject<boolean>(false);
  studentRecordChanged = new Subject<AttendanceRecord>();
  sucessMessage = new Subject<boolean>();
  errorMessage = new Subject<string>();
  studentAuthDetails: {
    matricNumber: string;
    isRegistered: boolean;
    sessionId: string;
    courseId: string;
    progId: string;
    recordId: string;
    attendanceId: string;
    teacherId: string;
    stautus: boolean;
    linkToken: string;
  };

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

  webAuthnReg(
    teacherId: string,
    sessionId: string,
    progId: string,
    courseId: string,
    recordId: string,
    attendanceId: string,
    token: string,
    matricNumber: string,
  ) {
    return this.http
      .post<any>(environment.restApiAddress + '/student/webauthn-reg', {
        teacherId,
        sessionId,
        progId,
        courseId,
        matricNumber,
      })
      .pipe(
        catchError((err) => throwError(err)),
        switchMap((createCredentialDefaultArgs) => {
          const credentials: PublicKeyCredentialCreationOptions = {
            ...createCredentialDefaultArgs,
            challenge: Uint8Array.from(
              createCredentialDefaultArgs.challenge,
              (c: any) => c.charCodeAt(0),
            ),
            user: {
              ...createCredentialDefaultArgs.user,
              id: Uint8Array.from(
                atob(createCredentialDefaultArgs.user.id),
                (c: any) => c.charCodeAt(0),
              ),
            },
          };

          return navigator.credentials.create({ publicKey: credentials });
        }),
        switchMap(async (resData: any) => {
          const credential = {
            response: {
              clientDataJSON: bufferToBase64URLString(
                resData.response.clientDataJSON,
              ),
              attestationObject: bufferToBase64URLString(
                resData.response.attestationObject,
              ),
            },
          };

          this.http
            .post<{ attendanceRecord: AttendanceRecord }>(
              environment.restApiAddress + '/student/webauthn-reg-verification',
              {
                credential,
                teacherId,
                sessionId,
                progId,
                courseId,
                recordId,
                attendanceId,
                token,
              },
            )
            .pipe(catchError((err) => throwError(err)))
            .subscribe({
              next: (res) => {
                this.studentRecordChanged.next(res.attendanceRecord);
                this.sucessMessage.next(true);
              },
              error: (err) => this.errorMessage.next(err),
            });
        }),
      );
  }

  webauthnLogin(
    teacherId: string,
    sessionId: string,
    progId: string,
    courseId: string,
    recordId: string,
    attendanceId: string,
    token: string,
    status: boolean,
    matricNumber: string,
  ) {
    return this.http
      .post<any>(environment.restApiAddress + '/student/webauthn-login', {
        teacherId,
        sessionId,
        progId,
        courseId,
        matricNumber,
      })
      .pipe(
        catchError((err) => throwError(err)),
        switchMap((createCredentialDefaultArgs) => {
          const credentials: PublicKeyCredentialRequestOptions = {
            ...createCredentialDefaultArgs,
            challenge: base64URLStringToBuffer(
              createCredentialDefaultArgs.challenge,
            ),

            allowCredentials: [
              {
                ...createCredentialDefaultArgs.allowCredentials[0],
                id: base64URLStringToBuffer(
                  createCredentialDefaultArgs.allowCredentials[0].id,
                ),
              },
            ],
          };

          return navigator.credentials.get({ publicKey: credentials });
        }),
        switchMap(async (resData: any) => {
          const credential = await {
            id: resData.id,
            response: {
              authenticatorData: bufferToBase64URLString(
                resData.response.authenticatorData,
              ),
              clientDataJSON: bufferToBase64URLString(
                resData.response.clientDataJSON,
              ),
              signature: bufferToBase64URLString(resData.response.signature),
              userHandle: bufferToBase64URLString(resData.response.userHandle),
            },
          };

          this.http
            .post<{ attendanceRecord: AttendanceRecord }>(
              environment.restApiAddress +
                '/student/webauthn-login-verification',
              {
                credential,
                teacherId,
                sessionId,
                progId,
                courseId,
                recordId,
                attendanceId,
                status,
                token,
              },
            )
            .pipe(catchError((err) => throwError(err)))
            .subscribe({
              next: (res) => {
                this.studentRecordChanged.next(res.attendanceRecord);
                this.sucessMessage.next(true);
              },
              error: (err) => {
                this.errorMessage.next(err);
              },
            });
        }),
      );
  }
}
