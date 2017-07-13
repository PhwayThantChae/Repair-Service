import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Injectable()
export class LoginService {

  user: Observable<firebase.User>;
  userUid:string;
  current:any;
  ph:string;
  
  constructor(public afAuth: AngularFireAuth,public route:Router) { 
    this.user = afAuth.authState;
  }

  //firebase.auth().onAuthStateChanged(firebaseUser => {});
  login()
  {
    
     this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(function(result){
      if(result)
      {
        
      }
     });

  
}

  isAuthenticated(): Observable<any>{
      return this.user;
  }


  currentUser():boolean{
    var user = this.afAuth.auth.currentUser;
    
    if(user)
    {
      return true;
    }
    else{
      return false;
    }
  }

  returnUser():any{
    //return firebase.auth().currentUser;
    return this.afAuth.auth.currentUser;
  }

  
  logout()
    {
      if(this.afAuth.auth.signOut()){
        console.log("Log Out successful");
    }
      this.route.navigate(['Home']);
    }


}
