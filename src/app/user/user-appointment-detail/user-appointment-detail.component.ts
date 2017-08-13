import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
declare var $:any;

@Component({
  selector: 'app-user-appointment-detail',
  templateUrl: './user-appointment-detail.component.html',
  styleUrls: ['./user-appointment-detail.component.css']
})
export class UserAppointmentDetailComponent implements OnInit {

  notiID: string;
  loading: boolean;
  notiTimestamp: string;
  appointment: any;
  sp: any;
  emailArray = [];
  phArray = [];
  hotlineArray = [];
  servicesArray = [];

  constructor(public route: ActivatedRoute, public afAuth: AngularFireAuth, public firebaseDatabase: FirebaseDatabaseService, public router: Router) {}

  ngOnInit() {

    this.route.params.subscribe(x => {
      this.notiID = x["id"];

      this.afAuth.authState.subscribe(x => {
        this.sp = null;
        this.appointment = null;
        this.loading = true;
        if (x) {

          this.firebaseDatabase.getNotificationDetail(this.notiID).map(y => {
            this.notiTimestamp = new Date(y.timestamp).toLocaleDateString();
            console.log("Timestamp", this.notiTimestamp);
            this.firebaseDatabase.getSpInfo(y.spid).map(sp => {
              if($.isArray(sp['email'])){
                this.emailArray = sp['email'].toString().split(',');
              }
              else{
                this.emailArray = sp['email'].toString().split(',');
              }

              if($.isArray(sp['ph'])){
                this.phArray = sp['ph'].toString().split(',');
              }
              else{
                this.phArray = sp['ph'].toString().split(',');
              }

              if($.isArray(sp['hotline'])){
                this.hotlineArray = sp['hotline'].toString().split(',');
              }
              else{
                this.hotlineArray = sp['hotline'].toString().split(',');
              }

              if($.isArray(sp['services'])){
                this.servicesArray = sp['services'].toString().split(',');
              }
              else{
                this.servicesArray = sp['hotline'].toString().split(',');
              }

              if (sp) {

                let spObject = {
                  "branch": sp["branch"],
                  "company": sp["company"],
                  "hotline": this.hotlineArray.join(', '),
                  "ph": this.phArray.join(', '),
                  "spimg": sp["logo"],
                  "address": sp["address"],
                  "email": this.emailArray.join(', '),
                  "services": this.servicesArray.join(', ')
                }
                return spObject;
              }
            }).subscribe(spData => {
              if (spData) {
                this.sp = spData;

              }
            });

            this.firebaseDatabase.getAppointmentDetail(y.apid).map(appointment => {
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
                this.appointment = apData;
              }
            })
            return this.notiTimestamp;
          }).subscribe(data => {
            if (data) {
              this.loading = false;
              this.notiTimestamp = data;
            }
          })
        }
      })
    })
  }

}
