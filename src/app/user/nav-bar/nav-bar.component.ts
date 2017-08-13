import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { SpFirebaseDatabaseService } from '../../services/sp-firebase-database.service';
import { Router,ActivatedRoute } from '@angular/router';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
import { SpLoginServiceService } from '../../services/sp-login-service.service';

declare var $: any;

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  user: boolean;
  username: string;
  userimg: string;
  spname: string;
  spimg: string;
  currentURL: number;
  spPage: boolean;
  spData: FirebaseObjectObservable<any>;
  loading:boolean;


  constructor(public loginService: LoginService, public router: Router, public afAuth: AngularFireAuth,
    public db: AngularFireDatabase, public firebaseDatabase: FirebaseDatabaseService,
    public spLoginService: SpLoginServiceService, public spFirebase: SpFirebaseDatabaseService,
    public route : ActivatedRoute) { 

  }

  ngOnInit() {
    $('#noti').popup();
      console.log(this.route.snapshot.firstChild.url[0].path);
      console.log("1111111111",this.route.snapshot.url); // array of states
      console.log("2222222222222",this.route.snapshot.url[0].path); 
    console.log("URL",this.router.url);
    this.router.events.subscribe((res) => {
      console.log(this.router.url, "Current URL navbar");
     
      this.currentURL = 0;
      // this.currentURL = true;
      switch (this.router.url) {
        case "/Home": this.currentURL = 0; break;
        case "/Sp_LogIn": this.currentURL = 0; break;
        case "/Sp_Homepage": this.currentURL = 2; break;
        case "/QueuingRequest": this.currentURL = 2; break;
        case "/ApprovedRequest": this.currentURL = 2; break;
        case "/Sp_Profile" : this.currentURL = 2; break;
        case "/User_Homepage": this.currentURL = 1; break;
        case "/Sp_Appointment_Detail/:id" : this.currentURL = 2; break;

      }

    });

   
  }

  showNoti(){
    console.log("show");
     $('.right.menu #noti')
        .popup({
          popup : '.custom.popup',
          on    : 'click'
        });

  }

  side() {
    $('.ui.sidebar').sidebar('toggle');
  }

  currentUser() {
    // console.log("User Authenticated");
    return this.loginService.currentUser();
  }

  currentSpUser() {
    console.log("Service Provider Authenticated");
    return this.spLoginService.currentSp();
  }



  setSpProfile(): boolean {
    if (this.spLoginService.currentSp()) {

      this.spData = this.spFirebase.getNavbarData(this.spLoginService.returnSP().uid);
      this.spData.subscribe(data => {
        if (data) {
          this.spname = data.company;
          this.spimg = data.logo;
        }

      });
      return true;
    }
  }



  login() {

    this.loginService.login();
    ///////////////////////
    this.afAuth.authState.subscribe(auth => {
      if (auth) {

        this.userimg = auth.photoURL;

        this.username = auth.displayName;
        let user_exist: FirebaseObjectObservable<any> = this.db.object(`/users/${auth.uid}`, { preserveSnapshot: true });
        user_exist.subscribe(snapshot => {
          let exist = (snapshot.val() !== null);
          if (exist) {
            // this.router.navigate(['User_Homepage']);
          }
          else {

            this.redirect_User_Homepage(this.loginService.isAuthenticated());

          }
        });
      }

    });



    ////////////////////////
  }

  setProfile(): boolean {
    if (this.loginService.currentUser()) {

      this.userimg = this.loginService.returnUser().photoURL;
      this.username = this.loginService.returnUser().displayName;
      return true;
    }
    else {
      console.log("no logged in user");
      // this.userimg = this.loginService.returnUser().photoURL;
      // this.username = this.loginService.returnUser().displayName;

      return false;
    }
  }


  loginModal() {
    $('.ui.modal')
      .modal('setting', 'closable', false)
      .modal('setting', 'transition', "scale")
      .modal('show');

  }

  redirect_User_Homepage(x) {

    if (x) {
      this.loginModal();
    }

  }

  spLogout() {
    this.spLoginService.spLogOut();
  }
  logout() {

    this.loginService.logout();
  }

}
