import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import { CompanyComponent } from './company/company.component';
import { SomosUserComponent } from './somos-user/somos-user.component';
import {LayoutComponent} from "./layout/layout.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    data: { title: '' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {title: 'Dashboard', guiSection: 'Dashboard'},
      },
      {
        path: 'company',
        component: CompanyComponent,
        data: {title: 'Company', guiSection: 'Company'},
      },
      {
        path: 'somos_users',
        component: SomosUserComponent,
        data: {title: 'SomosUser', guiSection: 'SomosUser'},
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {
  static components = [
  ];
}
