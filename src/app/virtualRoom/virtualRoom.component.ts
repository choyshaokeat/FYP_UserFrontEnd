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
  selector: 'app-virtualRoom',
  templateUrl: './virtualRoom.component.html',
  styleUrls: ['./virtualRoom.component.scss']
})
export class VirtualRoomComponent implements OnInit {

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

  deleteVR() {

  }
  
  async modalEvent(type) {
    if (type == 'modalDeleteVR') {
      $('#modalDeleteVR').modal('show');
    }
  }
}
