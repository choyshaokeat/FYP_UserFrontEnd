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
  selector: 'app-bulkBooking',
  templateUrl: './bulkBooking.component.html'
})

export class BulkBookingComponent implements OnInit {

  roomCapacity = 2;
  minRoomCapacity = 2;
  maxRoomCapacity = 4;

  constructor(
    private router: Router,
    private API: ApiFrontEndService,
    private DataService: DataService,
    private EncrDecrService: EncrDecrService,
    private spinner: NgxSpinnerService,
  ) { }

  async ngOnInit() {
  }

  addQuantity() {
    if (this.roomCapacity < this.maxRoomCapacity) {
      this.roomCapacity += 1
    }
  }

  deleteQuantity() {
    if (this.roomCapacity > this.minRoomCapacity) {
      this.roomCapacity -= 1
    }
  }

  createVR() {
    this.spinner.show();
    $('#modalCreateVR').modal('hide');
    this.router.navigate(['/virtualRoom']);
    this.spinner.hide();
  }

  joinVR() {
    this.spinner.show();
    $('#modalJoinVR').modal('hide');
    this.router.navigate(['/virtualRoom']);
    this.spinner.hide();
  }

  async modalEvent(type) {
    if (type == 'modalCreateVR') {
      $('#modalCreateVR').modal('show');
    } else if (type == 'modalJoinVR') {
      $('#modalJoinVR').modal('show');
    }
  }
}
