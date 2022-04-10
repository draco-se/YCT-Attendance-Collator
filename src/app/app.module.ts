import { AuthInterceptor } from './auth/auth.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from 'angularx-social-login';
import { ValidateEqualModule } from 'ng-validate-equal';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AggregateComponent } from './attendance/aggregate/aggregate.component';
import { AttendanceRecordsComponent } from './attendance/attendance-records/attendance-records.component';
import { ProgrammesComponent } from './attendance/programmes/programmes.component';
import { RecordAttendanceComponent } from './attendance/record-attendance/record-attendance.component';
import { RecordComponent } from './attendance/record/record.component';
import { SessionComponent } from './attendance/session/session.component';
import { AuthComponent } from './auth/auth.component';
import { CredComponent } from './auth/cred/cred.component';
import { CreateRecordComponent } from './attendance/create-record/create-record.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AuthComponent,
    CredComponent,
    ProfileComponent,
    RecordAttendanceComponent,
    AttendanceRecordsComponent,
    SessionComponent,
    ProgrammesComponent,
    RecordComponent,
    AggregateComponent,
    CreateRecordComponent,
  ],

  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ValidateEqualModule,
    SocialLoginModule,
    HttpClientModule,
    AppRoutingModule,
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.clientId),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
