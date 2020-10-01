import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supportHeader',
  templateUrl: './supportHeader.component.html'
})
export class SupportHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.scroll(0, 0);
  }

}
