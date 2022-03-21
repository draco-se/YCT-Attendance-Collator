import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceRecordsComponent } from './attendance/attendance-records/attendance-records.component';
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
    canActivate: [AuthGuard],
  },
  {
    path: 'attendance/:year',
    component: AttendanceRecordsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
