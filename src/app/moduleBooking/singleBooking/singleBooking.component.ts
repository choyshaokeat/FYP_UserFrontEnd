import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';

import { ApiFrontEndService } from '../../services/api-front-end.service';
import { ApiBackEndService } from '../../services/api-back-end.service';
import { DataService } from '../../services/data.service';
import { EncrDecrService } from '../../services/encdec.service';
//import { resolve } from 'dns';

declare var $: any;

@Component({
  selector: 'app-singleBooking',
  templateUrl: './singleBooking.component.html'
})

export class SingleBookingComponent implements OnInit {

  publicAuth: any;
  village: any;
  building: any;
  room: any;
  showBuilding: any;
  showRoom: any;
  showBookingDetails: any = false;
  selectedVillage: any;
  selectedBuilding: any;
  selectedRoom: any = [];
  availableRoomCapacity: any;
  showSubmitButton: any = false;
  selectedRoomCapacity: any;

  constructor(
    private API: ApiFrontEndService,
    private DataService: DataService,
    private EncrDecrService: EncrDecrService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  async ngOnInit() {
    await this.subscribeData();
    await this.getVillage();
  }

  async subscribeData() {
    this.DataService.currentStudentInfo.subscribe(data =>
      this.publicAuth = this.EncrDecrService.decryptObject('client', data)
    );
    if (this.publicAuth == undefined || this.publicAuth == 'guest') {
      this.router.navigate(['/login']);
    }
  }

  async getVillage() {
    var data = {
      type: "getVillage"
    }
    this.village = await this.API.getRoomInfo(data);
    console.log(this.village);
  }

  async getBuilding(village) {
    var data = {
      type: "getBuilding",
      village: village
    }
    this.building = await this.API.getRoomInfo(data);
    this.showRoom = false;
    this.showBuilding = true;
    this.selectedVillage = village;
    console.log(this.village);
  }

  async getRoom(building) {
    var data = {
      type: "getRoom",
      village: this.selectedVillage,
      block: building
    }
    this.room = await this.API.getRoomInfo(data);
    this.showRoom = true;
    this.selectedBuilding = building;
    console.log(this.room);
  }

  async getRoomCapacity() {
    var data = {
      type: "getRoomCapacity",
      village: this.selectedVillage,
      block: this.selectedBuilding
    }
    this.availableRoomCapacity = await this.API.getRoomInfo(data);
  }

  async selectRoom(selectedRoom) {
    this.selectedRoom = selectedRoom;
    this.showBookingDetails = true;
  }

  selectRoomCapacity(capacity) {
    this.showSubmitButton = true;
    this.selectedRoomCapacity = capacity;
  }

  async filterRoom() {
    var data = {
      type: "filterRoom",
      village: this.selectedVillage,
      block: this.selectedBuilding,
      capacity: this.selectedRoomCapacity
    }
    this.room = await this.API.getRoomInfo(data);
    $('#filterRoom').modal('hide');
  }

  async resetFilter() {
    var data = {
      type: "getRoom",
      village: this.selectedVillage,
      block: this.selectedBuilding,
    }
    this.room = await this.API.getRoomInfo(data);
    $('#filterRoom').modal('hide');
  }

  async checkRoomAvailability() {
    var data = {
      type: "checkRoomAvailability",
      roomNumber: this.selectedRoom.roomNumber,
      bed: this.selectedRoom.bed,
    }
    var result = await this.API.getRoomInfo(data);
    console.log(result);
    if (result[0].status == 0) {
      return true;
    } else {
      return false;
    }
  }

  async submit() {
    var availability = await this.checkRoomAvailability()
    if (availability == true) {
      var data = {
        type: "updateRoomInfo",
        roomNumber: this.selectedRoom.roomNumber,
        bed: this.selectedRoom.bed
      }
      await this.API.updateStudentInfo(data);
      
      console.log("Done")
    } else {
      $('#roomOccupied').modal('show');
      this.resetFilter();
    }
  }

  async modalEvent(type) {
    if (type == 'filterRoom') {
      $('#filterRoom').modal('show');
    }
  }
}
