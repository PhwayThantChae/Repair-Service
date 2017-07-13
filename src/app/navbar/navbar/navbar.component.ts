import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentURL : number;
  user:any;

  constructor(public router:Router, public afAuth: AngularFireAuth) { 

    this.router.events.subscribe((res) => {
      console.log(this.router.url, "Current URL navbar");
      this.currentURL = 0;
      switch (this.router.url) {
        case "/Home": this.currentURL = 0; break;
        case "/Sp_LogIn": this.currentURL = 0; break;
        case "/Sp_Homepage": this.currentURL = 2; break;
        case "/QueuingRequest": this.currentURL = 2; break;
        case "/ApprovedRequest": this.currentURL = 2; break;
        case "/Sp_Profile" : this.currentURL = 2; break;
        case "/SpNotifications" : this.currentURL = 2;break;
        default: this.currentURL = 1; break;
      }

    });

     this.afAuth.authState.subscribe(x => {
      if (x) {
        this.user = x;
      }
      else{
        this.user = null;
      }
    });
  }

  ngOnInit() {
  }

}
