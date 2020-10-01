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
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: ['./cook.component.scss']
})
export class CookComponent implements OnInit {

  @Output() searchReservationEvent: EventEmitter<any> = new EventEmitter();

  publicAuth: any;
  cookDetail: any=[""];
  allOrders: any;
  cookOrders: any ;
  cookOrdersLength: any = 0;
  modalData: any=[];
  form = this.fb.group({
    price: ['', [
      Validators.required,
    ]]
  })
  url: any;

  constructor(
    private API: ApiFrontEndService,
    private DataService: DataService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private EncrDecrService: EncrDecrService,
    private fb: FormBuilder
  ) { }

  async ngOnInit() {
    window.scroll(0, 0);
    await this.subscribeData();
    this.url = this.router.url;
    this.DataService.updatePage(this.url);
  }

  async subscribeData() {
    this.publicAuth = this.DataService.publicAuth;
    if (this.publicAuth == undefined || this.publicAuth == 'guest') {
      this.router.navigate(['/login']);
    } else {
      this.publicAuth = this.DataService.publicAuth;
      this.DataService.currentAllOrders.subscribe(
        async data => {
          this.allOrders = data;
        });
      this.DataService.currentCookOrders.subscribe(
        async data => {
          this.cookOrders = data;
        });
      this.cookDetail = await this.API.getClientInfo(this.publicAuth);
    }
  }

  submit() {
    console.log(this.form);
    if (this.form.status === 'VALID') {
      return new Promise(async (resolve, reject) => {
        try {
            var upload = {
              type: "price",
              cookID: this.publicAuth.clientID,
              price: this.form.value.price,
              orderID: this.modalData.orderID
            }
            var data = await this.API.updateOrder(upload);
            this.DataService.syncData('info');
            $('#modalGrab').modal('hide');
            var res = data;
            resolve(res);
        }
        catch (err) {
          console.error(data, err);
          reject(err);
        }
      });
    }
  }

  updateOrder(){
    return new Promise(async (resolve, reject) => {
      try {
        var upload = {
          type: "complete",
          orderID: this.modalData.orderID
        }
        var data = await this.API.updateOrder(upload);
        this.DataService.syncData('info');
        $('#modalDone').modal('hide');
      }
      catch (err) {
        console.error(data, err);
        reject(err);
      }
    });
  }

  checkLength(){
    this.cookOrdersLength = 0;
    for (let i = 0; i < this.cookOrders.length; i++) {
      console.log(this.cookOrders[i].orderStatus);
      if (this.cookOrders[i].orderStatus == 2) {this.cookOrdersLength++}
    }
  }

  async updateClientInfo() {
    var upload = {
      type: "order",
      orderID: this.modalData.orderID
    }
    var paymentType = await this.API.getOrders(upload);
    console.log(paymentType);
    var data = {
      type: paymentType[0].paymentMethod,
      clientID: this.DataService.publicAuth.clientID,
      foodPrice: this.modalData.foodPrice
    }
    console.log(data);
    return new Promise(async (resolve, reject) => {
      try {
        this.spinner.show();
        var data_client = await this.API.updateClientInfo(data);
        await this.DataService.syncData('info');
        await this.subscribeData();
        var res = { data_client };
        setTimeout(() => {this.spinner.hide();},500);
        resolve(res);
      }
      catch (err) {
        console.error(data, err);
        reject(err);
      }
    });
  }

  async registerCook(){
    var upload = {
      type: "registerCook",
      clientID: this.publicAuth.clientID
    }
    await this.API.updateClientInfo(upload);
    location.reload();
  }

  async modalEvent(type, data) {
    if (type == 'modalRegister') {
      $('#modalRegister').modal('show');
    } else {
      this.modalData = data;
      if (type == 'modalGrab') {
        $('#modalGrab').modal('show');
      } else if (type == 'modalDone') {
        $('#modalDone').modal('show');
      }
    }
  }
}
