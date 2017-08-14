import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { SpFirebaseDatabaseService } from '../../services/sp-firebase-database.service';

@Component({
  selector: 'app-sp-noti-appointment-detail',
  templateUrl: './sp-noti-appointment-detail.component.html',
  styleUrls: ['./sp-noti-appointment-detail.component.css']
})
export class SpNotiAppointmentDetailComponent implements OnInit {

  notiID: string;
  loading: boolean;
  notiTimestamp: string;
  appointment: any;
  user: any;

  constructor(public spFirebase: SpFirebaseDatabaseService, public afAuth: AngularFireAuth,public route:ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe(x => {
      this.notiID = x["id"];
      console.log(this.notiID,"NOTI ID");
      this.afAuth.authState.subscribe(x => {
        this.user = null;
        this.appointment = null;
        this.loading = true;
        if (x) {

          this.spFirebase.getSpNotiID(this.notiID).map(y => {
            this.notiTimestamp = new Date(y.timestamp).toLocaleDateString();
            console.log("Timestamp", this.notiTimestamp);
            this.spFirebase.getUserInfo(y.uid).map(user => {

              if (user) {

                let userObject = {
                  "address": user["address"],
                  "email": user["email"],
                  "ph": user["ph"],
                  "username": user["username"],
                  "userimg": user["imageUrl"],
                }
                return userObject;
              }
            }).subscribe(userData => {
              if (userData) {
                this.user = null;
                this.user = userData;
                console.log(userData);
              }
            });

            this.spFirebase.getAppointmentDetail(y.apid).map(appointment => {
              if (appointment) {
                let appointmentObject = {
                  "date": appointment["date"],
                  "emergency": appointment["emergency"],
                  "time": appointment["time"],
                  "brand": appointment["brand"],
                  "description": appointment["description"],
                  "device": appointment["device"],
                  "state": appointment["state"],
                  "apTimestamp": new Date(y["timestamp"]).toLocaleDateString(),
                  "userAddress": appointment["userAddress"]
                }
                return appointmentObject;
              }
            }).subscribe(apData => {
              if (apData) {
                this.appointment = null;
                this.appointment = apData;
                console.log(apData, "Appointment");
              }
            })
            return this.notiTimestamp;
          }).subscribe(data => {
            if (data) {
              this.loading = false;
              this.notiTimestamp = null;
              this.notiTimestamp = data;
            }
          })
        }
      })
    })
  }

}
