import { Component, OnInit } from '@angular/core';

declare var $: any;

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  errorDetails = {
    title: '',
    msg1: '',
    msg2: '',
    msg3: '',
    trigger: false
  }

  constructor(
    private DataService: DataService
  ) { }

  ngOnInit() {
    this.DataService.current_errorDetails.subscribe(
      errorDetails => {
        this.errorDetails = errorDetails;
        // console.log(this.errorDetails)
        if ( this.errorDetails.trigger == true ) $("#modal").modal();
        else if ( this.errorDetails.trigger == false ) $("#modal").modal('hide');
      }
    )
  }

  click() {
    $("#modal").modal();
  }

  dismissErrorModal() {
    this.DataService.updateErrorDetails({
      title: '',
      msg1: '',
      msg2: '',
      msg3: '',
      trigger: false
    })
  }

}
