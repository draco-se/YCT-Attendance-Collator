import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AttendanceLine, AttendanceService } from '../attendance.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit {
  attendance: AttendanceLine[];
  date: string;

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const title = params['year'].toLowerCase();
      const progId = params['progId'].toLowerCase();
      const courseId = params['courseId'].toLowerCase();
      const recordId = params['recordId'].toLowerCase();
      this.attendance = this.attendanceService.getRecords(
        title,
        progId,
        courseId,
      )[recordId].attendance;

      this.date = this.attendanceService
        .getRecords(title, progId, courseId)
        [recordId].date.replaceAll('/', '-')
        .split(',')[0];
    });
  }
}
