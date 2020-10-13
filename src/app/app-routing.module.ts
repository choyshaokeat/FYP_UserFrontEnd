import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './wrapper/header/header.component';
import { HomeComponent } from './home/home.component';
import { VirtualRoomComponent } from './virtualRoom/virtualRoom.component';
import { HistoryComponent } from './history/history.component';
import { SingleBookingComponent } from './moduleBooking/singleBooking/singleBooking.component';
import { BulkBookingComponent } from './moduleBooking/bulkBooking/bulkBooking.component';
import { AccountSettingsComponent } from './moduleSettings/accountSettings.component';
import { FloorPlanComponent } from './floorPlan/floorPlan.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'virtualRoom', component: VirtualRoomComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'singleBooking', component: SingleBookingComponent },
  { path: 'bulkBooking', component: BulkBookingComponent },
  { path: 'settings', component: AccountSettingsComponent },
  { path: 'floorPlan', component: FloorPlanComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
export const RoutingComponents = [
  LoginComponent,
  RegisterComponent,
  HeaderComponent,
  HomeComponent,
  VirtualRoomComponent,
  HistoryComponent,
  SingleBookingComponent,
  BulkBookingComponent,
  AccountSettingsComponent,
  FloorPlanComponent,
]
