import { DetailsComponent } from './profile/details/details.component';
import { AggregateComponent } from './attendance/aggregate/aggregate.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StudentAttendanceComponent } from './attendance/student-attendance/student-attendance.component';
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
    children: [
      {
        path: 'details',
        component: DetailsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'details',
    component: DetailsComponent,
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
    path: 'aggregate/:sessionId/:progId/:courseId',
    component: AggregateComponent,
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
    path: 'attendance/:userId/:year/:progId/:courseId/:recordId/:token',
    component: StudentAttendanceComponent,
  },
  {
    path: 'create-record',
    component: CreateRecordComponent,
    resolve: [AttendanceResolver],
    canActivate: [AuthGuard],
  },
  {
    path: 'not-found',
    component: PageNotFoundComponent,
  },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules,
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
      // scrollOffset: [0, 50],
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
