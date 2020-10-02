import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LoginLayoutComponent } from './login/loginLayout/loginLayout.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './wrapper/header/header.component';
import { ErrorComponent } from './wrapper/error/error.component';
import { HomeComponent } from './home/home.component';
import { CurrentInfoComponent } from './currentInfo/currentInfo.component';
import { HistoryComponent } from './history/history.component';
import { PaymentComponent } from './modulePayment/payment.component';
import { AccountSettingsComponent } from './moduleSettings/accountSettings.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'info', component: CurrentInfoComponent },
  { path: 'history', component: HistoryComponent },
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
  CurrentInfoComponent,
  HistoryComponent,
  PaymentComponent,
  AccountSettingsComponent,
]
