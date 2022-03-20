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
        courses: [],
      },
      {
        title: 'HND1',
        courses: [],
      },
      {
        title: 'HND2',
        courses: [],
      },
      {
        title: 'HND3',
        courses: [],
      },
    ];
  }
}
