import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DistributorOrdersPage } from './distributor-orders';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DistributorOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(DistributorOrdersPage),
    ComponentsModule,
  ],
})
export class DistributorOrdersPageModule {}
