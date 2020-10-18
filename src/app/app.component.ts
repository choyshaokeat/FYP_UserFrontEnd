import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiFrontEndService } from './services/api-front-end.service';
import { DataService } from './services/data.service';
import { EncrDecrService } from './services/encdec.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loginStatus: boolean = false;
  errorDetails: any;
  publicAuth: any;

  constructor(
    private API: ApiFrontEndService,
    private DataService: DataService,
    private EncrDecrService: EncrDecrService,
    private router: Router,
  ) { }

  async ngOnInit() {
    await this.serviceLogin();
    // await this.DataService.callAll();
    await this.subscribeData();
  }

  async subscribeData() {
    this.DataService.currentStudentInfo.subscribe(data =>
      this.publicAuth = this.EncrDecrService.decryptObject('client', data)
    );
    if (this.publicAuth == undefined || this.publicAuth == 'guest') {
      this.loginStatus = false;
    } else {
      this.loginStatus = true;
    }
  }

  async serviceLogin() {
    var auth = localStorage.getItem('auth');
    if (auth != undefined) {
      // let loginResponse;
      // console.log(auth);
      // console.log(this.EncrDecrService.decryptObject('client',auth));
      this.DataService.updateStudentInfo(auth);
      try {
        var res = await this.API.login(this.EncrDecrService.decryptObject('client', auth));
        this.DataService.updateStudentInfo(auth);
        //console.log(res)
      }
      catch (err) {
        console.error(err);
        this.DataService.reset();
        this.router.navigate(['/login']);
      }

    } else {
      this.DataService.updateStudentInfo(this.EncrDecrService.encryptObject('client', 'guest'));
    }
  }

  onActivate(ref) {
    if (ref.loginOptionEvent != undefined) {
      ref.loginOptionEvent.subscribe((data) => {
        if (data) this.openModal();
        else if (data == false) this.closeModal();
      });
    }
  }

  openModal() {
    $('#loginOption').modal('show');
  }

  closeModal() {
    $('#loginOption').modal('hide');
  }
}
