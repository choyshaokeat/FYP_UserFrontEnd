import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';

import { ApiFrontEndService } from '../../services/api-front-end.service';
import { ApiBackEndService } from '../../services/api-back-end.service';
import { DataService } from '../../services/data.service';
import { EncrDecrService } from '../../services/encdec.service';

declare var $: any;

@Component({
  selector: 'app-singleBooking',
  templateUrl: './singleBooking.component.html'
})

export class SingleBookingComponent implements OnInit {

  publicAuth: any;

  constructor(
    private API: ApiFrontEndService,
    private DataService: DataService,
    private EncrDecrService: EncrDecrService,
    private router: Router,
    private spinner: NgxSpinnerService,
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
    }
  }

  async modalEvent(type) {
    if (type == 'change_pw') {
      $('#modal_change_pw').modal('show');
    }
  }
}
