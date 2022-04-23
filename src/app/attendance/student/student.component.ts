import { StudentService } from '../student.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  isRegistered: boolean = false;
  matricNum: string = '';
  isLoading: boolean = false;
  startPos = 0;
  currentTranslate = 0;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.matricNum = this.studentService.studentAuthDetails.matricNumber;
    this.isRegistered = this.studentService.studentAuthDetails.isRegistered;
  }

  isTouchDevice() {
    return window.ontouchstart !== undefined;
  }

  onTouchStart(e) {
    if (!this.isTouchDevice()) return;
    this.startPos = e.touches[0].clientY;
  }

  onTouchMove(e, slider: HTMLDivElement) {
    if (!this.isTouchDevice()) return;
    const currentPosition = e.touches[0].clientY;
    this.currentTranslate = currentPosition - this.startPos;
    if (this.currentTranslate > 0) {
      this.setSliderPosition(slider);
    } else {
      slider.style.transform = `translateY(${0}%)`;
    }
  }

  onTouchEnd(slider: HTMLDivElement) {
    if (!this.isTouchDevice()) return;
    const movedBy = this.currentTranslate;

    console.log(this.currentTranslate);
    // // if moved enough negative then snap to next slide if there is one
    if (movedBy > slider.clientHeight / 2) {
      slider.style.transform = `translateY(${90}%)`;
      this.close(slider);
    } else {
      slider.style.transform = `translateY(${0}%)`;
    }
    this.startPos = 0;
    this.currentTranslate = 0;
  }

  setSliderPosition(slider: HTMLDivElement) {
    slider.style.transform = `translateY(${this.currentTranslate}px)`;
  }

  close(el: HTMLDivElement) {
    el.classList.add('slide-out');
    setTimeout(() => {
      this.studentService.close();
    }, 300);
  }
}
