import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../attendance.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit {
  sessions: string[];

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.sessions = this.attendanceService.getSessions();
  }
}
