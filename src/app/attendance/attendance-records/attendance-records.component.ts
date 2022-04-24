import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AttendanceRecord, AttendanceService } from '../attendance.service';

@Component({
  selector: 'app-attendance-records',
  templateUrl: './attendance-records.component.html',
  styleUrls: ['./attendance-records.component.scss'],
})
export class AttendanceRecordsComponent implements OnInit {
  clicked: boolean = false;
  title: string;

  dailyRecords: AttendanceRecord[];

  constructor(
    private route: ActivatedRoute,
    // private router: Router,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const title = params['year'].toLowerCase();
      const progId = params['progId'].toLowerCase();
      const courseId = params['courseId'].toLowerCase();

      this.title = this.attendanceService
        .getProgrammes(title)
        .find((programme) => programme._id == progId)
        .courses.find((course) => course._id == courseId).title;

      this.dailyRecords = this.attendanceService.getRecords(
        title,
        progId,
        courseId,
      );
    });
  }
}
