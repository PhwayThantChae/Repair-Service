import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { SpFirebaseDatabaseService } from '../../services/sp-firebase-database.service';

@Component({
  selector: 'app-sp-appointment-detail',
  templateUrl: './sp-appointment-detail.component.html',
  styleUrls: ['./sp-appointment-detail.component.css']
})
export class SpAppointmentDetailComponent implements OnInit {

  apID : string;
  appointment : any;
  loading : boolean;

  constructor(public spFirebase: SpFirebaseDatabaseService, public afAuth: AngularFireAuth,public route:ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params){
        this.apID = params['id'];
      }
      this.loading = true;

      this.afAuth.authState.subscribe(x => {
        if(x){
          this.spFirebase.getAppointmentDetail(this.apID).map(y => {

            if(y){
            this.spFirebase.getUserInfo(y.uid).map(z => {
              if(z){
                let apObject = {
                  "date": y["date"],
                  "emergency": y["emergency"],
                  "time": y["time"],
                  "brand": y["brand"],
                  "description": y["description"],
                  "device": y["device"],
                  "state": y["state"],
                  "apTimestamp": new Date(y["timestamp"]).toLocaleDateString(),
                  "userAddress": y["userAddress"],
                  "email": z["email"],
                  "ph": z["ph"],
                  "username": z["username"],
                  "userimg": z["imageUrl"],
                }
              return apObject;
              }
              
            }).subscribe(data => {
              if(data){
                this.loading = false;
                this.appointment = data;
              }
            })
          }
          }).subscribe(data => {
            if(data){
              this.loading = false;
            }
          })
        }
      })
    })
  }

}
