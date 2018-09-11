import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DistributorToolsPage } from './distributor-tools';
import { DistributorOrdersPageModule } from '../distributor-orders/distributor-orders.module';
import { DistributorInventoryPageModule } from '../distributor-inventory/distributor-inventory.module';
import { DistributorMyPageModule } from '../distributor-my/distributor-my.module';



@NgModule({
  declarations: [
    DistributorToolsPage,

  ],
  imports: [
    IonicPageModule.forChild(DistributorToolsPage),
    DistributorOrdersPageModule,
    DistributorInventoryPageModule,
    DistributorMyPageModule
  ],
})
export class DistributorToolsPageModule {}
