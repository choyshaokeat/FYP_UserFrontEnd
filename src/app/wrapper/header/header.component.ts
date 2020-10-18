import { Component, OnInit, HostListener } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ApiFrontEndService } from '../../services/api-front-end.service';
import { DataService } from '../../services/data.service';
import { EncrDecrService } from '../../services/encdec.service';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  sidebarClick: any;
  bookingHistoryCount: any;
  public publicAuth: any;

  constructor(
    private API: ApiFrontEndService,
    private DataService: DataService,
    private router: Router,
    private EncrDecrService: EncrDecrService,
    private spinner: NgxSpinnerService
  ) { }

  async ngOnInit() {
    await this.subscribeData();
  }

  async subscribeData() {
    this.DataService.currentStudentInfo.subscribe(data =>
      this.publicAuth = this.EncrDecrService.decryptObject('client', data)
    );
    if (this.publicAuth == undefined || this.publicAuth == 'guest') {
      this.router.navigate(['/login']);
    } else {
      this.DataService.callAll();
      this.DataService.currentHistoryCount.subscribe(
        async data => {
          this.bookingHistoryCount = data;
        });
    }
  }

  logOut() {
    this.spinner.show();
    this.DataService.reset();
    this.DataService.callAll();
    this.spinner.hide();
    this.router.navigate(['/login']);
  }


  async modalEvent(type) {
    if (type == 'modalBook') {
      $('#modalBook').modal('show');
    }
  }

}
