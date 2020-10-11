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
  roommates: any;

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
    this.getRoommate();
  }

  async subscribeData() {
    this.DataService.currentStudentInfo.subscribe(data =>
      this.publicAuth = this.EncrDecrService.decryptObject('client', data)
    );
    if (this.publicAuth == undefined || this.publicAuth == 'guest') {
      this.router.navigate(['/login']);
    } else {
      this.DataService.callAll();
      this.DataService.currentBookingHistory.subscribe(
        async data => {
          this.bookingHistory = data;
        });
    }
  }

  async getRoommate() {
    var data;
    var roomNumber = await this.API.getBookingInfo(data = { studentID: this.publicAuth.studentID, type: "bookingHistory" });
    data = {
      type: "currentRoommates",
      roomNumber: roomNumber[0].roomNumber
    };
    this.roommates = await this.API.getBookingInfo(data);
  }

}
