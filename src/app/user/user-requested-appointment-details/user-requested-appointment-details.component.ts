import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
declare var $:any;

@Component({
  selector: 'app-user-requested-appointment-details',
  templateUrl: './user-requested-appointment-details.component.html',
  styleUrls: ['./user-requested-appointment-details.component.css']
})
export class UserRequestedAppointmentDetailsComponent implements OnInit {

  apID: string;
  loading: boolean;
  notiTimestamp: string;
  appointment: any;
  ap: any;
  emailArray = [];
  phArray = [];
  hotlineArray = [];
  servicesArray = [];

  constructor(public route: ActivatedRoute, public afAuth: AngularFireAuth, public firebaseDatabase: FirebaseDatabaseService, public router: Router) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.apID = params["id"];

      this.afAuth.authState.subscribe(x => {
        if (x) {
          this.firebaseDatabase.getAppointmentDetail(this.apID).map(y => {
            if (y) {
              console.log(y,"Appointment");
              this.firebaseDatabase.getSpInfo(y.spid).map(sp => {
                console.log(sp,"SP");
                if(sp){
                  if ($.isArray(sp['email'])) {
                    this.emailArray = sp['email'].toString().split(',');
                  }
                  else {
                    this.emailArray = sp['email'].toString().split(',');
                  }

                  if ($.isArray(sp['ph'])) {
                    this.phArray = sp['ph'].toString().split(',');
                  }
                  else {
                    this.phArray = sp['ph'].toString().split(',');
                  }

                  if ($.isArray(sp['hotline'])) {
                    this.hotlineArray = sp['hotline'].toString().split(',');
                  }
                  else {
                    this.hotlineArray = sp['hotline'].toString().split(',');
                  }

                  if ($.isArray(sp['services'])) {
                    this.servicesArray = sp['services'].toString().split(',');
                  }
                  else {
                    this.servicesArray = sp['hotline'].toString().split(',');
                  }

                  if (sp) {

                    let apObject = {
                      "branch": sp["branch"],
                      "company": sp["company"],
                      "hotline": this.hotlineArray.join(', '),
                      "ph": this.phArray.join(', '),
                      "spimg": sp["logo"],
                      "address": sp["address"],
                      "email": this.emailArray.join(', '),
                      "services": this.servicesArray.join(', '),
                      "date": y["date"],
                      "emergency": y["emergency"],
                      "time": y["time"],
                      "brand": y["brand"],
                      "description": y["description"],
                      "device": y["device"],
                      "state": y["state"],
                      "apTimestamp": new Date(y["timestamp"]).toLocaleDateString(),
                      "userAddress": y["userAddress"]
                    }
                    return apObject;
                  }
              }
              }).subscribe(apData => {
                if (apData) {
                  this.ap = apData;
                }
              });

        
            }
          }).subscribe(apData => {
         
          });
        }
      });
    })
  }

}
