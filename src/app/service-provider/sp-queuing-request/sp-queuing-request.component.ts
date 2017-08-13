import { Component, OnInit } from '@angular/core';
import { SpLoginServiceService } from '../../services/sp-login-service.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { SpFirebaseDatabaseService } from '../../services/sp-firebase-database.service';
import { AngularFireAuth } from 'angularfire2/auth';

declare var $: any;

@Component({
  selector: 'app-sp-queuing-request',
  templateUrl: './sp-queuing-request.component.html',
  styleUrls: ['./sp-queuing-request.component.css']
})
export class SpQueuingRequestComponent implements OnInit {

  loading: boolean;
  userAppointments = [];
  apID: string;
  userID: string;
  spID: string;
  company: string;
  branch: string;
  date: string;
  time: string;
  uid: string;
  spimg: string;
  device: string;
  appointments: FirebaseListObservable<any[]>;
  dateArray = [];
  userinfo: any;

  constructor(public spLoginService: SpLoginServiceService, public spFirebaseDatabase: SpFirebaseDatabaseService,
    public afAuth: AngularFireAuth) {

    this.userAppointments = [];
    this.afAuth.authState.subscribe(x => {
      if (x) {

        this.dateArray = this.spFirebaseDatabase.getNextSevenDays();
        this.uid = x.uid;
        this.appointments = this.spFirebaseDatabase.getUserAppointments();
        this.appointments.map(y => {
          y.filter(y => {
            if (y.spid == this.uid && (y.state == "pending" || y.state == "rescheduled")) {
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
                //Check availability of the appointment
              var dateParts = y.date.split('/');
              var d1 = new Date(dateParts[2],dateParts[1]-1,dateParts[0]);
              // var apDate = Date.parse(d1.toLocaleDateString());
              console.log(d1);

              var d2 = new Date(Date.now());
              var todayDate = Date.parse(d2.toLocaleDateString());
              console.log(d2);
              var unavailable = (d1 >= d2) ? "false" : "true";

              this.userinfo = this.spFirebaseDatabase.getUserInfo(y.uid).map(z => {

                if (z) {
                  console.log(z);
                  let userinfo = {
                    "apid": y.$key,
                    "uid": y.uid,
                    "spid": y.spid,
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
                    "unavailable" : unavailable
                  }
                  return userinfo;
                }

              }).subscribe(a => {
                if (a) {
                  this.userAppointments.push(a);
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

  ngOnInit() {
    $(".ui.dropdown").dropdown();
    this.userAppointments = [];
  }

  appointmentAction(apID, userid, spid, date, time, device, action) {
    console.log("userid", userid);
    this.apID = apID;
    this.userID = userid;
    this.spID = spid;
    this.date = date;
    this.time = time;
    this.device = device;


    if (action == "approve") {
      this.userAppointments = [];
      this.spFirebaseDatabase.changeAppointmentStatus(apID, "completed");
      this.sendNotification("completed");
    }
    else if (action == "reschedule") {
      // this.spFirebaseDatabase.changeAppointmentStatus(apID,"reschedule");            
      $('.reschedule-modal')
        .modal('setting', 'closable', false)
        .modal('setting', 'transition', "scale")
        .modal('show');
    }
    else {
      this.userAppointments = [];
      this.spFirebaseDatabase.changeAppointmentStatus(apID, "cancel");
      this.sendNotification("cancel");
    }
  }

  onSubmit(form) {
    this.userAppointments = [];

    this.spFirebaseDatabase.rescheduleAppointment(this.apID, form.date, form.time, "rescheduled");

    //Send Notification of Service Provider Rescheduling to Customer 
    this.sendNotification("rescheduled");

    $('.reschedule-modal').modal('hide');
  }

  sendNotification(state) {
    //Send Notification of Service Provider Rescheduling to Customer 
    // var currentData = [];
    // currentData = this.spFirebaseDatabase.getCurrentDateTime();
    var currentTimestamp = Date.now();
    this.spFirebaseDatabase.sendNotification(this.apID, this.userID, this.spID, this.time, this.date, currentTimestamp, this.device, state);
  }

}
