import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'profile',
    loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('../orders/orders.module').then(m => m.OrdersPageModule)
  },
  {
    path: 'tables',
    loadChildren: () => import('../tables/tables.module').then(m => m.TablesPageModule)
  },
  {
    path: 'kitchen',
    loadChildren: () => import('../kitchen/kitchen.module').then(m => m.KitchenPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
