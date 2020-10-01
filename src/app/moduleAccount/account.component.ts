import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';

import { AuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

import { ApiFrontEndService } from '../services/api-front-end.service';
import { ApiBackEndService } from '../services/api-back-end.service';
import { DataService } from '../services/data.service';
import { EncrDecrService } from '../services/encdec.service';
import { async } from '@angular/core/testing';

declare var $: any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {

  merchant_profile: any;
  currentClientInfo: any;
  url: any;
  publicAuth: any;
  cashAmount: any;
  ePaymentAmount: any;
  cookVerified: any;

  constructor(
    private API: ApiFrontEndService,
    private ApiBackEndService: ApiBackEndService,
    private DataService: DataService,
    private router: Router,
    private EncrDecrService: EncrDecrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    await this.subscribeData();
    await this.getCookStatus();
    this.url = this.router.url;
    this.DataService.updatePage(this.url);
  }

  async subscribeData() {
    this.publicAuth = this.DataService.publicAuth;
    if (this.publicAuth == undefined || this.publicAuth == 'guest') {
      this.router.navigate(['/login']);
    } else {
      this.currentClientInfo = this.DataService.publicAuth;
      this.DataService.currentAccountAmount.subscribe(
        async data => {
          this.cashAmount = data[0].cashAccount;
          this.ePaymentAmount = data[0].ePaymentAccount;
        }
      );
    }
  }

  async getCookStatus(){
    this.cookVerified = await this.API.getClientInfo(this.currentClientInfo);
    this.cookVerified = this.cookVerified[0].cookVerified;
    console.log(this.cookVerified);
  }

  async registerCook(){
    var upload = {
      type: "registerCook",
      clientID: this.currentClientInfo.clientID
    }
    await this.API.updateClientInfo(upload);
    location.reload();
  }

  logOut() {
    this.DataService.reset();
    this.router.navigate(['/login']);
  }

  async modalEvent(type) {
    if (type == 'modalRegister') {
      $('#modalRegister').modal('show');
    }
  }
}
