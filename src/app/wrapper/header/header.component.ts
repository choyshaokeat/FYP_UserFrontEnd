import { Component, OnInit, HostListener } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ApiFrontEndService } from '../../services/api-front-end.service';
import { DataService } from '../../services/data.service';
import { EncrDecrService } from '../../services/encdec.service';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  sidebarClick: any;
  loginStatus: any;
  headerShown: any;
  public publicAuth: any;

  constructor(
    private API: ApiFrontEndService,
    private DataService: DataService,
    private router: Router,
    private EncrDecrService: EncrDecrService,
    private spinner: NgxSpinnerService
  ) { }

  async ngOnInit() {
    await this.subscribeData();
  }

  async subscribeData() {
    this.publicAuth = this.DataService.publicAuth;
    if (this.publicAuth == undefined || this.publicAuth == 'guest') {
      this.loginStatus = false;
    } else {
      this.loginStatus = true;
    }
    this.DataService.currentHeaderShown.subscribe(data => this.headerShown = data);
  }

  hideNavbar(e: any) { e.hide(); }

  sidenav_main(data) {
    this.sidebarClick = data.isTrusted;
    console.log(this.sidebarClick);
  }

  logOut() {
    this.spinner.show();
    this.DataService.reset();
    this.spinner.hide();
    this.DataService.updateHeaderShown(false);
    this.router.navigate(['/login']);
  }

  @HostListener('window:scroll', ['$event'])
  
  onWindowScroll(e) {
      let element = document.querySelector('#navbar-main');
      if (window.pageYOffset + 30 > element.clientHeight) {
        element.classList.remove('py-3');
        element.classList.add('bg-gray-300', 'py-2', 'shadow');
      } else {
        element.classList.remove('bg-gray-300', 'py-2', 'shadow');
        element.classList.add('py-3');
      }
  }

  async modalEvent(type) {
    if (type == 'modalBook') {
      $('#modalBook').modal('show');
    }
  }
  
}
