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

          this.spNoti = [];
          // this.spid = x.uid;
          this.notificationsObservable = this.spFirebase.getSpNotifications();

          this.notificationsObservable.map(y => {

            y.filter(y => {
              if (y.spid == x.uid) {
                this.spNoti.push(y);
                y.timestamp = this.timestampToNoti(y.timestamp);
              }
            })
            this.spNoti.reverse();
          }).subscribe(data => {
            if (data) {
              console.log(this.spNoti);
            }
            else {
              // this.loading = true;
            }
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
