import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes,RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';


import { AppComponent } from './app.component';
import { UserHomepageComponent } from './user/user-homepage/user-homepage.component';
import { HomeComponent } from './home/home.component';
import { UserLoginModalComponent } from './user/user-login-modal/user-login-modal.component';
import { LoginService } from './services/login.service';
import { FirebaseDatabaseService } from './services/firebase-database.service';
import { SpLoginServiceService } from './services/sp-login-service.service';
import { UserSearchNormalComponent } from './user/user-search-normal/user-search-normal.component';
import { UserSearchCardComponent } from './user/user-search-card/user-search-card.component';
import { NavBarComponent } from './user/nav-bar/nav-bar.component';
import { UserDeviceModalComponent } from './user/user-device-modal/user-device-modal.component';
import { UserGetAppointmentComponent } from './user/user-get-appointment/user-get-appointment.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserRequestedServiceComponent } from './user/user-requested-service/user-requested-service.component';
import { SpLoginComponent } from './service-provider/sp-login/sp-login.component';
import { SpHomepageComponent } from './service-provider/sp-homepage/sp-homepage.component';
import { SpFirebaseDatabaseService } from './services/sp-firebase-database.service';
import { SpQueuingRequestComponent } from './service-provider/sp-queuing-request/sp-queuing-request.component';
import { SpApprovedRequestComponent } from './service-provider/sp-approved-request/sp-approved-request.component';
import { NavbarComponent } from './navbar/navbar/navbar.component';
import { SpNavbarComponent } from './navbar/sp-navbar/sp-navbar.component';
import { UserNavbarComponent } from './navbar/user-navbar/user-navbar.component';
import { UserNotiComponent } from './noti/user-noti/user-noti.component';
import { UserLoginNavbarComponent } from './navbar/user-login-navbar/user-login-navbar.component';
import { SpNotiComponent } from './noti/sp-noti/sp-noti.component';
import { SpProfileComponent } from './service-provider/sp-profile/sp-profile.component';
import { NotificationsComponent } from './noti/notifications/notifications.component';
import { FooterComponent } from './footer/footer.component';
import { SpNotificationsComponent } from './noti/sp-notifications/sp-notifications.component';
import { UserNewComponent } from './user/user-new/user-new.component';

import {Knayi} from 'knayi-myscript';
import { SpNotiAppointmentDetailComponent } from './service-provider/sp-noti-appointment-detail/sp-noti-appointment-detail.component';
import { UserAppointmentDetailComponent } from './user/user-appointment-detail/user-appointment-detail.component';
import { UserSpProfileComponent } from './user/user-sp-profile/user-sp-profile.component';
import { UserRequestedAppointmentDetailsComponent } from './user/user-requested-appointment-details/user-requested-appointment-details.component';
import { SpCustomerSupportComponent } from './service-provider/sp-customer-support/sp-customer-support.component';
import { UserCustomerSupportComponent } from './user/user-customer-support/user-customer-support.component';
import { SpWeekAppointmentsComponent } from './service-provider/sp-week-appointments/sp-week-appointments.component';
import { SpAppointmentDetailComponent } from './service-provider/sp-appointment-detail/sp-appointment-detail.component';




export const routes:Routes = [
  {path : "", redirectTo:"Home", pathMatch:"full"},
  {path : "Home", component:HomeComponent},
  {path : "Sp_Homepage", component: SpHomepageComponent},
  {path : "User_Homepage", component:UserHomepageComponent},
  {path : "User_Search_Normal",component:UserSearchNormalComponent},
  {path : "Profile",component : UserProfileComponent},
  {path : "Requested_Service",component: UserRequestedServiceComponent},
  {path : "Sp_LogIn", component: SpLoginComponent},
  {path : "QueuingRequest", component:SpQueuingRequestComponent},
  {path : "ApprovedRequest", component:SpApprovedRequestComponent},
  {path : "Sp_Profile", component:SpProfileComponent},
  {path : "Notifications", component:NotificationsComponent},
  {path : "SpNotifications", component:SpNotificationsComponent},
  {path : "NewUser", component:UserNewComponent},
  {path : "Sp_Noti_Appointment_Detail/:id",component:SpNotiAppointmentDetailComponent},
  {path : "User_Appointment_Detail/:id",component:UserAppointmentDetailComponent},
  {path : "User_Requested_Appointment_Detail/:id",component:UserRequestedAppointmentDetailsComponent},
  {path : "ServiceProvider_Profile/:id",component:UserSpProfileComponent},
  {path : "Sp_Support",component:SpCustomerSupportComponent},
  {path : "User_Support",component:UserCustomerSupportComponent},
  {path : "Sp_Appointment_Detail/:id",component:SpAppointmentDetailComponent},
  {path : "**", component:HomeComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    UserHomepageComponent,
    HomeComponent,
    UserLoginModalComponent,
    UserSearchNormalComponent,
    UserSearchCardComponent,
    NavBarComponent,
    UserDeviceModalComponent,
    UserGetAppointmentComponent,
    UserProfileComponent,
    UserRequestedServiceComponent,
    SpLoginComponent,
    SpHomepageComponent,
    SpQueuingRequestComponent,
    SpApprovedRequestComponent,
    NavbarComponent,
    SpNavbarComponent,
    UserNavbarComponent,
    UserNotiComponent,
    UserLoginNavbarComponent,
    SpNotiComponent,
    SpProfileComponent,
    NotificationsComponent,
    FooterComponent,
    SpNotificationsComponent,
    UserNewComponent,
    SpNotiAppointmentDetailComponent,
    UserAppointmentDetailComponent,
    UserSpProfileComponent,
    UserRequestedAppointmentDetailsComponent,
    SpCustomerSupportComponent,
    UserCustomerSupportComponent,
    SpWeekAppointmentsComponent,
    SpAppointmentDetailComponent,
    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    AngularFireDatabaseModule,  // imports firebase/database, only needed for database features
    AngularFireModule.initializeApp(environment.firebase), //imports firebase/app needed for everything
    AngularFireAuthModule, //imports firebase/auth, only needed for auth features
    RouterModule.forRoot(routes)
  ],
  providers: [LoginService,FirebaseDatabaseService,SpLoginServiceService,SpFirebaseDatabaseService,UserGetAppointmentComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
