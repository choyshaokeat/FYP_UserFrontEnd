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

  resetPW(data) {
    return this.http.post(`${this.getBackEndURL()}/client/resetPW`, { data }, httpOptions);
  }

  getClientInfo(data) {
    return this.http.post(`${this.getBackEndURL()}/client/getClientInfo`, { data }, httpOptions);
  }

  updateClientInfo(data) {
    return this.http.post(`${this.getBackEndURL()}/client/updateClientInfo`, { data }, httpOptions);
  }

  createOrder(data) {
    return this.http.post(`${this.getBackEndURL()}/client/createOrder`, { data }, httpOptions);
  }

  // Account
  getOrders(data) {
    return this.http.post(`${this.getBackEndURL()}/client/getOrders`, { data }, httpOptions);
  }

  updateOrder(data) {
    return this.http.post(`${this.getBackEndURL()}/client/updateOrder`, { data }, httpOptions);
  }

  getOrdersDetails(data) {
    return this.http.post(`${this.getBackEndURL()}/client/getOrdersDetails`, { data }, httpOptions);
  }

  createPayment(data) {
    return this.http.post(`${this.getBackEndURL()}/client/createPayment`, { data }, httpOptions);
  }

  //eat
  addOrder(data) {
    return this.http.post(`${this.getBackEndURL()}/client/addOrder`, { data }, httpOptions);
  }

  getAccount(data) {
    return this.http.post(`${this.getBackEndURL()}/client/getAccount`, { data }, httpOptions);
  }

}
