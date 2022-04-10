import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AttendanceService, Session } from './attendance.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceResolver implements Resolve<Session[]> {
  constructor(private attendanceService: AttendanceService) {}

  resolve(): Session[] |  Observable<Session[]> | Promise<Session[]> {
    const sessions = this.attendanceService.getSessions();
    if (sessions.length == 0) {
      return this.attendanceService.fetchSessions();
    } else {
      return sessions;
    }
  }
}
