import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
declare var $:any;

@Component({
  selector: 'app-user-login-navbar',
  templateUrl: './user-login-navbar.component.html',
  styleUrls: ['./user-login-navbar.component.css']
})
export class UserLoginNavbarComponent implements OnInit {

  currentURL:string;
  constructor(public loginService: LoginService, public router: Router, public afAuth: AngularFireAuth,
    public firebaseDatabase: FirebaseDatabaseService, public db: AngularFireDatabase,) {
      this.router.events.subscribe((res) => {
        this.currentURL = this.router.url;
      });
     }

  ngOnInit() {
  }

  login() {

    this.loginService.login();
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        let user_exist: FirebaseObjectObservable<any> = this.db.object(`/users/${auth.uid}`, { preserveSnapshot: true });
        user_exist.subscribe(snapshot => {
          let exist = (snapshot.val() !== null);
          console.log("exist",exist);
          if (exist) {
            this.router.navigate(['User_Homepage']);
          }
          if(!exist){
            // this.redirect_User_Homepage();
             $('.loginmodal')
              .modal('setting', 'closable', false)
              .modal('setting', 'transition', "scale")
              .modal('show');
          }
        });
      }
    });
  }

  redirect_User_Homepage() {

      this.loginModal();
    
  }

  loginModal() {

    $('.loginmodal')
      .modal('setting', 'closable', false)
      .modal('setting', 'transition', "scale")
      .modal('show');

  }


}
