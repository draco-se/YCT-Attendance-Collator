import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AttendanceService, Programme } from '../attendance.service';

@Component({
  selector: 'app-programmes',
  templateUrl: './programmes.component.html',
  styleUrls: ['./programmes.component.scss'],
})
export class ProgrammesComponent implements OnInit {
  programmes: Programme[] = [];
  sessionId: string;
  timeout: any;

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['year'];
      this.programmes = this.attendanceService.getProgrammes(id);

      this.sessionId = id;
    });
  }

  autoCloseDetails(detail: HTMLDetailsElement) {
    this.timeout = setTimeout(() => {
      this.closeDetails(detail);
    }, 5000);
  }

  closeDetails(detail: HTMLDetailsElement) {
    if (!detail.hasAttribute('open')) return;
    detail.removeAttribute('open');
    clearTimeout(this.timeout);
  }

  dropdown(listEl: HTMLLIElement, prog: HTMLUListElement) {
    const unordered: HTMLUListElement = listEl.querySelector('.courses');
    const detail: HTMLDetailsElement = listEl.querySelector('details');

    this.closedropdown(prog);
    unordered.style.display = 'block';
    detail.style.display = 'block';
  }

  closedropdown(programmes: HTMLUListElement) {
    const courses: NodeList = programmes.querySelectorAll('.courses');
    const details: NodeList = programmes.querySelectorAll('details');

    courses.forEach((el: HTMLElement) => el.removeAttribute('style'));
    details.forEach((el: HTMLElement) => el.removeAttribute('style'));
  }
}
