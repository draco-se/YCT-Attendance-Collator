import { AttendanceService } from './../attendance/attendance.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Session } from '../shared/shared.model';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(
    private http: HttpClient,
    private attendanceService: AttendanceService,
  ) {}

  getCoordsFromAddress(address: string) {
    const urlAddress = encodeURI(address);
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${environment.googleApi}`,
      )
      .pipe(
        catchError((err) =>
          throwError(
            () => new Error('Failed to fetch coordinates. Please try again!'),
          ),
        ),
        map((res) => {
          if (res.results.length == 0) return res;
          const coordinate = res.results[0].geometry.location;

          return coordinate;
        }),
      );
  }

  postCoordinates(params: {
    sessionId: string;
    programmeId: string;
    courseId: string;
    attendanceRecordId: string;
    coordinates: { lat: number; lng: number };
  }) {
    return this.http
      .post<{
        res: {
          sessionId: string;
          programmeId: string;
          courseId: string;
          recordId: string;
        };
        sessions: Session[];
      }>(environment.restApiAddress + '/post-coordinates', params)
      .pipe(
        catchError(this.handleErrors),
        map((res) => {
          this.attendanceService.setSessions(res.sessions);
          return res.res;
        }),
      );
  }

  private handleErrors(errorRes: HttpErrorResponse) {
    let errorMeassge = 'An unknown error occurred';

    console.log(errorRes.error);

    if (!errorRes.error) {
      return throwError(errorMeassge);
    }
    switch (errorRes.error.message) {
      case 'USER_NOT_FOUND':
        errorMeassge = 'User not found! Ensure that you are logged in.';
        break;

      case 'INVALID_DETAILS':
        errorMeassge = 'Invalid details! Try again.';
        break;

      case 'INVALID_COORD':
        errorMeassge = 'Invalid coordinates! Try again.';
        break;

      case 'INACCURATE_LOCATION':
        errorMeassge =
          'Your location is inaccurate! This might be due to your network';
        break;

      case 'RECORD_NOT_FOUND':
        errorMeassge = 'Attendance record not found';
        break;
    }

    return throwError(errorMeassge);
  }
}
