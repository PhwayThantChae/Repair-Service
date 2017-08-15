import { Component, OnInit } from '@angular/core';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  user: any;
  notificationsObservable: FirebaseListObservable<any[]>;
  userNoti = [];
  loading: boolean;
  return_string: string;

  constructor(public afAuth: AngularFireAuth, public firebaseDatabase: FirebaseDatabaseService, public db: AngularFireDatabase,
              public router : Router) {}

  ngOnInit() {

    if (this.userNoti.length > 0) {
      for (var i = 0; i < this.userNoti.length; i++) {
        var todayDate = new Date(Date.now()).getTime();  // convert timestamp to Date and getTime()
        var notiDate = new Date(this.userNoti[i]['timestamp']).getTime();
        var diff = Math.round((todayDate - notiDate) / 3600000);
        var notiString = this.firebaseDatabase.convert_Hours_To_NotiTime(diff);  // convert differentiated timestamp to hours
        this.userNoti[i]['timestamp'] = notiString;
      }

    }

    this.loading = true;
    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.userNoti = [];
        this.user = x;
        this.notificationsObservable = this.firebaseDatabase.getAllNotifications();
        this.notificationsObservable.map(y => {
         
          y.filter(y => {
            if (y.uid == x.uid) {
              this.firebaseDatabase.getSpInfo(y.spid).map(z => {

               
                if (z) {
                  let noti = {
                    "notiID" : y.$key,
                    "read" : y.read,
                    "spimg": z["logo"],
                    "spname": z["company"],
                    "date": y.date,
                    "time": y.time,
                    "device": y.device,
                    "state" : y.state,
                    "timestamp": this.timestampToNoti(y.timestamp)
                  }
                  this.userNoti.push(noti);
                  return this.userNoti;
                }

              }).subscribe(data => {
                   
                if (data) {
                  this.firebaseDatabase.getSpInfo(y.spid).$ref.on("child_changed", snapshot => {
                  console.log("SNAPSHOT", snapshot.val());
                  if (snapshot) {
                    this.userNoti = [];
                  }
                });
                this.firebaseDatabase.getUserNotification(y.uid).$ref.on("child_changed",snapshot => {
                  if(snapshot){
                    this.userNoti = [];
                  }
                });
                
                this.firebaseDatabase.getUserNotification(y.uid).$ref.on("child_removed",snapshot => {
                  if(snapshot){
                    this.userNoti = [];
                  }
                });
                       this.firebaseDatabase.getUserNotification(y.uid).$ref.on("child_added",snapshot => {
                  if(snapshot){
                    this.userNoti = [];
                  }
                });
                      this.userNoti = [];
                      console.log("data here", data);
                      this.userNoti = data;
                      // this.userNoti.reverse();
                      console.log(this.userNoti, 'hey appoitm');
                    }
                  });
                
              // y.timestamp = this.timestampToNoti(y.timestamp);
            }

          })
          
        }).subscribe(data => {
          if (data) {
            this.loading = false;
            // this.userNoti.reverse();
            console.log(this.userNoti); //count here
          }
          else {
            this.loading = false;

          }
        })
      }
    });


  }

  timestampToNoti(timestamp) {

    var todayDate = new Date(Date.now()).getTime();  // convert timestamp to Date and getTime()
    var notiDate = new Date(timestamp).getTime();
    var diff = Math.round((todayDate - notiDate) / 3600000);
    this.return_string = this.firebaseDatabase.convert_Hours_To_NotiTime(diff);  // convert differentiated timestamp to hours
    return this.return_string;

  }


  MarkAsRead(key) {

    if ($("#" + key).hasClass("thin")) {
      $("#" + key).toggleClass("thin");
      this.userNoti = [];
      this.firebaseDatabase.changeNotiStatus(key, false);
    }
    else {
      $("#" + key).toggleClass("thin");
      this.userNoti = [];
      this.firebaseDatabase.changeNotiStatus(key, true);
    }

  }
  deleteAllNoti_Modal(){
    $('.deleteNoti-modal')
        .modal({
          onDeny    : function(){
            return true;
          }
          // onApprove : function() {
          //   window.alert('Approved!');
          // }
        })
        .modal('show');
  }

  deleteAllNoti(){

  }

  showNotiDetail(notiID){
    this.router.navigate(['/User_Appointment_Detail',notiID]);
  }

}
