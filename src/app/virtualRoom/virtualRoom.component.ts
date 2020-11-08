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
  vrCapacity: any;
  studentIDs: any = [];
  studentNames: any = [];
  studentEmails: any = [];
  bedAlphabet = ['A','B','C','D','E','F','G','H']

  village: any;
  building: any;
  room: any;
  showBuilding: any;
  showRoom: any;
  showBookingDetails: any = false;
  selectedVillage: any;
  selectedBuilding: any;
  selectedRoom: any = [];
  numberOfSemester = 1;
  minNumberOfSemester: any = 1;
  maxNumberOfSemester: any;
  totalFees: any;
  checkInDate: any;
  checkOutDate: any;

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
    await this.getVillage();
    await this.getStudentIDs();
    await this.getBookingDocument();
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
          this.vrCapacity = this.vrInfo[0]?.vrCapacity;
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

  async getBookingDocument() {
    var sem = await this.API.getBookingDocument(null);
    this.maxNumberOfSemester = sem[0].maxBookingSemester;
  }

  getStudentIDs() {
    this.studentIDs[0] = this.vrHostInfo[0].studentID;
    this.studentNames[0] = this.vrHostInfo[0].studentName;
      this.studentEmails[0] = this.vrHostInfo[0].studentEmail;
    var j = this.vrRoommatesInfo.length
    for (var i = 0; i < j; i++) {
      this.studentIDs[i+1] = this.vrRoommatesInfo[i].studentID;
      this.studentNames[i+1] = this.vrRoommatesInfo[i].studentName;
      this.studentEmails[i+1] = this.vrRoommatesInfo[i].studentEmail;
    }
    console.log(this.studentIDs, this.studentNames, this.studentEmails);
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

  async getVillage() {
    var data = {
      type: "getVillage",
      gender: this.publicAuth.studentGender
    }
    this.village = await this.API.getRoomInfo(data);
    //console.log(this.village);
  }

  async getBuilding(village) {
    var data = {
      type: "getBuilding",
      village: village,
      gender: this.publicAuth.studentGender
    }
    this.building = await this.API.getRoomInfo(data);
    this.showRoom = false;
    this.showBuilding = true;
    this.selectedVillage = village;
    //console.log(this.village);
  }

  async getRoom(building) {
    var data = {
      type: "getBulkRoom",
      village: this.selectedVillage,
      block: building,
      capacity: this.vrCapacity,
      gender: this.publicAuth.studentGender
    }
    this.room = await this.API.getRoomInfo(data);
    this.showRoom = true;
    this.selectedBuilding = building;
    //console.log(this.room);
  }

  async selectRoom(selectedRoom) {
    this.selectedRoom = selectedRoom;
    this.showBookingDetails = true;
    this.calculateFees();
  }

  async refreshData() {
    var data = {
      type: "getBulkRoom",
      village: this.selectedVillage,
      block: this.selectedBuilding,
      capacity: this.vrCapacity,
      gender: this.publicAuth.studentGender
    }
    this.room = await this.API.getRoomInfo(data);
  }

  async checkRoomAvailability() {
    var data = {
      type: "checkBulkRoomAvailability",
      roomNumber: this.selectedRoom.roomNumber,
    }
    var result = await this.API.getRoomInfo(data);
    //console.log(result);
    if (result[0].capacity == result[0].currentCapacity) {
      return true;
    } else {
      return false;
    }
  }

  addQuantity() {
    if (this.numberOfSemester < this.maxNumberOfSemester) {
      this.numberOfSemester += 1;
      this.calculateFees();
    }
  }

  deleteQuantity() {
    if (this.numberOfSemester > this.minNumberOfSemester) {
      this.numberOfSemester -= 1;
      this.calculateFees();
    }
  }

  calculateFees() {
    this.totalFees = this.selectedRoom.unitPrice*this.numberOfSemester;
  }

  async calculateCheckInOutDate() {
    var tempDate = await this.API.getBookingDocument(null);
    var checkInDate = [];
    var checkOutDate = [];
    checkInDate.push(moment(tempDate[0].sem1CheckInDate).format("MM-DD"));
    checkInDate.push(moment(tempDate[0].sem2CheckInDate).format("MM-DD"));
    checkInDate.push(moment(tempDate[0].sem3CheckInDate).format("MM-DD"));
    checkOutDate.push(moment(tempDate[0].sem1CheckOutDate).format("MM-DD"));
    checkOutDate.push(moment(tempDate[0].sem2CheckOutDate).format("MM-DD"));
    checkOutDate.push(moment(tempDate[0].sem3CheckOutDate).format("MM-DD"));
    
    var tempCheckInDate = [];
    tempCheckInDate.push(moment(tempDate[0].sem1CheckInDate).set('year', 2000).unix());
    tempCheckInDate.push(moment(tempDate[0].sem2CheckInDate).set('year', 2000).unix());
    tempCheckInDate.push(moment(tempDate[0].sem3CheckInDate).set('year', 2000).unix());

    console.log(tempCheckInDate);
    
    for (let i=0; i<=2; i++) {
      if( moment().set('year', 2000).unix() < tempCheckInDate[i]) {
        this.checkInDate = moment(moment().format("YYYY") + "-" + checkInDate[i]).utc().format("YYYY-MM-DD HH:mm:ss");
        console.log(this.checkInDate); console.log("i: ", i);
        if ((i + this.numberOfSemester) > 3) {
          var year = Math.floor((i + this.numberOfSemester)/3); console.log(year);
          var checkOutSem = (i + this.numberOfSemester) % 3; console.log(checkOutSem);
          if ( checkOutSem == 0) {
            var checkOutYear = moment().add((year - 1), 'y').format("YYYY");
            this.checkOutDate = moment(checkOutYear + "-" + checkOutDate[2]).utc().format("YYYY-MM-DD HH:mm:ss");
          } else {
            var checkOutYear = moment().add((year), 'y').format("YYYY");
            this.checkOutDate = moment(checkOutYear + "-" + checkOutDate[checkOutSem - 1]).utc().format("YYYY-MM-DD HH:mm:ss");
          }
          break;
        } else { console.log(this.numberOfSemester);
          if (i == 0) {
            this.checkOutDate = moment(moment().format("YYYY") + "-" + checkOutDate[this.numberOfSemester-1]).utc().format("YYYY-MM-DD HH:mm:ss");
          } else if (i == 1) {
            this.checkOutDate = moment(moment().format("YYYY") + "-" + checkOutDate[this.numberOfSemester]).utc().format("YYYY-MM-DD HH:mm:ss");
          } else {
            this.checkOutDate = moment(moment().format("YYYY") + "-" + checkOutDate[this.numberOfSemester+1]).utc().format("YYYY-MM-DD HH:mm:ss");
          }
          break;
        }
      } else if( moment().set('year', 2000).unix() > tempCheckInDate[2] ) {
        i = 0
        this.checkInDate = moment(moment().add(1, 'y').format("YYYY") + "-" + checkInDate[0]).utc().format("YYYY-MM-DD HH:mm:ss");
        //console.log(this.checkInDate);
        console.log("gg");
        if ((i + this.numberOfSemester) > 3) {
          var year = Math.floor((i + this.numberOfSemester)/3);
          if ( year >= 1) {
            var checkOutSem = (i + this.numberOfSemester) % 3;
            if ( checkOutSem == 0) {
              var checkOutYear = moment().add((year), 'y').format("YYYY");
              this.checkOutDate = moment(checkOutYear + "-" + checkOutDate[2]).utc().format("YYYY-MM-DD HH:mm:ss");
            } else {
              var checkOutYear = moment().add((year + 1), 'y').format("YYYY");
              this.checkOutDate = moment(checkOutYear + "-" + checkOutDate[checkOutSem - 1]).utc().format("YYYY-MM-DD HH:mm:ss");
            }
            break;
          }
        } else {
          this.checkOutDate = moment(moment().add(1, 'y').format("YYYY") + "-" + checkOutDate[this.numberOfSemester - 1]).utc().format("YYYY-MM-DD HH:mm:ss");
        }
        break;
      }
    }

  }

  async submit() {
    await this.calculateCheckInOutDate();
    var availability = await this.checkRoomAvailability();
    if (availability == true) {
      var j = this.studentIDs.length;
      //console.log(j);
      for (var i = 0; i < j; i++) {
        var data1 = {
          type: "updateRoomInfo",
          roomNumber: this.selectedRoom.roomNumber,
          bed: this.bedAlphabet[i],
          studentID: this.studentIDs[i]
        }
        await this.API.updateStudentInfo(data1);
  
        var data2 = {
          type: "updateRoomInfo",
          roomNumber: this.selectedRoom.roomNumber,
          bed: this.bedAlphabet[i]
        }
        await this.API.updateRoomInfo(data2);

        var data3 = {
          type: "createBookingHistory",
          studentID: this.studentIDs[i],
          roomNumber: this.selectedRoom.roomNumber,
          village: this.selectedRoom.village,
          block: this.selectedRoom.block,
          level: this.selectedRoom.level,
          bed: this.bedAlphabet[i],
          aircond: this.selectedRoom.aircond,
          fees: this.selectedRoom.price*this.numberOfSemester,
          status: "Booked",
          bookingDate: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
          expectedCheckInDate: this.checkInDate,
          expectedCheckOutDate: this.checkOutDate,
          numberOfSemester: this.numberOfSemester 
        }
        await this.API.updateBookingInfo(data3);

        var data4 = {
          type: "updateCurrentCapacity",
          roomNumber: this.selectedRoom.roomNumber,
        }
        await this.API.updateRoomInfo(data4);

        var data = {
          type: "deleteVR",
          vrCode: this.vrCode
        }
        await this.API.updateVirtualRoom(data);
  
        var data5 = {
          type: "bookingConfirmation",
          receiver: this.studentEmails[i],
          subject: "Roomy Booking Confirmation",
          studentName: this.studentNames[i],
          studentID: this.studentIDs[i],
          roomNumber: this.selectedRoom.roomNumber,
          bed: this.bedAlphabet[i],
          aircond: this.selectedRoom.aircond,
          numberOfSemester: this.numberOfSemester,
          fees: this.selectedRoom.price*this.numberOfSemester,
          expectedCheckInDate: moment(this.checkInDate).zone(480).add(1, 'day').format("YYYY-MM-DD"),
          expectedCheckOutDate: moment(this.checkOutDate).zone(480).add(1, 'day').format("YYYY-MM-DD"),
        }
        await this.API.sendEmail(data5);

        //console.log(data1);
        //console.log(data2);
        //console.log(data3);
        //console.log(data4);
      }
      this.DataService.callAll();
      $('#bookSucessfully').modal('show');
      await this.sleep(5000).then(() => { $('#bookSucessfully').modal('hide'); });
      this.router.navigate(['/history']);
      //console.log("Done");
    } else {
      $('#roomOccupied').modal('show');
      this.refreshData();
      this.clearCart();
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  clearCart() {
    this.showBookingDetails = false;
    this.selectedRoom = null;
  }

  async modalEvent(type) {
    if (type == 'modalDeleteVR') {
      $('#modalDeleteVR').modal('show');
    } else if (type == 'modalPassword') {
      $('#modalPassword').modal('show');
    }
  }
}
