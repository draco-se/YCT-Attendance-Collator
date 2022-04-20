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
  clicked: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const sessionId = params['year'].toLowerCase();
      const progId = params['progId'].toLowerCase();
      const courseId = params['courseId'].toLowerCase();
      const recordId = params['recordId'].toLowerCase();
      const details = this.attendanceService.getRecord(
        sessionId,
        progId,
        courseId,
        recordId,
      );

      this.attendance = [...details.attendance];

      this.date = details.date.replaceAll('/', '-');
    });
  }

  dropdown(el: HTMLDivElement, list: HTMLUListElement) {
    const centered =
      'display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex;';
    if (!this.clicked) {
      el.nextElementSibling.setAttribute('style', centered);
      el.lastElementChild.setAttribute('style', 'transform: rotateZ(90deg)');
      this.clicked = true;
    } else {
      this.closeDropdown(list);
    }
  }

  closeDropdown(el: HTMLUListElement) {
    const arrow = el.querySelectorAll('.dropdown-arrow');
    const dropdown: NodeList = el.querySelectorAll('.status-opt');
    dropdown.forEach((el: HTMLDivElement, idx) => {
      if (arrow[idx].hasAttribute('style')) arrow[idx].removeAttribute('style');
      el.style.display = 'none';
    });
    this.clicked = false;
  }
}
