import { environment } from './../../../environments/environment';
import { AuthService } from './../../auth/auth.service';
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
  link: string = '';

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
    private authService: AuthService,
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

      this.authService.user.subscribe((user) => {
        if (new Date(details.tokenResetExpiration) > new Date() && !!user) {
          this.link = `${environment.frontEndAddress}/attendance/${user.id}/${sessionId}/${progId}/${courseId}/${recordId}`;
        }
      });

      this.date = details.date.replaceAll('/', '-');
    });
  }

  copy(el: HTMLInputElement) {
    if (!navigator.clipboard) {
      el.select();
      return;
    }

    navigator.clipboard
      .writeText(el.value)
      .then(() => alert('Copied to clipboard'))
      .catch((err) => {
        console.log(err);
        alert('Error copying text! Try again or copy manually');
      });
  }

  share(el: HTMLInputElement) {
    if (!navigator.share) {
      el.select();
      return;
    }

    navigator.share({ url: el.value }).catch((err) => {
      console.log(err);
      alert('Error copying text! Try again or copy manually');
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
