import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class EncrDecrService {

  p_key = {
    login: 'key_login.bbb',
    client: 'key_client.bbb',
    merchant: 'key_merchant.bbb',
    cart: 'key_cart.bbb',
    order: 'key_order.bbb',
    reservation: 'key_reservation.bbb',
    payment: 'key_payment.bbb',
    search: 'key_search.bbb',
    public_key : 'key_public_key.bbb',
    kitchen : 'key_kitchen.bbb',
    mail: 'key_mail.bbb'
  }

  constructor() { }

  // //The set method is use for encrypt the value.
  // encrypt_key(keys, value) {
  //   if (keys == 'id') keys = this.p_key.id;
  //   else if (keys == 'pw') keys = this.p_key.pw;

  //   var key = CryptoJS.enc.Utf8.parse(keys);
  //   var iv = CryptoJS.enc.Utf8.parse(keys);
  //   var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key, {
  //     keySize: 128 / 8,
  //     iv: iv,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.Pkcs7
  //   });

  //   return encrypted.toString();
  // }

  // //The get method is use for decrypt the value.
  // decrypt_key(keys, value) {
  //   if (keys == 'id') keys = this.p_key.id;
  //   else if (keys == 'pw') keys = this.p_key.pw;

  //   var key = CryptoJS.enc.Utf8.parse(keys);
  //   var iv = CryptoJS.enc.Utf8.parse(keys);
  //   var decrypted = CryptoJS.AES.decrypt(value, key, {
  //     keySize: 128 / 8,
  //     iv: iv,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.Pkcs7
  //   });
  //   return decrypted.toString(CryptoJS.enc.Utf8);
  // }

  encryptObject(type, value) {
    try {
      var key = '';
      if (type == 'login') key = this.p_key.login;
      else if (type == 'client') key = this.p_key.client;
      else if (type == 'merchant') key = this.p_key.merchant;
      else if (type == 'cart') key = this.p_key.cart;
      else if (type == 'order') key = this.p_key.order;
      else if (type == 'reservation') key = this.p_key.reservation;
      else if (type == 'payment') key = this.p_key.payment;
      else if (type == 'search') key = this.p_key.search;
      else if (type == 'public_key') key = this.p_key.public_key;
      else if (type == 'kitchen') key = this.p_key.kitchen;
      else if (type == 'mail') key = this.p_key.mail;

      var b64 = CryptoJS.AES.encrypt(JSON.stringify(value), key).toString();
      var e64 = CryptoJS.enc.Base64.parse(b64);
      var encrypted = e64.toString(CryptoJS.enc.Hex);
      return encrypted;
    }
    catch (err) {
      // console.error(err);
      return 'Error - encrypt';
    }
  }

  decryptObject(type, value) {
    try {
      var key = '';
      if (type == 'login') key = this.p_key.login;
      else if (type == 'client') key = this.p_key.client;
      else if (type == 'merchant') key = this.p_key.merchant;
      else if (type == 'cart') key = this.p_key.cart;
      else if (type == 'order') key = this.p_key.order;
      else if (type == 'reservation') key = this.p_key.reservation;
      else if (type == 'payment') key = this.p_key.payment;
      else if (type == 'search') key = this.p_key.search;
      else if (type == 'public_key') key = this.p_key.public_key;
      else if (type == 'kitchen') key = this.p_key.kitchen;
      else if (type == 'mail') key = this.p_key.mail;

      var reb64 = CryptoJS.enc.Hex.parse(value);
      var bytes = reb64.toString(CryptoJS.enc.Base64);
      var decrypt = CryptoJS.AES.decrypt(bytes, key);
      var decrypted = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
      return decrypted;
    }
    catch (err) {
      // console.error(err);
      return 'Error - decrypt';
    }

  }
}