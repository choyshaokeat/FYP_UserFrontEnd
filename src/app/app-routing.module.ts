import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LoginLayoutComponent } from './login/loginLayout/loginLayout.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './wrapper/header/header.component';
import { ErrorComponent } from './wrapper/error/error.component';
import { HomeComponent } from './home/home.component';
import { VirtualRoomComponent } from './virtualRoom/virtualRoom.component';
import { HistoryComponent } from './history/history.component';
import { SingleBookingComponent } from './moduleBooking/singleBooking/singleBooking.component';
import { BulkBookingComponent } from './moduleBooking/bulkBooking/bulkBooking.component';
import { PaymentComponent } from './modulePayment/payment.component';
import { AccountSettingsComponent } from './moduleSettings/accountSettings.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'virtualRoom', component: VirtualRoomComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'singleBooking', component: SingleBookingComponent },
  { path: 'bulkBooking', component: BulkBookingComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'settings', component: AccountSettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
export const RoutingComponents = [
  LoginComponent,
  LoginLayoutComponent,
  RegisterComponent,
  HeaderComponent,
  ErrorComponent,
  HomeComponent,
  VirtualRoomComponent,
  HistoryComponent,
  SingleBookingComponent,
  BulkBookingComponent,
  PaymentComponent,
  AccountSettingsComponent,
]
