import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
declare var $: any;

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css']
})
export class UserNavbarComponent implements OnInit {

  user: any;
  userimg: string;
  username: string;
  currentURL: number;
  notificationsObservable: FirebaseListObservable<any[]>;
  userNoti = [];
  uid: string;
  notiLength : number;
  return_string : string;


  constructor(public loginService: LoginService, public router: Router, public afAuth: AngularFireAuth,
    public firebaseDatabase: FirebaseDatabaseService, public db: AngularFireDatabase) {

    
    this.afAuth.authState.subscribe(x => {
     
      if (x) {
        this.user = x;
        this.userimg = x.photoURL;
        this.username = x.displayName;
        this.uid = x.uid;
        this.notificationsObservable = this.firebaseDatabase.getNotifications();

        this.notificationsObservable.map(y => {
          y.filter(y => {
            if (y.uid == x.uid) {
              this.userNoti.push(y);
              y.timestamp = this.timestampToNoti(y.timestamp);
            }
          })
          this.notiLength = this.userNoti.length;
          this.userNoti.reverse();
          console.log("Noti Length ",this.notiLength);
        }).subscribe(data => {
          if (data) {
            console.log(this.userNoti);
          }
        });
        
      }
    });
  }

  ngOnInit() {
    this.userNoti = [];
    $('.custom.item')
        .popup({
          popup: '.custom.popup',
          position  : 'bottom center',
          inline: true,
          // boundary:   $('body'),
          on: 'click'
        });
   }

  logout() {
    this.loginService.logout();
  }

  side() {
    $('.usersidebar').sidebar('toggle');
    $('.custom.item')
      .popup({
        popup: '.custom.popup',
        inline: true,
        position  : 'bottom center',
        // boundary:   $('body'),
        on: 'click'
      });
  }

  timestampToNoti(timestamp){

    var todayDate = new Date(Date.now()).getTime();  // convert timestamp to Date and getTime()
    var notiDate = new Date(timestamp).getTime();
    var diff = Math.round((todayDate - notiDate) / 3600000);
    this.return_string = this.firebaseDatabase.convert_Hours_To_NotiTime(diff);  // convert differentiated timestamp to hours
    return this.return_string;

  }



}
