import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DistributorStatisticsPage } from './distributor-statistics';

@NgModule({
  declarations: [
    DistributorStatisticsPage,
  ],
  imports: [
    IonicPageModule.forChild(DistributorStatisticsPage),
  ],
})
export class DistributorStatisticsPageModule {}
