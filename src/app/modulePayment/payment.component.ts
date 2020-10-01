import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ApiFrontEndService } from '../services/api-front-end.service';
import { ApiBackEndService } from '../services/api-back-end.service';
import { DataService } from '../services/data.service';
import { EncrDecrService } from '../services/encdec.service';
import { environment } from '../../environments/environment';

declare var $: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  data: any;
  merchantInfo: any = '';
  orderInfo: any = '';
  paymentInfo: any = '';
  currency: string = 'MYR';
  total: number = 0;
  publicAuth: any;
  routerNavigateData: any;

  constructor(
    private API: ApiFrontEndService,
    private ApiBackEndService: ApiBackEndService,
    private DataService: DataService,
    private router: Router,
    private EncrDecrService: EncrDecrService,
    private spinner: NgxSpinnerService,
    private ActivatedRoute: ActivatedRoute,
  ) { }

  async ngOnInit() {
    window.scroll(0, 0);
    await this.subscribeData();
    this.DataService.syncData('info');
    this.spinner.hide();
  }

  async subscribeData() {
    /* this.publicAuth = this.DataService.publicAuth;
    this.DataService.currentMerchantInfo.subscribe(
      async data => {
        if (data != '' && data != ' ' && data != undefined) {
          data = this.EncrDecrService.decryptObject('client', data);
          this.merchantInfo = data;
        }
      }
    ); */
    this.DataService.currentOrderInfo.subscribe(
      async data => {
        this.orderInfo = data;
        this.orderInfo.totalAmount = parseFloat(this.orderInfo.totalAmount).toFixed(2);
      }
    );
  }

  async routerNavigate() {
    if (this.routerNavigateData.orderType == 1 || this.routerNavigateData.orderType == 4) {
      this.router.navigate(['/history/orders']);
    } else if (this.routerNavigateData.orderType == 2 || this.routerNavigateData.orderType == 3) {
      this.router.navigate(['/history/reservation']);
    }
  }
  
  async choosePaymentMethod(method) {
  }
}
