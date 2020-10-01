import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiFrontEndService } from './api-front-end.service';
import { EncrDecrService } from './encdec.service';
import { SocketioService } from './socketio.service';
import * as moment from 'moment';


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

  async socketIO(type, data) {
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
  }

  async callAll() {
    return new Promise<any>(async (resolve, reject) => {
      try {
        console.log('callAll');
        // Socket IO
        await this.socketIO('listen', undefined);
        var type;
        this.updateOrders(await this.getOrders(this.publicAuth));
        this.updateAllOrders(await this.getOrders(type = {type: "all"}));
        this.updateCookOrders(await this.getOrders(type = {type: "cook", cookID: this.publicAuth.clientID}));
        this.updateAccountAmount(await this.API.getAccount(this.publicAuth.clientID));
        //console.log(await this.getOrders(this.publicAuth));
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
          // Client Info
          var data = await this.getClientInfo(this.publicAuth);
          var type;
          this.updateClientInfo(await this.EncrDecrService.encryptObject('client', data[0]));
          this.updateOrders(await this.getOrders(this.publicAuth));
          this.updateAllOrders(await this.getOrders(type = {type: "all"}));
          this.updateCookOrders(await this.getOrders(type = {type: "cook", cookID: this.publicAuth.clientID}));
          this.updateAccountAmount(await this.API.getAccount(this.publicAuth.clientID));
        }
        resolve('ok');
      }
      catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }


  // Client Info
  async getClientInfo(value) {
    return new Promise(async (resolve, reject) => {
      try {
        var res = await this.API.getClientInfo(value);
        resolve(res);
      }
      catch (err) {
        console.error(res, err);
        reject(err);
      }
    });
  }

  async getOrders(value) {
    return new Promise(async (resolve, reject) => {
      try {
        var res = await this.API.getOrders(value);
        resolve(res);
      }
      catch (err) {
        console.error(res, err);
        reject(err);
      }
    });
  }

  // Observable
  // SocketIO
  private brodcastData = new BehaviorSubject('');
  currentBrodcastData = this.brodcastData.asObservable();

  updateBrodcastData(value) {
    this.brodcastData.next(value);
  }
  // Service Aunthenticator
  public publicAuth: any;

  // Client Info
  private clientInfo = new BehaviorSubject('');
  currentClientInfo = this.clientInfo.asObservable();

  updateClientInfo(value) {
    console.log(value);
    this.clientInfo.next(value);
    this.publicAuth = this.EncrDecrService.decryptObject('client', value);
  }

  // Payment
  private orderInfo = new BehaviorSubject('');
  currentOrderInfo = this.orderInfo.asObservable();
  updateOrderInfo(value) {
    this.orderInfo.next(value);
  }

  private paymentInfo = new BehaviorSubject('');
  currentPaymentInfo = this.paymentInfo.asObservable();
  updatePaymentInfo(value) {
    this.paymentInfo.next(value);
  }

  // Account
  private loginDetails = new BehaviorSubject('');
  currentLoginDetails = this.loginDetails.asObservable();
  updateLoginDetails(value) {
    this.loginDetails.next(value);
  }

  private errorDetails = new BehaviorSubject({
    title: '',
    msg1: '',
    msg2: '',
    msg3: '',
    trigger: false
  });
  current_errorDetails = this.errorDetails.asObservable();
  updateErrorDetails(value) {
    this.errorDetails.next(value);
  }

  public reset() {
    this.updateClientInfo(this.EncrDecrService.encryptObject('client', 'guest'));
    localStorage.clear();
    sessionStorage.clear();
  }

  private accountAmount = new BehaviorSubject([]);
  currentAccountAmount = this.accountAmount.asObservable();
  updateAccountAmount(value) {
    this.accountAmount.next(value);
  }

  // Orders
  private orders = new BehaviorSubject([]);
  currentOrders = this.orders.asObservable();
  updateOrders(value) {
    this.orders.next(value);
  }

  private allOrders = new BehaviorSubject([]);
  currentAllOrders = this.allOrders.asObservable();
  updateAllOrders(value) {
    this.allOrders.next(value);
  }

  private cookOrders = new BehaviorSubject([]);
  currentCookOrders = this.cookOrders.asObservable();
  updateCookOrders(value) {
    this.cookOrders.next(value);
  }

  //paging
  private page = new BehaviorSubject([]);
  currentPage = this.page.asObservable();
  updatePage(value) {
    this.page.next(value);
    //console.log(value);
  }
}