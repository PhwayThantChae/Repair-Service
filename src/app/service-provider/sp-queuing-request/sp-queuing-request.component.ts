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
  device:string;
  appointments: FirebaseListObservable<any[]>;
  dateArray = [];

  constructor(public spLoginService: SpLoginServiceService, public spFirebaseDatabase: SpFirebaseDatabaseService,
    public afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.dateArray = this.spFirebaseDatabase.getNextSevenDays();
        this.uid = x.uid;
        this.appointments = this.spFirebaseDatabase.getUserAppointments();
        this.appointments.map(y =>
          y.filter(y => {
            if (y.spid == this.uid && (y.state == "pending" || y.state == "rescheduled")) {
              this.userAppointments.push(y);
            }
          })).subscribe(data => {
            if (data) {
              this.loading = false;
              console.log(this.userAppointments);
            }
            else {
              this.loading = true;
            }
          })
      }
    });

  }

  ngOnInit() {
    $(".ui.dropdown").dropdown();
  }

  appointmentAction(apID, userid, spid, company, branch, date, time,device,spimg,action) {
    this.apID = apID;
    this.userID = userid;
    this.spID = spid;
    this.company = company;
    this.branch = branch;
    this.date = date;
    this.time = time;
    this.device = device;
    this.spimg = spimg;

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
    var currentData = [];
    currentData = this.spFirebaseDatabase.getCurrentDateTime();
    var currentTimestamp = Date.now();
    this.spFirebaseDatabase.sendNotification(this.apID, this.userID, this.spID, this.company, this.branch,
      this.time, this.date, currentData[0], currentData[1],currentTimestamp,this.device,this.spimg,state);
  }

}
