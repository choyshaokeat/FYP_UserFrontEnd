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

  public publicAuth: any;
  roomCapacity = 2;
  minRoomCapacity = 2;
  maxRoomCapacity = 4;
  vrInfo: any;
  createVRForm = this.fb.group({
    vrPassword: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      Validators.minLength(8),
    ]],
  })
  joinVRForm = this.fb.group({
    vrCode: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern('^[0-9]*$'),
    ]],
    vrPassword: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      Validators.minLength(8),
    ]]
  })

  constructor(
    private router: Router,
    private API: ApiFrontEndService,
    private DataService: DataService,
    private EncrDecrService: EncrDecrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) { }

  async ngOnInit() {
    this.subscribeData();
  }

  async subscribeData() {
    this.DataService.currentStudentInfo.subscribe(data =>
      this.publicAuth = this.EncrDecrService.decryptObject('client', data)
    );
  }

  get c() {
    return this.createVRForm.controls;
  }

  get j() {
    return this.joinVRForm.controls;
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

  async createVR() {
    if (this.createVRForm.status === 'VALID') {
      this.spinner.show();
      var vrData = {
        type: "createVR",
        vrPassword: this.createVRForm.get('vrPassword').value,
        vrCapacity: this.roomCapacity,
        vrHost: this.publicAuth.studentID
      }
      //console.log(vrData);
      await this.API.updateVirtualRoom(vrData);
      var updateBookingStatus = {
        type: "bookingStatus",
        studentID: this.publicAuth.studentID,
        bookingStatus: 1
      }
      await this.API.updateStudentInfo(updateBookingStatus);
      await this.DataService.syncData('info');
      $('#modalCreateVR').modal('hide');
      this.router.navigate(['/virtualRoom']);
      this.spinner.hide();
    };
  }

  async joinVR() {
    this.spinner.show();
    var data = {
      type: "roomAvailablityCheck",
      vrCode: parseInt(this.joinVRForm.get('vrCode').value, 10)
    }
    var vrCount = await this.API.getVirtualRoom(data);
    if (vrCount[0].count == 1) {
      data = {
        type: "capacityCheck",
        vrCode: parseInt(this.joinVRForm.get('vrCode').value, 10)
      }
      this.vrInfo = await this.API.getVirtualRoom(data);
      if (this.vrInfo[0].vrCapacity > this.vrInfo[0].currentCapacity && this.vrInfo[0].vrPassword == this.joinVRForm.get('vrPassword').value) {
        var roommates;
        if (this.vrInfo[0].vrRoommates == null) {
          roommates = this.publicAuth.studentID;
        } else {
          roommates = this.vrInfo[0].vrRoommates + ";" + this.publicAuth.studentID;
        }
        var updateRoomData = {
          type: "joinVR",
          vrRoommates: roommates,
          vrCode: parseInt(this.joinVRForm.get('vrCode').value, 10)
        }
        await this.API.updateVirtualRoom(updateRoomData);
        $('#modalJoinVR').modal('hide');
        this.router.navigate(['/virtualRoom']);
        this.spinner.hide();
      } else {
        $('#modalJoinVR').modal('hide');
        this.spinner.hide();
        this.modalEvent("roomFullError");
      }
    } else {
      $('#modalJoinVR').modal('hide');
      this.spinner.hide();
      this.modalEvent("roomNotFound");
    }
  }

  async modalEvent(type) {
    if (type == 'modalCreateVR') {
      $('#modalCreateVR').modal('show');
    } else if (type == 'modalJoinVR') {
      $('#modalJoinVR').modal('show');
    } else if (type == 'roomFullError') {
      $('#modalCreateVR').modal('show');
    } else if (type == 'roomNotFound') {
      $('#modalCreateVR').modal('show');
    }
  }
}
