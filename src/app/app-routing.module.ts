import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LoginLayoutComponent } from './login/loginLayout/loginLayout.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './wrapper/header/header.component';
import { FooterComponent } from './wrapper/footer/footer.component';
import { ErrorComponent } from './wrapper/error/error.component';

import { EatComponent } from './eat/eat.component';
import { CookComponent } from './cook/cook.component';

import { PaymentComponent } from './modulePayment/payment.component';

import { AccountComponent } from './moduleAccount/account.component';
import { AccountSettingsComponent } from './moduleAccount/accountSettings/accountSettings.component';

import { SupportComponent } from './support/support.component';
import { SupportFAQComponent } from './support/supportFAQ/supportFAQ.component';
import { SupportHeaderComponent } from './support/supportHeader/supportHeader.component';

const routes: Routes = [
  { path: '', redirectTo: '/eat', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'eat', component: EatComponent },
  { path: 'cook', component: CookComponent },

  { path: 'payment', component: PaymentComponent },
  { path: 'payment/:exchange', component: PaymentComponent },

  { path: 'account', component: AccountComponent },
  { path: 'settings', component: AccountSettingsComponent },
  {
    path: 'support', component: SupportComponent,
    children: [
      { path: 'faq', component: SupportFAQComponent },
      { path: 'header', component: SupportHeaderComponent },
    ]
  },
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
  FooterComponent,
  ErrorComponent,

  EatComponent,
  CookComponent,

  PaymentComponent,

  AccountComponent,
  AccountSettingsComponent,

  SupportComponent,
  SupportFAQComponent,
  SupportHeaderComponent,
]
