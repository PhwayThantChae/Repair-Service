import { Component, OnInit } from '@angular/core';
import { SpFirebaseDatabaseService } from '../../services/sp-firebase-database.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
declare var $:any;

@Component({
  selector: 'app-sp-week-appointments',
  templateUrl: './sp-week-appointments.component.html',
  styleUrls: ['./sp-week-appointments.component.css']
})
export class SpWeekAppointmentsComponent implements OnInit {

  date2 = [];
  loading = true;
  appointmentList: FirebaseListObservable<any[]>;
  appointments = [];

  apID: string;
  userID: string;
  spID: string;
  ap_date: string;
  ap_time: string;
  device: string;

  constructor(public spFirebase: SpFirebaseDatabaseService, public afAuth: AngularFireAuth) { }

  ngOnInit() {

    this.date2 = this.spFirebase.getNextSevenDays();
    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.loading = true;
        this.appointmentList = this.spFirebase.getAppointmentsSPHome();
        this.appointmentList.map(y => {
          this.spFirebase.getUserInfo(y.uid).$ref.on("child_changed", snapshot => {
            console.log("SNAPSHOT", snapshot.val());
            if (snapshot) {
              this.appointments = [];
            }
          });

          this.spFirebase.getAppointmentsSPFiltered(x.uid).$ref.on("child_changed", snapshot => {
            if (snapshot) {
              this.appointments = [];
            }
          });
          this.spFirebase.getAppointmentsSPFiltered(x.uid).$ref.on("child_removed", snapshot => {
            if (snapshot) {
              this.appointments = [];
            }
          });
          this.spFirebase.getAppointmentsSPFiltered(x.uid).$ref.on("child_added", snapshot => {
            if (snapshot) {
              this.appointments = [];
            }
          });

          y.filter(y => {
            console.log(y.imgurl);
            if (y.spid == x.uid && y.state == "completed") {

              //Check availability of the appointment within one week
              var dateParts = y.date.split('/');  // Appointment Date
              var d1 = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

              var lastdayParts = this.spFirebase.getNextSevenDays();
              lastdayParts = lastdayParts[lastdayParts.length - 1].split('/');
              var lastDay = new Date(Number(lastdayParts[2]), Number(lastdayParts[1]) - 1, Number(lastdayParts[0]));

              console.log("Last Day", lastDay);

              var d2 = new Date(Date.now());  // Current Date
              d2.setHours(0, 0, 0, 0);
              var todayDate = Date.parse(d2.toLocaleDateString());
              var unavailable = (d1 >= d2 && d1 <= lastDay) ? "false" : "true";

              if (unavailable == 'false') {

                this.spFirebase.getUserInfo(y.uid).map(z => {
                  if (z) {
                    let appointment = {
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
                      "uid": y.uid,
                      "spid": y.spid,
                    }

                    this.appointments.push(appointment);
                  }
                }).subscribe(data => {
                  if (data) {
                    this.appointments = [];
                    this.appointments.push(data);
                    console.log("week appointments", this.appointments);
                  }
                });

              }

            }
          })
        }).subscribe(data => {
          if (data) {
            console.log("data win tal");
            console.log(this.appointments);
            this.loading = false;
          }
          else {
            this.loading = false;
          }
        });
      }
    });
  }

  cancelModal() {
    $('.ui.modal').modal('hide');
  }

  appointmentAction(apID, userid, spid, ap_date, ap_time, device, action) {

    var modal_id = apID;
    $('.sp-home-week-cancel-modal').attr('id', modal_id);
    console.log("APID", apID);
    this.apID = apID;
    this.userID = userid;
    this.spID = spid;
    this.ap_date = ap_date;
    this.ap_time = ap_time;
    this.device = device;

    $('.sp-home-week-cancel-modal').modal({
      closable: false
    }).modal('show');

  }

  deleteConfirm(apID, userid, spid, date, time, device, state) {

    this.appointments = [];
    this.spFirebase.changeAppointmentStatus(apID, "cancel");
    this.sendNotification("cancel");

  }

  sendNotification(state) {

    var currentTimestamp = Date.now();
    this.spFirebase.sendNotification(this.apID, this.userID, this.spID, this.ap_time, this.ap_date, currentTimestamp, this.device, state);
  }

}
