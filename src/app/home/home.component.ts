import { Component, OnInit } from '@angular/core';
import { SpLoginServiceService } from '../services/sp-login-service.service';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { AngularFireAuth } from 'angularfire2/auth';
import * as knayi from 'knayi-myscript';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public router: Router, public loginService: LoginService,public spLoginService:SpLoginServiceService,
              public afAuth: AngularFireAuth) {

      
      
      // this.afAuth.authState.subscribe(x => {
      //   if(x){
      //     if(this.loginService.currentUser()){
      //       this.loginService.logout();
      //     }
      //     if(this.spLoginService.currentSp()){
      //       this.spLoginService.spLogOut();
      //     }
      //   }
      // });
    console.log("User current user",this.loginService.currentUser());
    console.log("SP current user",this.spLoginService.currentSp());
     console.log("AuthState "+this.afAuth.authState);
     if(this.afAuth.auth.currentUser){
       this.afAuth.auth.signOut();
     }
    

  }

  ngOnInit() {

    $(".here").click(function () {
      $('html,body').animate({
        scrollTop: $("#here").offset().top
      },
        'slow');
    });
  }

}
