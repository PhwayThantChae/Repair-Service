import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Injectable()
export class LoginService {

  user: Observable<firebase.User>;
  userUid:string;
  current:any;
  ph:string;
  userExist : FirebaseObjectObservable<any>;

  
  constructor(public afAuth: AngularFireAuth,public router:Router, public db: AngularFireDatabase) { 
    this.user = afAuth.authState;
  }

  //firebase.auth().onAuthStateChanged(firebaseUser => {});
  login()
  {
    
     this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(result => {
      if(result)
      {
        // console.log("fb log in resutl",this.afAuth.auth.currentUser.uid);
        console.log("RESULT",result.user.uid);
        this.userExist = this.db.object('/users/'+result.user.uid);
        this.userExist.subscribe(snapshot =>{
          let exist = (snapshot.$value !== null);
          console.log("exist",exist);
          if (exist) {
            this.router.navigate(['User_Homepage']);
          }
          else{
            this.router.navigate(['NewUser']);
          }
        })
      }
      else{
        console.log("no log in");
      }
     });
  }

  checkUser(uid){
    this.userExist = this.db.object('/users/'+uid)
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
      this.router.navigate(['Home']);
    }


}
