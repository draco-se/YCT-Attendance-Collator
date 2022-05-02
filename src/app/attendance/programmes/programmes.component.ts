import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Programme } from './../../shared/shared.model';
import { Component, OnInit, Renderer2 } from '@angular/core';
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
  backdrop: boolean = false;
  courseEdit: boolean = false;
  progIsLoading: boolean = false;
  error: string;

  constructor(
    private route: ActivatedRoute,
    private attendanceService: AttendanceService,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['year'];

      this.programmes = this.sort(this.attendanceService.getProgrammes(id));
      this.sessionId = id;

      this.attendanceService.sessionsChanged.subscribe(() => {
        this.programmes = this.sort(this.attendanceService.getProgrammes(id));
      });
    });
  }

  startEditProg(listEl: HTMLLIElement, event: Event) {
    event.stopPropagation();
    const head: HTMLHeadingElement = listEl.querySelector('h1');
    const form: HTMLFormElement = listEl.querySelector('.edit-cover');
    const detail: HTMLDetailsElement = listEl.querySelector('details');

    this.closeDetails(detail);
    this.renderer.setStyle(head, 'display', 'none');
    this.renderer.setStyle(form, 'display', 'flex');
  }

  onEditProg(form: NgForm, idx: number) {
    if (this.programmes[idx].title == form.value.edittedProg.trim()) {
      this.error = 'Use a diffent title!';
      alert(this.error);
      return;
    }

    this.progIsLoading = true;

    this.attendanceService
      .modifyProgramme(
        this.sessionId,
        this.programmes[idx]._id,
        form.value.edittedProg,
      )
      .subscribe({
        next: () => {
          this.error = '';
          this.progIsLoading = false;
        },
        error: async (err: HttpErrorResponse) => {
          console.log(err.error.message);
          this.error = err.error.message;
          alert(this.error);
          this.progIsLoading = false;
        },
        complete: () => console.info('Created Successfully'),
      });
  }

  closeEditProg(listEl: HTMLLIElement) {
    const head: HTMLHeadingElement = listEl.querySelector('h1');
    const form: HTMLFormElement = listEl.querySelector('.edit-cover');

    this.renderer.removeAttribute(head, 'style');
    this.renderer.removeAttribute(form, 'style');
  }

  deleteProg(progId: string, detail: HTMLDetailsElement) {
    this.progIsLoading = true;

    this.attendanceService.deleteProgramme(this.sessionId, progId).subscribe({
      next: () => {
        this.error = '';
        this.progIsLoading = false;
        this.closeDetails(detail);
      },
      error: async (err: HttpErrorResponse) => {
        console.log(err.error.message);
        this.closeDetails(detail);
        this.error = err.error.message;
        alert(this.error);
        this.progIsLoading = false;
      },
      complete: () => console.info('Created Successfully'),
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
    const programme: NodeList = programmes.querySelectorAll('.programme');

    courses.forEach((el: HTMLElement) => el.removeAttribute('style'));
    details.forEach((el: HTMLElement) => el.removeAttribute('style'));
    programme.forEach((el: HTMLLIElement) => this.closeEditProg(el));
  }
}
