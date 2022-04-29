import { Programme } from './../../shared/shared.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AttendanceService } from '../attendance.service';

@Component({
  selector: 'app-programmes',
  templateUrl: './programmes.component.html',
  styleUrls: ['./programmes.component.scss'],
})
export class ProgrammesComponent implements OnInit {
  programmes: Programme[] = [];
  sessionId: string;
  timeout: any;
  backdrop: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['year'];
      this.programmes = this.sort(this.attendanceService.getProgrammes(id));
      this.sessionId = id;
    });
  }

  sort(array: any[]) {
    const sortedArray = [...array].sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });

    return sortedArray;
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
