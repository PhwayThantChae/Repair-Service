import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
import { Observable } from 'rxjs/Observable';
import * as alertify from 'alertifyjs';
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
  notificationsFirebaseObservable: FirebaseListObservable<any[]>;
  userNoti = [];
  uid: string;
  notiLength = [];
  return_string: string;
  notificationsObservable: Observable<any>;


  constructor(public loginService: LoginService, public router: Router, public afAuth: AngularFireAuth,
              public firebaseDatabase: FirebaseDatabaseService, public db: AngularFireDatabase) {


    this.afAuth.authState.subscribe(x => {

      if (x) {
         
        this.user = x;
        this.userimg = x.photoURL;
        this.username = x.displayName;
        this.uid = x.uid;
       

        // for notitication count
        this.firebaseDatabase.getUserNotification(x.uid).$ref.on("child_changed", snapshot => {
          if (snapshot) {
            // alertify.warning('Warning message');
            this.notiLength = [];
          }
        });
        this.firebaseDatabase.getUserNotification(x.uid).$ref.on("child_added", snapshot => {
          if (snapshot) {
            // alertify.warning('Warning message');
            this.notiLength = [];
          }
        });
        this.firebaseDatabase.getUserNotification(x.uid).$ref.on("child_removed", snapshot => {
          if (snapshot) {
            this.notiLength = [];
          }
        })

        this.firebaseDatabase.getUserNotification(x.uid).map(y => {

          y.filter(y => {
            if (y.read == false) {
              this.notiLength.push(y);
            }
          })
        }).subscribe(data => {

          if (data) {
            this.notiLength = [];
            this.notiLength.push(data);
            this.notiLength.reverse();
          }
        });

        //for notification list
        this.notificationsObservable = this.firebaseDatabase.getNotifications();
        this.notificationsObservable.map(y => {
          // alertify.warning('Warning message');


          y.filter(y => {


            if (y.uid == x.uid) {
              this.firebaseDatabase.getSpInfo(y.spid).map(z => {

                if (z) {
                  let noti = {
                    "notiID": y.$key,
                    "read": y.read,
                    "spimg": z["logo"],
                    "spname": z["company"],
                    "date": y.date,
                    "time": y.time,
                    "device": y.device,
                    "state": y.state,
                    "timestamp": this.timestampToNoti(y.timestamp)
                  }
                  this.userNoti.push(noti);

                  return this.userNoti;
                }

              }).subscribe(data => {
                if (data) {
                  this.firebaseDatabase.getUserNotification(y.uid).$ref.on("child_added", snapshot => {
                    if (snapshot) {
                      // alertify.warning('Warning message');
                      this.userNoti = [];
                    }
                  });
                  this.firebaseDatabase.getSpInfo(y.spid).$ref.on("child_changed", snapshot => {
                    if (snapshot) {
                      this.userNoti = [];
                    }
                  });

                  this.firebaseDatabase.getUserNotification(y.uid).$ref.on("child_changed", snapshot => {
                    if (snapshot) {
                      this.userNoti = [];
                    }
                  });

                  this.firebaseDatabase.getUserNotification(y.uid).$ref.on("child_removed", snapshot => {
                    if (snapshot) {
                      this.userNoti = [];
                    }
                  });
                  this.userNoti = [];
                  this.userNoti = data;
                  this.userNoti.reverse();
                 
                }
              });

              // y.timestamp = this.timestampToNoti(y.timestamp);
            }

          })
        }).subscribe(data => {
          if (data) { }
        })

      }
      else {
        this.router.navigate(['Home']);
      }
    });
  }

  ngOnInit() {
    this.userNoti = [];
    $('.custom.item')
      .popup({
        popup: '.custom.popup',
        position: 'bottom center',
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
        position: 'bottom center',
        // boundary:   $('body'),
        on: 'click'
      });
  }

  timestampToNoti(timestamp) {

    var todayDate = new Date(Date.now()).getTime();  // convert timestamp to Date and getTime()
    var notiDate = new Date(timestamp).getTime();
    var diff = Math.round((todayDate - notiDate) / 3600000);
    this.return_string = this.firebaseDatabase.convert_Hours_To_NotiTime(diff);  // convert differentiated timestamp to hours
    return this.return_string;

  }



}
