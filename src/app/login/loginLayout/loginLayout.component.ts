import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ApiFrontEndService } from '../../services/api-front-end.service';
import { DataService } from '../../services/data.service';
import { EncrDecrService } from '../../services/encdec.service';
import * as moment from 'moment'

@Component({
  selector: 'app-loginLayout',
  templateUrl: './loginLayout.component.html',
  styleUrls: ['./loginLayout.component.scss']
})
export class LoginLayoutComponent implements OnInit {

  @Output() closeModal: EventEmitter<any> = new EventEmitter();

  form = this.fb.group({
    clientEmail: ['', [
      Validators.required,
      //Validators.email,
    ]],
    clientPW: ['', [
      Validators.required,
      //Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
      //Validators.minLength(8),
    ]],
  })


  login_error: boolean = false;
  showPassword_boolean: boolean = false;

  url: string = '';

  constructor(
    private API: ApiFrontEndService,
    private DataService: DataService,
    private router: Router,
    private EncrDecrService: EncrDecrService,
    private spinner: NgxSpinnerService,
    private ActivatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
  ) { }

  async ngOnInit() {
    window.scroll(0, 0);
    this.checkURL();
  }

  get f() {
    return this.form.controls;
  }

  checkURL() {
    this.router.events.subscribe((s) => {
      if (s['routerEvent'] != undefined) {
        var url = s['routerEvent'].url;
        this.url = '';
        if (url != undefined && url != '' && url != ' ') {
          if (url.includes('/cart')) this.url = 'cart';
          else if (url.includes('/home')) this.url = 'home';
        }
      }
    });
  }

  async login() {
    this.spinner.show();
    this.login_error = false;

    try {
      var res = await this.API.login(this.form.value);
      console.log(res)
      var data = {
        clientID: res[0].clientID,
        clientPW: res[0].clientPW,
        clientName: res[0].clientName,
        clientEmail: res[0].clientEmail,
        clientContact: res[0].clientContact,
        clientAddress: res[0].clientAddress,
        clientICNum: res[0].clientICNum,
        clientTimestamp: res[0].clientTimestamp,
        timestamp_db: moment().utc().format("YYYY-MM-DD hh:mm:ss"),
        status: true
      };
      var auth = this.EncrDecrService.encryptObject('client', data);
      localStorage.setItem('auth', auth);
      this.DataService.updateClientInfo(auth);
      await this.DataService.callAll();

      this.spinner.hide();
      this.router.navigate(['/home']);
    }
    catch (err) {
      console.error(err);
      this.spinner.hide();
      this.login_error = true;
    }

  }


  // Social Login
  signOut(): void {
    this.authService.signOut();
  }

  showPassword() {
    this.showPassword_boolean = !this.showPassword_boolean;
  }

  register() {
    this.router.navigate(['register'])
  }
}