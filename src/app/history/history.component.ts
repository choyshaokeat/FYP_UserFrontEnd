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
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  publicAuth: any;
  bookingHistory: any;

  constructor(
    private API: ApiFrontEndService,
    private DataService: DataService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private EncrDecrService: EncrDecrService,
    private fb: FormBuilder
  ) { }

  async ngOnInit() {
    this.subscribeData();
  }

  async subscribeData() {
    this.publicAuth = this.DataService.publicAuth;
    if (this.publicAuth == undefined || this.publicAuth == 'guest') {
      this.router.navigate(['/login']);
    } else {
      this.publicAuth = this.DataService.publicAuth;
      this.DataService.currentBookingHistory.subscribe(
        async data => {
          this.bookingHistory = data;
        });
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
