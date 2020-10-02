import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiFrontEndService } from '../services/api-front-end.service';
import { DataService } from '../services/data.service';
import { EncrDecrService } from '../services/encdec.service';
import * as moment from 'moment'

declare var $: any;

@Component({
  selector: 'app-currentInfo',
  templateUrl: './currentInfo.component.html',
  styleUrls: ['./currentInfo.component.scss']
})
export class CurrentInfoComponent implements OnInit {

  publicAuth: any;

  constructor(
    private API: ApiFrontEndService,
    private DataService: DataService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private EncrDecrService: EncrDecrService,
    private fb: FormBuilder
  ) { }

  async ngOnInit() {
  }

  async subscribeData() {
    this.publicAuth = this.DataService.publicAuth;
    if (this.publicAuth == undefined || this.publicAuth == 'guest') {
      this.router.navigate(['/login']);
    } else {
      this.publicAuth = this.DataService.publicAuth;
    }
  }

  async modalEvent(type, data) {
    if (type == 'modalAddOrder') {
      $('#modalAddOrder').modal('show');
    } else {
      //console.log(this.modalData);
      if (type == 'modalRespond') {
        $('#modalRespond').modal('show');
      } else if (type == 'modalCancellation') {
        $('#modalCancellation').modal('show');
      }
    }
  }
}
