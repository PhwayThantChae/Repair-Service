import { Component, OnInit } from '@angular/core';
import { SpLoginServiceService } from '../../services/sp-login-service.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { SpFirebaseDatabaseService } from '../../services/sp-firebase-database.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-sp-approved-request',
  templateUrl: './sp-approved-request.component.html',
  styleUrls: ['./sp-approved-request.component.css']
})
export class SpApprovedRequestComponent implements OnInit {

  loading: boolean;
  userAppointments = [];
  uid:string;
  appointments:FirebaseListObservable<any[]>;

  constructor(public spLoginService: SpLoginServiceService, public spFirebaseDatabase: SpFirebaseDatabaseService,
              public afAuth: AngularFireAuth) {
                
    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.uid = x.uid;
        this.appointments = this.spFirebaseDatabase.getUserAppointments();
        this.appointments.map(y => 
          y.filter(y => {
            if(y.spid  == this.uid && y.state == "completed"){
              this.userAppointments.push(y);
            }
          })).subscribe(data => {
            if(data){
              this.loading = false;
              console.log(this.userAppointments);
            }
            else{
              this.loading = true;
            }
          })
      }
    });
  }

  ngOnInit() {
  }

}
