import { Injectable } from '@angular/core';

export interface Course {
  title: string;
}

export interface Programme {
  title: string;
  courses: Course[];
}

export interface Sessions {
  title: string;
  programmes: Programme[];
}

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  sessions: Sessions[] = [
    {
      title: '2021/2022',
      programmes: [
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
      ],
    },
    {
      title: '2020/2021',
      programmes: [
        {
          title: 'ND1',
          courses: [
            { title: 'COM 121' },
            { title: 'COM 122' },
            { title: 'COM 123' },
          ],
        },
        {
          title: 'ND2',
          courses: [
            { title: 'COM 221' },
            { title: 'COM 222' },
            { title: 'COM 223' },
          ],
        },
        {
          title: 'HND1',
          courses: [
            { title: 'COM 311' },
            { title: 'COM 312' },
            { title: 'COM 313' },
          ],
        },
        {
          title: 'HND2',
          courses: [
            { title: 'COM 321' },
            { title: 'COM 322' },
            { title: 'COM 323' },
          ],
        },
      ],
    },
    {
      title: '2019/2020',
      programmes: [],
    },
    {
      title: '2018/2019',
      programmes: [],
    },
    {
      title: '2017/2018',
      programmes: [],
    },
  ];

  constructor() {}

  getSessions() {
    return this.sessions.map((session) => session.title);
  }

  getProgrammes(title: string) {
    const session = this.sessions.find((session) => (session.title == title));
    return session.programmes;
  }
}
