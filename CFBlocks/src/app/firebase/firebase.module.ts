/**
 * Created by swysoc1 on 9/19/2018
 */

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../../environments/environment';
import {AngularFireModule} from "@angular/fire";

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase, 'CFBlocks'), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    // AngularFirestoreModule.enablePersistence()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
  declarations: [],
  providers: []
})
export class FirebaseModule {}
