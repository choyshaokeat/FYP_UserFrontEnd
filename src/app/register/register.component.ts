import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiFrontEndService } from '../services/api-front-end.service';
import { DataService } from '../services/data.service';
import { EncrDecrService } from '../services/encdec.service';
import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public code: any;
  public code_button_status: any = true;
  form = this.fb.group({
    clientName: ['', [
      Validators.required,
    ]],
    clientEmail: ['', [
      Validators.required,
      Validators.email,
    ]],
    clientContact: ['', [
      Validators.required,
      Validators.minLength(6),
    ]],
    clientAddress: ['', [
      Validators.required,
      Validators.minLength(6),
    ]],
    clientPW: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      Validators.minLength(8),
    ]],
  })

  constructor(
    private API: ApiFrontEndService,
    private DataService: DataService,
    private router: Router,
    private EncrDecrService: EncrDecrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    window.scroll(0, 0);
  }

  get f() {
    return this.form.controls;
  }

  login() {
    this.router.navigate(['login']);
  }

  submit() {
    if (this.form.status === 'VALID') {
      return new Promise(async (resolve, reject) => {
        try {
          var count = await this.API.registerCheck(this.form.value);
          console.log(count);
          count = count[0].count;
          console.log(count);
          if (count < 1) {
            var client_data = await this.API.registerClient(this.form.value);
            this.modal_launch('done');
            var res = await this.API.login(this.form.value);
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
            this.DataService.updateStudentInfo(auth);
            await this.DataService.callAll();
            setTimeout(() => {
              this.router.navigate(['eat']);
              $('#modal_done').modal('hide');
            }, 5000);
          } else {
            this.modal_launch('err');
            this.form.reset();
            this.code = undefined;
          }
          console.log(this.form.value);
          var res = client_data;
          resolve(res);
        }
        catch (err) {
          console.error(client_data, err);
          reject(err);
        }
      });
    }
  }

  modal_launch(data) {
    if (data == 'err') {
      $('#modal_error').modal('show');
    } else if (data == 'done') {
      $('#modal_done').modal('show');
    }
  }
}