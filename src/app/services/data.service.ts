import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiFrontEndService } from './api-front-end.service';
import { EncrDecrService } from './encdec.service';
import { SocketioService } from './socketio.service';
import * as moment from 'moment';
//import { resolve } from 'dns';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private router: Router,
    private API: ApiFrontEndService,
    private EncrDecrService: EncrDecrService,
    private socketService: SocketioService,
  ) { }

  /* async socketIO(type, data) {
    if (type == 'emit') {
      console.log(data.merchantID);
      let syncData = {
        merchantID: data.merchantID,
        multipleModule: true,
        syncModule: ['cs_module', 'kt_module'],
      }
      this.socketService.emit('syncMerchant', syncData)
    } else if (type == 'listen') {
      this.socketService.listen('broadcastData').subscribe((data) => {
        this.updateBrodcastData(data);
        console.log(data);
      })
      this.socketService.listen('syncServer').subscribe((data) => {
        console.log(data);
      })
    }
  } */

  async callAll() {
    return new Promise<any>(async (resolve, reject) => {
      try {
        //console.log('callAll');
        //await this.socketIO('listen', undefined);
        var data = await this.API.getStudentInfo(this.publicAuth);
        //console.log(data);
        this.updateStudentInfo(await this.EncrDecrService.encryptObject('client', data[0]));
        this.updateBookingHistory(await this.API.getBookingInfo(data = { studentID: this.publicAuth.studentID, type: "bookingHistory" }));
        this.updateVRInfo(await this.API.getVirtualRoom(data = { vrCode: this.publicAuth.vrCode, type: "vrInfo" }));
        this.updateHistoryCount(await this.checkBookingHistoryCount());
        var i = await this.checkBookingHistoryCount();
        if (i > 0) {
          this.updateRoommate(await this.getRoommate());
        }
        resolve('ok');
      }
      catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }

  async syncData(module) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        if (module == "info") {
          var data = await this.API.getStudentInfo(this.publicAuth);
          //console.log(data);
          this.updateStudentInfo(await this.EncrDecrService.encryptObject('client', data[0]));
          this.updateBookingHistory(await this.API.getBookingInfo(data = { studentID: this.publicAuth.studentID, type: "bookingHistory" }));
          this.updateVRInfo(await this.API.getVirtualRoom(data = { vrCode: this.publicAuth.vrCode, type: "vrInfo" }));
          this.updateHistoryCount(await this.checkBookingHistoryCount());
          var i = await this.checkBookingHistoryCount();
          if (i > 0) {
            this.updateRoommate(await this.getRoommate());
          }
        }
        resolve('ok');
      }
      catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }

  async getRoommate() {
    var data;
    var roomNumber = await this.API.getBookingInfo(data = { studentID: this.publicAuth.studentID, type: "bookingHistory" });
    data = {
      type: "currentRoommates",
      roomNumber: roomNumber[0].roomNumber
    };
    var roommate = await this.API.getBookingInfo(data);
    return roommate;
  }

  async checkBookingHistoryCount() {
    var check = {
      type: "count",
      studentID: this.publicAuth.studentID
    }
    var count = await this.API.getBookingInfo(check);
    count = count[0].bookingHistoryCount;
    //console.log(count);
    return count;
  }

  // SocketIO
  /* private brodcastData = new BehaviorSubject('');
  currentBrodcastData = this.brodcastData.asObservable();
  updateBrodcastData(value) {
    this.brodcastData.next(value);
  } */

  // Service Aunthenticator
  public publicAuth: any;

  // Client Info
  private studentInfo = new BehaviorSubject('');
  currentStudentInfo = this.studentInfo.asObservable();
  updateStudentInfo(value) {
    this.studentInfo.next(value);
    this.publicAuth = this.EncrDecrService.decryptObject('client', value);
    localStorage.setItem('auth', value);
    //console.log(this.publicAuth);
  }

  public reset() {
    this.updateStudentInfo(this.EncrDecrService.encryptObject('client', 'guest'));
    localStorage.clear();
    sessionStorage.clear();
  }

  //booking
  private bookingHistory = new BehaviorSubject('');
  currentBookingHistory = this.bookingHistory.asObservable();
  updateBookingHistory(value) {
    this.bookingHistory.next(value);
    //console.log(value);
  }

  private roommate = new BehaviorSubject('');
  currentRoommate = this.roommate.asObservable();
  updateRoommate(value) {
    this.roommate.next(value);
    //console.log(value);
  }

  //Virtual Room
  private vrInfo = new BehaviorSubject('');
  currentVRInfo = this.vrInfo.asObservable();
  updateVRInfo(value) {
    this.vrInfo.next(value);
    //console.log(value);
  }

  //header
  private headerShown = new BehaviorSubject([]);
  currentHeaderShown = this.headerShown.asObservable();
  updateHeaderShown(value) {
    this.headerShown.next(value);
    //console.log(value);
  }

  private historyCount = new BehaviorSubject([]);
  currentHistoryCount = this.historyCount.asObservable();
  updateHistoryCount(value) {
    this.historyCount.next(value);
    //console.log(value);
  }
}