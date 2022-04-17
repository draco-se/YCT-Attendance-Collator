import { MarkAttendanceComponent } from './attendance/mark-attendance/mark-attendance.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AttendanceRecordsComponent } from './attendance/attendance-records/attendance-records.component';
import { AttendanceResolver } from './attendance/attendance.resolver';
import { CreateRecordComponent } from './attendance/create-record/create-record.component';
import { ProgrammesComponent } from './attendance/programmes/programmes.component';
import { RecordComponent } from './attendance/record/record.component';
import { SessionComponent } from './attendance/session/session.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: AuthComponent,
  },
  {
    path: 'signup',
    component: AuthComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sessions',
    component: SessionComponent,
    resolve: [AttendanceResolver],
    canActivate: [AuthGuard],
  },
  {
    path: 'mark-attendance',
    component: MarkAttendanceComponent,
    resolve: [AttendanceResolver],
    canActivate: [AuthGuard],
  },
  {
    path: 'programmes/:year',
    component: ProgrammesComponent,
    resolve: [AttendanceResolver],
    canActivate: [AuthGuard],
  },
  {
    path: 'programmes/:year/:progId/:courseId',
    component: AttendanceRecordsComponent,
    resolve: [AttendanceResolver],
    canActivate: [AuthGuard],
  },
  {
    path: 'programmes/:year/:progId/:courseId/:recordId',
    component: RecordComponent,
    resolve: [AttendanceResolver],
    canActivate: [AuthGuard],
  },
  {
    path: 'create-record',
    component: CreateRecordComponent,
    resolve: [AttendanceResolver],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
