import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AttendanceService, Programme } from '../attendance.service';

@Component({
  selector: 'app-programmes',
  templateUrl: './programmes.component.html',
  styleUrls: ['./programmes.component.scss']
})
export class ProgrammesComponent implements OnInit {
  programmes: Programme[] = [];

  constructor(private route: ActivatedRoute, private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const title = params['year'].toLowerCase();
      this.programmes = this.attendanceService.getProgrammes(title.replace('-', '/'))
    });
  }

  dropdown(unordered: HTMLUListElement, prog: HTMLUListElement) {
    this.closedropdown(prog);
    unordered.style.display = 'block';
  }

  closedropdown(programmes: HTMLUListElement) {
    const courses: NodeList = programmes.querySelectorAll('.courses');

    Array.from(courses).forEach((el: HTMLElement) => {
      el.removeAttribute('style');
    });
  }

}
