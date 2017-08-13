import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { SpFirebaseDatabaseService } from '../../services/sp-firebase-database.service';
import { SpLoginServiceService } from '../../services/sp-login-service.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-sp-navbar',
  templateUrl: './sp-navbar.component.html',
  styleUrls: ['./sp-navbar.component.css']
})
export class SpNavbarComponent implements OnInit {

  spData: FirebaseObjectObservable<any>;
  spuser: any;
  spname: string;
  spimg: string;
  spNoti = [];
  notiLength = [];
  spid: string;
  notificationsObservable: FirebaseListObservable<any[]>;
  return_string: string;

  constructor(public afAuth: AngularFireAuth, public spFirebase: SpFirebaseDatabaseService,
    public spLoginService: SpLoginServiceService, public route: Router) {


  }

  ngOnInit() {

    $('.spcustom.item')
      .popup({
        popup: '.spcustom.popup',
        position: 'bottom center',
        lastResort: 'bottom center',
        inline: true,
        // boundary:   $('body'),
        on: 'click'
      });

    this.spname = "";

    this.afAuth.authState.subscribe(x => {
      if (x) {

        this.spname = "";
        this.spid = x.uid;
        this.spData = this.spFirebase.getNavbarData(x.uid);
        this.spData.subscribe(data => {
          this.spuser = data;
          if (data) {
            this.spname = data.company;
            this.spimg = data.logo;
          }

          this.spFirebase.getSpNotifications(x.uid).$ref.on("child_changed", snapshot => {
            if (snapshot) {
              this.notiLength = [];
            }
          });

          this.spFirebase.getSpNotifications(x.uid).$ref.on("child_added", snapshot => {
            if (snapshot) {
              this.notiLength = [];
            }
          });

          this.spFirebase.getSpNotifications(x.uid).$ref.on("child_removed", snapshot => {
            if (snapshot) {
              this.notiLength = [];
            }
          });

          // this.spNoti = [];

          //for notification count
          this.spFirebase.getSpNotifications(x.uid).map(y => {

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
          })

          // for notification list
          this.notificationsObservable = this.spFirebase.getSpUnreadNotifications();

          this.notificationsObservable.map(y => {



            y.filter(y => {


              // this.spFirebase.getSpInfo(y.spid).$ref.on("child_changed", snapshot => {
              //   console.log("SNAPSHOT", snapshot.val());
              //   if (snapshot) {
              //     this.spNoti = [];
              //   }
              // });


              if (y.spid == x.uid) {
                this.spFirebase.getUserInfo(y.uid).map(z => {
                   this.spFirebase.getUserInfo(y.uid).$ref.on("child_changed", snapshot => {
                      if (snapshot) {
                        this.spNoti = [];
                      }
                    });
                    this.spFirebase.getSpNotifications(y.spid).$ref.on("child_changed", snapshot => {
                      if (snapshot) {
                        this.spNoti = [];
                      }
                    });
                    this.spFirebase.getSpNotifications(y.spid).$ref.on("child_removed", snapshot => {
                      if (snapshot) {
                        this.spNoti = [];
                      }
                    });
                  if (z) {
                    let noti = {
                      "notiID": y.$key,
                      "timestamp": this.timestampToNoti(y.timestamp),
                      "username": z["username"],
                      "userimg": z["imageUrl"],
                      "read": y.read,
                      "date": y.date,
                      "time": y.time,
                      "device": y.device,
                      "state": y.state
                    }
                    this.spNoti.push(noti);
                    console.log("SPNOITI", this.spNoti);
                    return this.spNoti;
                  }

                }).subscribe(data => {
                  if (data) {
                    this.spFirebase.getSpNotifications(y.spid).$ref.on("child_added", snapshot => {
                      if (snapshot) {
                        this.spNoti = [];
                      }
                    });

                    this.spFirebase.getUserInfo(y.uid).$ref.on("child_changed", snapshot => {
                      if (snapshot) {
                        this.spNoti = [];
                      }
                    });
                    this.spFirebase.getSpNotifications(y.spid).$ref.on("child_changed", snapshot => {
                      if (snapshot) {
                        this.spNoti = [];
                      }
                    });
                    this.spFirebase.getSpNotifications(y.spid).$ref.on("child_removed", snapshot => {
                      if (snapshot) {
                        this.spNoti = [];
                      }
                    });
                    this.spNoti = [];
                    this.spNoti = data;
                    this.spNoti.reverse();
                  }
                });
              }

            })
          }).subscribe(data => {
            if (data) { }
          });

        });
      }
    });

  }

  side() {

    console.log(this.spname);
    var modal_id = this.spid;
    $('.spsidebar').attr('id', modal_id);
    $('#' + modal_id).sidebar('toggle');
    $('.spcustom.item')
      .popup({
        popup: '.spcustom.popup',
        position: 'bottom center',
        lastResort: 'bottom center',
        inline: true,
        // boundary:   $('body'),
        on: 'click'
      });


  }

  spLogout() {
    this.spLoginService.spLogOut();
  }

  timestampToNoti(timestamp) {

    var todayDate = new Date(Date.now()).getTime();  // convert timestamp to Date and getTime()
    var notiDate = new Date(timestamp).getTime();
    var diff = Math.round((todayDate - notiDate) / 3600000);
    this.return_string = this.spFirebase.convert_Hours_To_NotiTime(diff);  // convert differentiated timestamp to hours
    return this.return_string;

  }

}
