import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DistributorInventoryPage } from './distributor-inventory';

@NgModule({
  declarations: [
    DistributorInventoryPage,
  ],
  imports: [
    IonicPageModule.forChild(DistributorInventoryPage),
  ],
})
export class DistributorInventoryPageModule {}
