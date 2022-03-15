import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('nav') navBar: ElementRef<HTMLElement>;
  @ViewChild('backdrop') backdrop: ElementRef<HTMLElement>;

  constructor() {}

  ngOnInit(): void {}

  openNav() {
    const nav = this.navBar.nativeElement;
    const backdrop = this.backdrop.nativeElement;
    nav.style.animation = 'slideIn 0.5s linear';
      nav.style.display = 'flex';
      backdrop.style.display ='block';
      setTimeout(() => {
        nav.style.right = '0';
      }, 500);
  }

  closeNav() {
    const nav = this.navBar.nativeElement;
    const backdrop = this.backdrop.nativeElement;
    nav.style.animation = 'slideOut 0.5s linear';
    nav.style.right = '-70vw';
    setTimeout(() => {
      nav.style.display = 'none';
      backdrop.style.display ='none';
    }, 500);
  }
}
