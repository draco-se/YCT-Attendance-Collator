import { AttendanceService } from './../attendance.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-record',
  templateUrl: './create-record.component.html',
  styleUrls: ['./create-record.component.scss'],
})
export class CreateRecordComponent implements OnInit {
  min: number = new Date().getFullYear() - 1;
  max: number = new Date().getFullYear() + 1;
  date: number = new Date().getMonth();

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {}

  dropdown(form: HTMLFormElement, idx: number) {
    let returned: boolean = false;
    const labels = form.querySelectorAll('label');
    labels.forEach((label) => {
      if (label.nextElementSibling.classList.contains('ng-invalid')) {
        returned = true;
        return;
      }
      label.classList.remove('display-input');
    });
    labels[idx].classList.add('display-input');
  }

  closeDropdown(e: Event, form: HTMLElement, idx: number) {
    e.stopPropagation();
    const labels = form.querySelectorAll('label');
    labels.forEach((label) => {
      if (label.nextElementSibling.classList.contains('ng-invalid')) return;
      label.classList.remove('display-input');
    });
    labels[idx].classList.add('display-input');
  }

  submit(form: NgForm) {
    this.attendanceService.createSession(
      form.value.session,
      form.value.programme,
      form.value.course,
      form.value.matricNumber,
      form.value.indexNumber,
      form.value.totalNumber,
    ).subscribe();
  }
}
