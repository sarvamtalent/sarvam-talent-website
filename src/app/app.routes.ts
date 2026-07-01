import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AdminLoginComponent } from './admin-login.component';
import { AdminEnquiriesComponent } from './admin-enquiries.component';
import { adminAuthGuard } from './admin-auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/enquiries', component: AdminEnquiriesComponent, canActivate: [adminAuthGuard] },
  { path: '**', redirectTo: '' }
];
