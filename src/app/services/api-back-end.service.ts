import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiBackEndService {
  socketPoint: any;
  socketEndPoint: any;
  constructor(private http: HttpClient) {
    this.socketPoint = environment.SOCKET_POINT;
    this.socketEndPoint = environment.SOCKET_ENDPOINT;
  }

  getFrontEndURL() {
    return this.socketPoint;
  }

  getBackEndURL() {
    return this.socketEndPoint;
  }

  // Client Info
  registerClient(data) {
    return this.http.post(`${this.getBackEndURL()}/client/registerClient`, { data }, httpOptions);
  }

  registerCheck(data) {
    return this.http.post(`${this.getBackEndURL()}/client/registerCheck`, { data }, httpOptions);
  }

  login(data) {
    return this.http.post(`${this.getBackEndURL()}/client/login`, { data }, httpOptions);
  }

  getStudentInfo(data) {
    return this.http.post(`${this.getBackEndURL()}/client/getStudentInfo`, { data }, httpOptions);
  }

  updateStudentInfo(data) {
    return this.http.post(`${this.getBackEndURL()}/client/updateStudentInfo`, { data }, httpOptions);
  }

  getBookingInfo(data) {
    return this.http.post(`${this.getBackEndURL()}/client/getBookingInfo`, { data }, httpOptions);
  }
}
