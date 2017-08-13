import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import { SpFirebaseDatabaseService } from './sp-firebase-database.service';

@Injectable()
export class SpLoginServiceService {

  spuser: Observable<firebase.User>;
  spData: FirebaseListObservable<any[]>;
  searchSubject: Subject<any>;

  constructor(public afAuth: AngularFireAuth, public route: Router, public db: AngularFireDatabase, public spFirebase: SpFirebaseDatabaseService,public router:Router) {
    this.spuser = afAuth.authState;
    console.log("ID TOken",this.afAuth.idToken);
  }

  spLogin(email, password) {

    this.afAuth.auth.signInWithEmailAndPassword(email, password).
    then(result => {
      if(result){
        this.router.navigate(['Sp_Homepage']);
      }
    })
    .catch(function(error) {
  // Handle Errors here.
      var errorCode = error.name;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
  }

  currentSp(): boolean {
    var sp = this.afAuth.auth.currentUser;
    if (sp) {
      return true;
    }
    else {
      return false;
    }
  }

  isSpAuthenticated(): Observable<any> {
    return this.spuser;
  }

  returnSP(): any {
    return this.afAuth.auth;
  }

  spLogOut() {

    this.afAuth.auth.signOut().then(function(x){
      if(x){
        console.log("Sign out status",x);
      }
    });
    this.route.navigate(['Home']);
  }


}
