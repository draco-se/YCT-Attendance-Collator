import {
  AttendanceService,
  AggregateAttendanceLine,
} from './../attendance.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aggregate',
  templateUrl: './aggregate.component.html',
  styleUrls: [
    './../record/record.component.scss',
    './aggregate.component.scss',
  ],
})
export class AggregateComponent implements OnInit {
  isLoading: boolean = true;
  attendance: AggregateAttendanceLine[] = [];
  sessionId: string;
  progId: string;
  courseId: string;
  recordId: string;
  totalRecord: number;
  score: number = 5;
  filterer: number = 0;

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit(): void {
    this.isLoading = false;
    this.route.params.subscribe((params: Params) => {
      this.sessionId = params['sessionId'];
      this.progId = params['progId'];
      this.courseId = params['courseId'];
      this.recordId = params['recordId'];
    });

    this.totalRecord = this.attendanceService.getRecords(
      this.sessionId,
      this.progId,
      this.courseId,
    ).length;

    this.attendance = this.attendanceService
      .getAggregateRecord(this.sessionId, this.progId, this.courseId)
      .filter(
        (attendanceLine) =>
          attendanceLine.timesPresent / this.totalRecord > +this.filterer / 100,
      );
  }

  filter() {
    if (this.filterer > 100 || this.filterer < 0) {
      return;
    }
    this.attendance = [
      ...this.attendanceService.getAggregateRecord(
        this.sessionId,
        this.progId,
        this.courseId,
      ),
    ].filter(
      (attendanceLine) =>
        attendanceLine.timesPresent / this.totalRecord > this.filterer / 100,
    );
  }

  roundUp(number: number) {
    return Math.round(number);
  }
}
