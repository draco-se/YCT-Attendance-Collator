import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  AttendanceRecord,
  AttendanceService,
  Programme,
} from '../attendance.service';

@Component({
  selector: 'app-attendance-records',
  templateUrl: './attendance-records.component.html',
  styleUrls: ['./attendance-records.component.scss'],
})
export class AttendanceRecordsComponent implements OnInit {
  clicked: boolean = false;

  dailyRecords: AttendanceRecord[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const title = params['year'].toLowerCase();
      const progId = params['progId'].toLowerCase();
      const courseId = params['courseId'].toLowerCase();

      this.dailyRecords = this.attendanceService.getRecords(
        title,
        progId,
        courseId,
      );
    });
  }

  dropDownRec(opt: HTMLLIElement) {
    const plus: HTMLElement = opt.querySelector('.plus');
    const records = opt.nextElementSibling;
    if (this.clicked == false) {
      plus.style.display = 'block';
      records.setAttribute('style', 'display: block;');
      this.clicked = true;
    } else {
      this.closeDropDown(opt);
    }
  }

  closeDropDown(opt: HTMLLIElement) {
    const plus: HTMLElement = opt.querySelector('.plus');
    const records = opt.nextElementSibling;

    plus.removeAttribute('style');
    records.removeAttribute('style');
    this.clicked = false;
  }

  // recordPage(idx) {
  //   setTimeout(
  //     () => this.router.navigate([idx], { relativeTo: this.route }),
  //     300,
  //   );
  // }
}
