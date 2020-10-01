import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CdkTableModule } from '@angular/cdk/table';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxViewerModule } from 'ngx-viewer';
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorDirective } from './color.directive';
import { QRCodeModule } from 'angularx-qrcode';
import { FileUploadModule  } from 'ng2-file-upload';
import { CountdownModule } from 'ngx-countdown';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

import { ApiFrontEndService } from './services/api-front-end.service';
import { ApiBackEndService } from './services/api-back-end.service';
import { DataService } from './services/data.service';
import { EncrDecrService } from './services/encdec.service';
import { SocketioService } from './services/socketio.service';

import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


// Social Login Service API
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("935264549367-k1ip84a000q1r8qrgcpf2a310bvj63ap.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("966951023702762")
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    ColorDirective,
    RoutingComponents
  ],
  imports: [
    BrowserModule,
    CdkTableModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    QRCodeModule,
    FileUploadModule,
    CountdownModule,
    ZXingScannerModule,
    SocialLoginModule,
    NgxViewerModule,
    FlatpickrModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    ApiFrontEndService,
    ApiBackEndService,
    DataService,
    EncrDecrService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    SocketioService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
