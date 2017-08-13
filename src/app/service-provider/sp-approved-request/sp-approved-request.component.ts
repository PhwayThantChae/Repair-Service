import { Component, OnInit } from '@angular/core';
import { SpLoginServiceService } from '../../services/sp-login-service.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { SpFirebaseDatabaseService } from '../../services/sp-firebase-database.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-sp-approved-request',
  templateUrl: './sp-approved-request.component.html',
  styleUrls: ['./sp-approved-request.component.css']
})
export class SpApprovedRequestComponent implements OnInit {

  loading: boolean;
  userAppointments = [];
  uid: string;
  appointments: FirebaseListObservable<any[]>;
  // appointmentsObservable: Observable<any>;
  userinfo: any;
  apID: string;
  userID: string;
  spID: string;
  date: string;
  time: string;
  device: string;

  constructor(public spLoginService: SpLoginServiceService, public spFirebaseDatabase: SpFirebaseDatabaseService,
    public afAuth: AngularFireAuth) {


  }

  ngOnInit() {
    this.userAppointments = [];
    this.afAuth.authState.subscribe(x => {
      if (x) {

        this.uid = x.uid;
        this.appointments = this.spFirebaseDatabase.getUserAppointments();
        this.appointments.map(y => {
          y.filter(y => {
            if (y.spid == this.uid && (y.state == "completed")) {

              this.spFirebaseDatabase.getUserInfo(y.uid).$ref.on("child_changed", snapshot => {
                console.log("SNAPSHOT", snapshot.val());
                if (snapshot) {
                  console.log(this.userAppointments);
                  this.userAppointments = [];
                }
              });

               this.spFirebaseDatabase.getAppointmentBySpid(y.spid).$ref.on("child_changed",snapshot => {
                if(snapshot){
                  this.userAppointments = [];
                }
              });

              this.spFirebaseDatabase.getAppointmentBySpid(y.spid).$ref.on("child_added",snapshot => {
                if(snapshot){
                  this.userAppointments = [];
                }
              })

              this.spFirebaseDatabase.getAppointmentBySpid(y.spid).$ref.on("child_removed",snapshot => {
                if(snapshot){
                  this.userAppointments = [];
                }
              })
              
                //Check whether appointment can be cancelled or not
                var cancel = this.checkAppointmentCancel(y.time,y.date,y.state);

                //Check availability of the appointment
                var dateParts = y.date.split('/');
                var d1 = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                

                var d2 = new Date(Date.now());
                d2.setHours(0,0,0,0);
                var todayDate = Date.parse(d2.toLocaleDateString());
                var unavailable = (d1 >= d2) ? "false" : "true";

              this.userinfo = this.spFirebaseDatabase.getUserInfo(y.uid).map(z => {

                if (z) {
                  console.log(z);
                  let userinfo = {
                    "apid": y.$key,
                    "emergency": y.emergency,
                    "imgurl": z["imageUrl"],
                    "username": z["username"],
                    "state": y.state,
                    "time": y.time,
                    "date": y.date,
                    "phone": z["ph"],
                    "address": z["address"],
                    "description": y.description,
                    "device": y.device,
                    "brand": y.brand,
                    "uid" : y.uid,
                    "spid" : y.spid,
                    "unavailable": unavailable,
                    "canCancel" : cancel
                  }
                  return userinfo;
                }

              }).subscribe(a => {
                if (a) {
                  if(a.unavailable == 'false'){
                    this.userAppointments.push(a);
                  }
                }

              })
            }
          })
        }).subscribe(data => {
          if (data) {
            this.loading = false;
            console.log(this.userAppointments);
          }
          else {
            this.loading = false;
          }
        })
      }
    });
  }

  checkAppointmentCancel(time,date,state){

    var cancel;
    var timestamp = Date.now();
    if (state == "completed") {
      var appointedtime = time.substring(0, 2);
      var parts = date.split('/');
      var currentDate = new Date();
      var hoursleft = 0;
      var diff = 0;

      if (parts[0] >= currentDate.getUTCDate()) {
        diff = parts[0] - currentDate.getUTCDate();
        if (diff == 1) {
          if (appointedtime == 9) {
            hoursleft = (24 - currentDate.getHours()) + 9;
            console.log("Hours Left" + hoursleft);
          }
          if (appointedtime == 12) {
            hoursleft = (24 - currentDate.getHours()) + 12;
            console.log("Hours Left" + hoursleft);
          }
          if (appointedtime == 9) {
            hoursleft = (24 - currentDate.getHours()) + 15;
            console.log("Hours Left" + hoursleft);
          }

        }
      }

      switch (diff) {

        case 0: cancel = false; break;

        case 1: if (hoursleft >= 24) {
                  cancel = true;
                }
                else {
                  cancel = false;
                } break;

        default: 
          cancel = true;

      }
    }
    else {
      console.log("You can cancel for pending state.");
      cancel = true;

    }
    
    return cancel;

  }


  appointmentAction(apid, userid, spid, date, time, device, action) {

    this.apID = apid;
    this.userID = userid;
    this.spID = spid;
    this.date = date;
    this.time = time;
    this.device = device;

    this.userAppointments = [];
    this.spFirebaseDatabase.changeAppointmentStatus(apid, "cancel");
    this.sendNotification("cancel");

  }

  sendNotification(state) {

    var currentTimestamp = Date.now();
    this.spFirebaseDatabase.sendNotification(this.apID, this.userID, this.spID, this.time, this.date, currentTimestamp, this.device, state);
  }

}
