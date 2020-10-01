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
  selector: 'app-eat',
  templateUrl: './eat.component.html',
  styleUrls: ['./eat.component.scss']
})
export class EatComponent implements OnInit {

  @Output() searchReservationEvent: EventEmitter<any> = new EventEmitter();

  publicAuth: any;
  orderDetails: any;
  modalData: any = [];
  choosedPayment: any = false;
  paymentType: any;
  url: any;
  form = this.fb.group({
    foodTitle: ['', [
      Validators.required
    ]],
    foodCustomization: ['', [
      Validators.required
    ]],
    deliveryAddress: ['', [
      Validators.required,
      Validators.minLength(6)
    ]],
    quantity: ['', [
      Validators.required,
      Validators.minLength(1),
    ]],
  })

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
    console.log(this.orderDetails);
    this.url = this.router.url;
    this.DataService.updatePage(this.url);
  }

  async subscribeData() {
    this.publicAuth = this.DataService.publicAuth;
    if (this.publicAuth == undefined || this.publicAuth == 'guest') {
      this.router.navigate(['/login']);
    } else {
      this.publicAuth = this.DataService.publicAuth;
      this.DataService.currentOrders.subscribe(
        async data => {
          this.orderDetails = data;
        });
      //this.orderDetails = this.API.getOrders(this.publicAuth);
    }
  }

  submit() {
    var order = {
      foodTitle: this.form.value.foodTitle,
      foodCustomization: this.form.value.foodCustomization,
      deliveryAddress: this.form.value.deliveryAddress,
      quantity: this.form.value.quantity,
      clientID: this.publicAuth.clientID
    }
    if (this.form.status === 'VALID') {
      return new Promise(async (resolve, reject) => {
        try {
          var data = await this.API.addOrder(order);
          this.DataService.syncData('info');
          $('#modalAddOrder').modal('hide');
          this.form.reset();
        }
        catch (err) {
          console.error(data, err);
          reject(err);
        }
      });
    }
  }

  updateOrder(type) {
    return new Promise(async (resolve, reject) => {
      try {
        var upload = {
          type: type,
          orderID: this.modalData.orderID
        }
        var data = await this.API.updateOrder(upload);
        this.DataService.syncData('info');
        $('#modalCancellation').modal('hide');
        $('#modalRespond').modal('hide');
      }
      catch (err) {
        console.error(data, err);
        reject(err);
      }
    });
  }

  rate(rating) {
    return new Promise(async (resolve, reject) => {
      try {
        var upload = {
          type: "rate",
          rating: rating,
          orderID: this.modalData.orderID
        }
        var data = await this.API.updateOrder(upload);
        this.DataService.syncData('info');
        $('#modalRate').modal('hide');
      }
      catch (err) {
        console.error(data, err);
        reject(err);
      }
    });
  }

  choosePaymentMethod(type) {
    this.paymentType = type;
    this.choosedPayment = true;
  }

  pay() {
    return new Promise(async (resolve, reject) => {
      try {
        var paymentData = {
          orderID: this.modalData.orderID,
          totalAmount: this.modalData.foodPrice,
          paidAmount: this.modalData.foodPrice,
          paymentMethod: this.paymentType
        }
        var type = {
          type: "payment",
          orderID: this.modalData.orderID
        }
        var data = await this.API.updateOrder(type);
        var data = await this.API.createPayment(paymentData);
        this.DataService.syncData('info');
        $('#modalPayment').modal('hide');
      }
      catch (err) {
        console.error(data, err);
        reject(err);
      }
    });
  }

  async modalEvent(type, data) {
    if (type == 'modalAddOrder') {
      $('#modalAddOrder').modal('show');
    } else {
      this.modalData = data;
      //console.log(this.modalData);
      if (type == 'modalRespond') {
        $('#modalRespond').modal('show');
      } else if (type == 'modalCancellation') {
        $('#modalCancellation').modal('show');
      } else if (type == 'modalRate') {
        $('#modalRate').modal('show');
      } else if (type == 'modalPayment') {
        $('#modalRespond').modal('hide');
        $('#modalPayment').modal('show');
      }
    }
  }
}
