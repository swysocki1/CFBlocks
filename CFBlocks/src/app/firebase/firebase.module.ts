/**
 * Created by swysoc1 on 9/19/2018
 */

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
  declarations: [],
  providers: []
})
export class FirebaseModule {}
