import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule
} from 'angularx-social-login';
import { ValidateEqualModule } from 'ng-validate-equal';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AggregateComponent } from './attendance/aggregate/aggregate.component';
import { AttendanceRecordsComponent } from './attendance/attendance-records/attendance-records.component';
import { CreateRecordComponent } from './attendance/create-record/create-record.component';
import { MarkAttendanceComponent } from './attendance/mark-attendance/mark-attendance.component';
import { ProgrammesComponent } from './attendance/programmes/programmes.component';
import { RecordComponent } from './attendance/record/record.component';
import { StudentAttendanceComponent } from './attendance/student-attendance/student-attendance.component';
import { SessionComponent } from './attendance/session/session.component';
import { StudentComponent } from './attendance/student/student.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { CredComponent } from './auth/cred/cred.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AggregateRecordsComponent } from './profile/aggregate-records/aggregate-records.component';
import { DetailsComponent } from './profile/details/details.component';
import { ProfileComponent } from './profile/profile.component';
import { AlertComponent } from './shared/alert/alert.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { ModalComponent } from './shared/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AuthComponent,
    CredComponent,
    ProfileComponent,
    AttendanceRecordsComponent,
    SessionComponent,
    ProgrammesComponent,
    RecordComponent,
    AggregateComponent,
    CreateRecordComponent,
    MarkAttendanceComponent,
    MapComponent,
    StudentAttendanceComponent,
    StudentComponent,
    PageNotFoundComponent,
    DetailsComponent,
    AggregateRecordsComponent,
    ModalComponent,
    AlertComponent,
    LoaderComponent,
  ],

  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ValidateEqualModule,
    SocialLoginModule,
    HttpClientModule,
    MatFormFieldModule,
    MatAutocompleteModule,
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