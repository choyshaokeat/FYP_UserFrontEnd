import { Injectable } from '@angular/core';

import { ApiBackEndService } from '../services/api-back-end.service';
import { EncrDecrService } from '../services/encdec.service';

@Injectable({
  providedIn: 'root'
})
export class ApiFrontEndService {

  constructor(
    private ApiBackEndService: ApiBackEndService,
    private EncrDecrService: EncrDecrService
  ) { }

  // Client Info
  public registerClient(user) {
    return new Promise((resolve, reject) => {
      user = this.EncrDecrService.encryptObject('client', user);
      this.ApiBackEndService.registerClient(user).subscribe(
        (res: { status, data }) => {
          res = this.EncrDecrService.decryptObject('client', res);
          if (res.status == 200) {
            if (res.data.length != 0) resolve(res.data)
            else if (res.data.length == 0) reject('Empty data');
          }
          else reject(res.status);
        },
        (err) => {
          reject(err)
        }
      );
    });
  }

  public registerCheck(data) {
    return new Promise((resolve, reject) => {
      data = this.EncrDecrService.encryptObject('client', data);
      this.ApiBackEndService.registerCheck(data).subscribe(
        (res: { status, data }) => {
          res = this.EncrDecrService.decryptObject('client', res);
          if (res.status == 200) {
            if (res.data.length != 0) resolve(res.data)
            else if (res.data.length == 0) reject('Empty data');
          }
          else reject(res.status);
        },
        (err) => {
          reject(err)
        }
      );
    });
  }

  public login(user) {
    return new Promise((resolve, reject) => {
      user = this.EncrDecrService.encryptObject('login', user);
      this.ApiBackEndService.login(user).subscribe(
        (res: { status, data }) => {
          res = this.EncrDecrService.decryptObject('login', res);
          if (res.status == 200) {
            if (res.data.length != 0) resolve(res.data)
            else if (res.data.length == 0) reject('Empty data');
          }
          else reject(res.status);
        },
        (err) => {
          reject(err)
        }
      );
    });
  }

  public resetPW(data) {
    return new Promise((resolve, reject) => {
      data = this.EncrDecrService.encryptObject('login', data);
      this.ApiBackEndService.resetPW(data).subscribe(
        (res: { status, data }) => {
          res = this.EncrDecrService.decryptObject('login', res);
          if (res.status == 200) {
            if (res.data.length != 0) resolve(res.data)
          }
          else reject(res.status);
        },
        (err) => {
          reject(err)
        }
      );
    });
  }

  public getClientInfo(user) {
    return new Promise((resolve, reject) => {
      user = this.EncrDecrService.encryptObject('client', user);
      this.ApiBackEndService.getClientInfo(user).subscribe(
        (res: { status, data }) => {
          res = this.EncrDecrService.decryptObject('client', res);
          if (res.status == 200) {
            resolve(res.data);
          }
          else reject(res.status);
        },
        (err) => {
          reject(err)
        }
      );
    });
  }

  public updateClientInfo(user) {
    return new Promise((resolve, reject) => {
      user = this.EncrDecrService.encryptObject('client', user);
      this.ApiBackEndService.updateClientInfo(user).subscribe(
        (res: { status, data }) => {
          res = this.EncrDecrService.decryptObject('client', res);
          if (res.status == 200) {
            if (res.data.length != 0) resolve(res.data)
            else if (res.data.length == 0) reject('Empty data');
          }
          else reject(res.status);
        },
        (err) => {
          reject(err)
        }
      );
    });
  }

  public getOrders(data) {
    return new Promise<any>((resolve, reject) => {
      data = this.EncrDecrService.encryptObject('client', data);
      this.ApiBackEndService.getOrders(data).subscribe(
        (res: { status, data }) => {
          res = this.EncrDecrService.decryptObject('client', res);
          if (res.status == 200) resolve(res.data);
          else reject(res);
        },
        (err) => {
          console.error(err);
          reject(err);
        }
      );
    });
  }

  public updateOrder(data) {
    return new Promise<any>((resolve, reject) => {
      data = this.EncrDecrService.encryptObject('client', data);
      this.ApiBackEndService.updateOrder(data).subscribe(
        (res: { status, data }) => {
          res = this.EncrDecrService.decryptObject('client', res);
          if (res.status == 200) resolve(res.data);
          else reject(res);
        },
        (err) => {
          console.error(err);
          reject(err);
        }
      );
    });
  }

  public getOrdersDetails(data) {
    return new Promise<any>((resolve, reject) => {
      data = this.EncrDecrService.encryptObject('client', data);
      this.ApiBackEndService.getOrdersDetails(data).subscribe(
        (res: { status, data }) => {
          res = this.EncrDecrService.decryptObject('client', res);
          if (res.status == 200) resolve(res.data);
          else reject(res);
        },
        (err) => {
          console.error(err);
          reject(err);
        }
      );
    });
  }

  public createOrder(data) {
    data = this.EncrDecrService.encryptObject('client', data);
    return new Promise<any>((resolve, reject) => {
      this.ApiBackEndService.createOrder(data).subscribe(
        (res: { status, data }) => {
          res = this.EncrDecrService.decryptObject('client', res);
          if (res.status == 200) {
            resolve(res.data)
          }
          else {
            reject('failed');
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  public createPayment(data) {
    data = this.EncrDecrService.encryptObject('client', data);
    // console.log(data)
    return new Promise<any>((resolve, reject) => {
      this.ApiBackEndService.createPayment(data).subscribe(
        (res: { status, data }) => {
          // console.log(res);
          res = this.EncrDecrService.decryptObject('client', res);
          // console.log(res)
          if (res.status == 200) {
            resolve(res)
          } else {
            reject('failed');
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  //eat
  public addOrder(data) {
    return new Promise<any>((resolve, reject) => {
      data = this.EncrDecrService.encryptObject('client', data);
      this.ApiBackEndService.addOrder(data).subscribe(
        (res: { status, data }) => {
          res = this.EncrDecrService.decryptObject('client', res);
          if (res.status == 200) resolve(res.data);
          else reject(res);
        },
        (err) => {
          console.error(err);
          reject(err);
        }
      );
    });
  }

  public getAccount(data) {
    return new Promise<any>((resolve, reject) => {
      data = this.EncrDecrService.encryptObject('client', data);
      this.ApiBackEndService.getAccount(data).subscribe(
        (res: { status, data }) => {
          res = this.EncrDecrService.decryptObject('client', res);
          if (res.status == 200) resolve(res.data);
          else reject(res);
        },
        (err) => {
          console.error(err);
          reject(err);
        }
      );
    });
  }


}
