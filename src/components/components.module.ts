import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SeperatorComponent } from './seperator/seperator';
import { CounterComponent } from './counter/counter';
import { RatingComponent } from './rating/rating';


@NgModule({
	declarations: [SeperatorComponent,
    CounterComponent,
    RatingComponent,
    RatingComponent,
	],
	imports: [IonicModule],
	exports: [SeperatorComponent,
    CounterComponent,
    RatingComponent,
    RatingComponent,
	]
})
export class ComponentsModule {}
