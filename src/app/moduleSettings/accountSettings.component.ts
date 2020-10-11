import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';

import { ApiFrontEndService } from '../services/api-front-end.service';
import { ApiBackEndService } from '../services/api-back-end.service';
import { DataService } from '../services/data.service';
import { EncrDecrService } from '../services/encdec.service';

declare var $: any;

@Component({
  selector: 'app-accountSettings',
  templateUrl: './accountSettings.component.html'
})
export class AccountSettingsComponent implements OnInit {

  merchant_profile: any;
  cities: any;
  gender = ['Male', 'Female'];
  loginData: any;

  uploader: FileUploader = new FileUploader({});
  selectedfileName: string = '';

  currentMerchantInfo: any;
  country: any;
  modal_data: any;
  studentName: any;
  studentEmail: any;
  studentContact: any;
  studentPW: any;
  studentAddress: any;
  message: any;
  form = this.fb.group({
    studentPW_1: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      Validators.minLength(8),
    ]],
    studentPW_2: ['', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      Validators.minLength(8),
    ]]
  })


  constructor(
    private API: ApiFrontEndService,
    private ApiBackEndService: ApiBackEndService,
    private DataService: DataService,
    private router: Router,
    private EncrDecrService: EncrDecrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) { }

  async ngOnInit() {
    try {
      await this.subscribeData();
    }
    catch (err) {
      console.error(err);
    };
  }

  get f() {
    return this.form.controls;
  }


  subscribeData() {
    this.DataService.currentStudentInfo.subscribe(
      data => {
        var studentInfo = this.EncrDecrService.decryptObject('client', data);
        this.studentName = studentInfo.studentName;
        this.studentEmail = studentInfo.studentEmail;
        this.studentContact = studentInfo.studentContact;
        this.studentPW = studentInfo.studentPW;
        this.studentAddress = studentInfo.studentAddress;
      }
    );
    console.log(this.studentName);
  }


  updateStudentInfo() {
    let data = {
      type: 'info',
      studentID: this.DataService.publicAuth.studentID,
      studentName: this.studentName,
      studentEmail: this.studentEmail,
      studentContact: this.studentContact,
      studentAddress: this.studentAddress,
    }
    return new Promise(async (resolve, reject) => {
      try {
        this.spinner.show();
        var studentData = await this.API.updateStudentInfo(data);
        await this.DataService.syncData('info');
        await this.subscribeData();
        var res = { studentData };
        setTimeout(() => {this.spinner.hide();},500);
        resolve(res);
      }
      catch (err) {
        console.error(data, err);
        reject(err);
      }
    });
  }


  updatePW(value) {
    let data = {
      type: 'password',
      studentID: this.DataService.publicAuth.studentID,
      studentEmail: this.studentEmail,
      studentPW: value.studentPW_2,
    }
    return new Promise(async (resolve, reject) => {
      try {
        this.spinner.show();
        var studentData = await this.API.updateStudentInfo(data);
        var res = { studentData };
        setTimeout(() => {this.spinner.hide();},500);
        resolve(res);
      }
      catch (err) {
        console.error(data, err);
        reject(err);
      }
    });
  }

  submit() {
    if (this.form.status === 'VALID') {
      return new Promise(async (resolve, reject) => {
        try {
            var merchant_data = await this.updatePW(this.form.value);
            $('#modal_change_pw').modal('hide');
            var res = merchant_data;
            resolve(res);
        }
        catch (err) {
          console.error(merchant_data, err);
          reject(err);
        }
      });
    }
  }

  async modalEvent(data, type) {
    this.modal_data = data;
    if (type == 'change_pw') {
      $('#modal_change_pw').modal('show');
    }
  }

}
