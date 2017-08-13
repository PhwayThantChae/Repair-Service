import { Component, OnInit } from '@angular/core';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { SpFirebaseDatabaseService } from '../../services/sp-firebase-database.service';
declare var $:any;

@Component({
  selector: 'app-sp-notifications',
  templateUrl: './sp-notifications.component.html',
  styleUrls: ['./sp-notifications.component.css']
})
export class SpNotificationsComponent implements OnInit {

  user: any;
  notificationsObservable: FirebaseListObservable<any[]>;
  spNoti = [];
  loading: boolean;
  return_string: string;

  constructor(public afAuth: AngularFireAuth, public spFirebaseDatabase: SpFirebaseDatabaseService, public db: AngularFireDatabase) { }

  ngOnInit() {

    this.loading = true;
    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.user = x;
        this.notificationsObservable = this.spFirebaseDatabase.getSpAllNotifications();
        this.notificationsObservable.map(y => {
          y.filter(y => {
             this.spFirebaseDatabase.getUserInfo(y.uid).$ref.on("child_changed", snapshot => {
                      if (snapshot) {
                        this.spNoti = [];
                      }
                    });
                    this.spFirebaseDatabase.getSpNotifications(y.spid).$ref.on("child_changed", snapshot => {
                      if (snapshot) {
                        this.spNoti = [];
                      }
                    });
                    this.spFirebaseDatabase.getSpNotifications(y.spid).$ref.on("child_removed", snapshot => {
                      if (snapshot) {
                        this.spNoti = [];
                      }
                    });
            if (y.spid == x.uid) {
              this.spFirebaseDatabase.getUserInfo(y.uid).map(z => {
                

                   
               
                if(z){
                  let noti = {
                    "notiID" : y.$key,
                    "read" : y.read,
                    "userimg" : z["imageUrl"],
                    "spname" : y.company,
                    "state" : y.state,
                    "date" : y.date,
                    "time" : y.time,
                    "username" : z["username"],
                    "timestamp" : this.timestampToNoti(y.timestamp)
                  }
                   this.spNoti.push(noti);
                }
             
              // y.timestamp = this.timestampToNoti(y.timestamp);
            }).subscribe(data => {
                if(data){
                   this.loading = false;
                   this.spFirebaseDatabase.getSpNotifications(y.spid).$ref.on("child_added", snapshot => {
                      if (snapshot) {
                        this.spNoti = [];
                      }
                    });

                    this.spFirebaseDatabase.getUserInfo(y.uid).$ref.on("child_changed", snapshot => {
                      if (snapshot) {
                        this.spNoti = [];
                      }
                    });
                    this.spFirebaseDatabase.getSpNotifications(y.spid).$ref.on("child_changed", snapshot => {
                      if (snapshot) {
                        this.spNoti = [];
                      }
                    });
                    this.spFirebaseDatabase.getSpNotifications(y.spid).$ref.on("child_removed", snapshot => {
                      if (snapshot) {
                        this.spNoti = [];
                      }
                    });
                   this.spNoti = [];
                   this.spNoti.push(data);
                   this.spNoti.reverse();
                }
            })
            }

          })
          
        }).subscribe(data => {
          if (data) {
            this.loading = false;
            
            // this.spNoti.push(data);
          }
          else {
            this.loading = false;

          }
        })
      }
    });
  }

  timestampToNoti(timestamp){

    var todayDate = new Date(Date.now()).getTime();  // convert timestamp to Date and getTime()
    var notiDate = new Date(timestamp).getTime();
    var diff = Math.round((todayDate - notiDate) / 3600000);
    this.return_string = this.spFirebaseDatabase.convert_Hours_To_NotiTime(diff);  // convert differentiated timestamp to hours
    return this.return_string;

  }

    MarkAsRead(key) {

    if ($("#" + key).hasClass("thin")) {
      $("#" + key).toggleClass("thin");
      this.spNoti = [];
      this.spFirebaseDatabase.changeNotiStatus(key, false);
    }
    else {
      $("#" + key).toggleClass("thin");
      this.spNoti = [];
      this.spFirebaseDatabase.changeNotiStatus(key, true);
    }

  }
  deleteAllNoti_Modal(){
    $('.deleteNoti-modal')
        .modal({
          onDeny    : function(){
            return true;
          },
          // onApprove : function() {
          //   window.alert('Approved!');
          // }
        })
        .modal('show');
  }

  deleteAllNoti(){

  }


}
