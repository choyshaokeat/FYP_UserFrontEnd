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
  vrInfo: any = [];
  vrCode: any;
  vrHost: any;
  vrHostInfo: any;
  vrRoommates: any;
  vrRoommatesInfo: any;

  constructor(
    private API: ApiFrontEndService,
    private DataService: DataService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private EncrDecrService: EncrDecrService,
    private fb: FormBuilder
  ) { }

  async ngOnInit() {
    this.spinner.show();
    await this.subscribeData();
    this.spinner.hide();
  }

  async subscribeData() {
    this.DataService.currentStudentInfo.subscribe(data =>
      this.publicAuth = this.EncrDecrService.decryptObject('client', data)
    );
    if (this.publicAuth == undefined || this.publicAuth == 'guest') {
      this.router.navigate(['/login']);
    } else {
      await this.DataService.callAll();
      await this.DataService.currentVRInfo.subscribe(
        async data => {
          this.vrInfo = data;
          this.vrCode = this.vrInfo[0]?.vrCode;
          this.vrHost = this.vrInfo[0]?.vrHost;
          this.vrRoommates = this.vrInfo[0]?.vrRoommates;
        });
      var data1 = {
        studentID: this.vrHost
      }
      this.vrHostInfo = await this.API.getStudentInfo(data1);
      var data2 = {
        type: "getVRRoommates",
        vrCode: this.vrCode,
        vrHost: this.vrHost
      }
      this.vrRoommatesInfo = await this.API.getStudentInfo(data2);
      //console.log(this.vrRoommatesInfo);
    }
  }

  async deleteVR() {
    var data = {
      type: "deleteVR",
      vrCode: this.vrCode
    }
    await this.API.updateStudentInfo(data);
    await this.API.updateVirtualRoom(data);
    this.DataService.callAll()
    $('#modalDeleteVR').modal('hide');
    this.router.navigate(['/home']);
  }

  async modalEvent(type) {
    if (type == 'modalDeleteVR') {
      $('#modalDeleteVR').modal('show');
    }
  }
}
