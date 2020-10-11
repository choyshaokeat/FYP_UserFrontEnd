import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ApiFrontEndService } from '../services/api-front-end.service';
import { DataService } from '../services/data.service';
import { EncrDecrService } from '../services/encdec.service';
import * as moment from 'moment'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  @Output() closeModal: EventEmitter<any> = new EventEmitter();

  form = this.fb.group({
    studentEmail: ['', [
      Validators.required,
      //Validators.email,
    ]],
    studentPW: ['', [
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
  }

  get f() {
    return this.form.controls;
  }

  async login() {
    this.spinner.show();
    this.login_error = false;

    try {
      var res = await this.API.login(this.form.value);
      console.log(res)
      var data = {
        studentID: res[0].studentID,
        studentPW: res[0].studentPW,
        studentName: res[0].studentName,
        studentEmail: res[0].studentEmail,
        studentContact: res[0].studentContact,
        studentAddress: res[0].studentAddress,
      };
      var auth = this.EncrDecrService.encryptObject('client', data);
      localStorage.setItem('auth', auth);
      this.DataService.updateStudentInfo(auth);
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