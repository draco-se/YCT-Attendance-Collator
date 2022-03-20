import { Component, OnInit } from '@angular/core';

export interface Course {
  title: string;
}

export interface Programme {
  title: string;
  courses: Course[];
}

@Component({
  selector: 'app-attendance-records',
  templateUrl: './attendance-records.component.html',
  styleUrls: ['./attendance-records.component.scss'],
})
export class AttendanceRecordsComponent implements OnInit {
  programmes: Programme[];

  constructor() {}

  ngOnInit(): void {
    this.programmes = [
      {
        title: 'ND1',
        courses: [
          { title: 'COM 121' },
          { title: 'COM 122' },
          { title: 'COM 123' },
          { title: 'COM 124' },
          { title: 'COM 125' },
        ],
      },
      {
        title: 'ND2',
        courses: [
          { title: 'COM 221' },
          { title: 'COM 222' },
          { title: 'COM 223' },
          { title: 'COM 224' },
          { title: 'COM 225' },
        ],
      },
      {
        title: 'ND3',
        courses: [
          { title: 'COM 221' },
          { title: 'COM 222' },
          { title: 'COM 223' },
          { title: 'COM 224' },
          { title: 'COM 225' },
        ],
      },
      {
        title: 'HND1',
        courses: [
          { title: 'COM 311' },
          { title: 'COM 312' },
          { title: 'COM 313' },
          { title: 'COM 314' },
          { title: 'COM 315' },
        ],
      },
      {
        title: 'HND2',
        courses: [
          { title: 'COM 321' },
          { title: 'COM 322' },
          { title: 'COM 323' },
          { title: 'COM 324' },
          { title: 'COM 325' },
        ],
      },
      {
        title: 'HND3',
        courses: [
          { title: 'COM 331' },
          { title: 'COM 332' },
          { title: 'COM 333' },
          { title: 'COM 334' },
          { title: 'COM 335' },
        ],
      },
    ];
  }

  dropdown(unordered: HTMLUListElement, prog: HTMLUListElement) {
    this.closedropdown(prog);
    unordered.style.display = 'block';
    // setTimeout(() => {
    //   unordered.style.transform = 'translateY(0)';
    //   unordered.style['-webkit-transform'] = 'translateY(0)';
    //   unordered.style['-moz-transform'] = 'translateY(0)';
    //   unordered.style['-o-transform'] = 'translateY(0)';
    // }, 300);
  }

  closedropdown(programmes: HTMLUListElement) {
    const courses: NodeList = programmes.querySelectorAll('.courses');

    Array.from(courses).forEach((el: HTMLElement) => {
      el.removeAttribute('style');
    });
  }
}
