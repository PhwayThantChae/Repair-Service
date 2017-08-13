import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
declare var $: any;

@Component({
  selector: 'app-user-requested-service',
  templateUrl: './user-requested-service.component.html',
  styleUrls: ['./user-requested-service.component.css']
})
export class UserRequestedServiceComponent implements OnInit {

  uid: string;
  appointments = [];
  new = [];
  appointmentList: FirebaseListObservable<any>;
  loading: boolean;

  apID: string;
  time: string;
  date: string;
  state: string;
  spid: string;
  device: string;
  items: Observable<Array<string>>;


  constructor(public loginService: LoginService, public firebaseDatabase: FirebaseDatabaseService,
    public afAuth: AngularFireAuth) {
    this.appointments = [];
  }

  ngOnInit() {

    this.appointments = [];
    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.appointments = [];
        this.loading = true;
        this.uid = x.uid;
        this.appointmentList = this.firebaseDatabase.readUserAppointmentData();


        this.appointmentList.map(y => {
          this.firebaseDatabase.getAppointmentByUid(y.uid).$ref.on("child_added", snapshot => {

                    if (snapshot) {
                      this.appointments = [];
                    }
                  });
          if (y) {
            this.loading = false;
            y.filter(y => {
              if (y.uid == x.uid) {
                
                //Check whether appointment can be cancelled or not
                var cancel = this.checkAppointmentCancel(y.time,y.date,y.state);

                //Check availability of the appointment
                var dateParts = y.date.split('/');
                var d1 = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                

                var d2 = new Date(Date.now());
                d2.setHours(0,0,0,0);
                var todayDate = Date.parse(d2.toLocaleDateString());
                var unavailable = (d1 >= d2) ? "false" : "true";


                this.firebaseDatabase.getSpInfo(y.spid).map(z => {

                  this.firebaseDatabase.getAppointmentByUid(y.uid).$ref.on("child_changed", snapshot => {
                    console.log("SNAPSHOT", snapshot.val());
                    if (snapshot) {
                      this.appointments = [];
                    }
                  });

                  

                  this.firebaseDatabase.getAppointmentByUid(y.uid).$ref.on("child_removed", snapshot => {
                    console.log("SNAPSHOT", snapshot.val());
                    if (snapshot) {
                      this.appointments = [];
                    }
                  });


                  this.firebaseDatabase.getSpInfo(y.spid).$ref.on("child_changed", snapshot => {
                    console.log("SNAPSHOT", snapshot.val());
                    if (snapshot) {
                      this.appointments = [];
                    }
                  });

                  if (z) {
                    let requested_service = {
                      'apid': y.$key,
                      'spid': y.spid,
                      'uid': y.uid,
                      'spimg': z["logo"],
                      'company': z["company"],
                      'branch': z["branch"],
                      'state': y.state,
                      'emergency': y.emergency,
                      'device': y.device,
                      'date': y.date,
                      'time': y.time,
                      'unavailable': unavailable,
                      'canCancel' : cancel
                    };
                   
                    return requested_service;
                  }
                }).subscribe(data => {
                  if (data) {
                    if(data.unavailable == 'false' && data.state !== 'cancel'){
                      this.appointments.push(data);
                    }
                    
                    console.log(this.appointments, 'hey appoitm');
                  }
                });
                // }

              }
            });
          }
          else {
            this.loading = false;
          }

        }).subscribe(data => {
          if (data) {
            this.appointments = [];
          }
        });

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


  cancelAppointment(apID, time, date, state, spid, device, uid) {

    this.apID = apID;
    this.time = time;
    this.date = date;
    this.state = state;
    this.spid = spid;
    this.device = device;
    this.uid = uid;

    // var timestamp = Date.now();
    // if (state == "completed") {
    //   var appointedtime = time.substring(0, 2);
    //   var parts = date.split('/');
    //   var currentDate = new Date();
    //   var hoursleft = 0;
    //   var diff = 0;

    //   if (parts[0] >= currentDate.getUTCDate()) {
    //     diff = parts[0] - currentDate.getUTCDate();
    //     if (diff == 1) {
    //       if (appointedtime == 9) {
    //         hoursleft = (24 - currentDate.getHours()) + 9;
    //         console.log("Hours Left" + hoursleft);
    //       }
    //       if (appointedtime == 12) {
    //         hoursleft = (24 - currentDate.getHours()) + 12;
    //         console.log("Hours Left" + hoursleft);
    //       }
    //       if (appointedtime == 9) {
    //         hoursleft = (24 - currentDate.getHours()) + 15;
    //         console.log("Hours Left" + hoursleft);
    //       }

    //     }
    //   }

    //   switch (diff) {

    //     case 0: console.log("Show Dialog");
    //       $('.cancel-modal').modal({
    //         closable: false,
    //         onDeny: function () {
    //           return true;
    //         }
    //       }).modal('show'); break;

    //     case 1: if (hoursleft >= 24) {
    //       this.appointments = [];
    //       this.firebaseDatabase.changeAppointmentStatus(apID, "cancel");
    //       this.firebaseDatabase.sendNotifications(apID, date, time, device, spid, "cancel", uid, timestamp);
    //     }
    //     else {
          $('.cancel-modal').modal({
            closable: false,
            onDeny: function () {
              return true;
            }
          }).modal('show');
    //     } break;

    //     default: this.appointments = [];
    //       this.firebaseDatabase.changeAppointmentStatus(apID, "cancel");
    //       this.firebaseDatabase.sendNotifications(apID, date, time, device, spid, "cancel", uid, timestamp);

    //   }
    // }
    // else {
    //   console.log("You can cancel for pending state.");
    //   this.appointments = [];
    //   this.firebaseDatabase.changeAppointmentStatus(apID, "cancel");

    // }
  }




  rescheduledAppointment(apid, date, time, device, spid, state, uid, action) {

    var timestamp = Date.now();
    this.appointments = [];
    if (action == "accept") {
      this.firebaseDatabase.changeAppointmentStatus(apid, "completed");
      this.firebaseDatabase.sendNotifications(apid, date, time, device, spid, "completed", uid, timestamp);
    }
    else {
      $('.cancel-modal').modal({
            closable: false,
            onDeny: function () {
              return true;
            }
          }).modal('show');
      // this.firebaseDatabase.changeAppointmentStatus(apid, "cancel");
      // this.firebaseDatabase.sendNotifications(apid, date, time, device, spid, "cancel", uid, timestamp);
    }
  }

  deleteConfirm(apID, time, date, state, spid, device, uid) {

    console.log("Delete Confirmed");
    var timestamp = Date.now();

    this.appointments = [];
    this.firebaseDatabase.changeAppointmentStatus(apID, "cancel");
    this.firebaseDatabase.sendNotifications(apID, date, time, device, spid, "cancel", uid, timestamp);
  }

}
