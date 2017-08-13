import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/Rx';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
declare var $: any;

@Component({
  selector: 'app-user-homepage',
  templateUrl: './user-homepage.component.html',
  styleUrls: ['./user-homepage.component.css']
})
export class UserHomepageComponent implements OnInit {

  loginText: string;
  userUid: string;
  currentUser: any;
  exists: boolean;
  device: string;
  user:any;

  apID: string;
  time: string;
  date: string;
  state: string;
  spid: string;
  ap_device: string;

  appointments = [];
  loading : boolean;
  uid : string;
  appointmentList: FirebaseListObservable<any>;


  constructor(public loginService: LoginService, public router: Router, 
              public afAuth: AngularFireAuth, public db: AngularFireDatabase,
              public firebaseDatabase : FirebaseDatabaseService) {



  }

  ngOnInit() {

    $('.ui.selection.dropdown').dropdown();

    $('.column .image').dimmer({
      on: 'hover'
    });

    // $('.full-circle').each(function () {
    //   $(this).css('lineHeight', $(this).width() + 'px');
    // });

    $('.ui.accordion').accordion();

    
    this.appointments = [];
    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.user = x;
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
              if (y.uid == x.uid && y.state == 'completed') {
                
                //Check whether appointment can be cancelled or not
                var cancel = this.checkAppointmentCancel(y.time,y.date,y.state);

                //Check availability of the appointment within one week
                var dateParts = y.date.split('/');  // Appointment Date
                var d1 = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); 
                
                var lastdayParts = this.firebaseDatabase.getNextSevenDays();
                lastdayParts = lastdayParts[lastdayParts.length-1].split('/');
                var lastDay = new Date(Number(lastdayParts[2]),Number(lastdayParts[1])-1,Number(lastdayParts[0]));

                console.log("Last Day",lastDay);

                var d2 = new Date(Date.now());  // Current Date
                d2.setHours(0,0,0,0);
                var todayDate = Date.parse(d2.toLocaleDateString());
                var unavailable = (d1 >= d2 && d1 <= lastDay) ? "false" : "true";


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
                    if(data.unavailable == 'false'){
                      this.appointments.push(data);
                    }
                    
                    console.log(this.appointments, 'hey appoitm');
                  }
                });
                
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




  device_click(device) {

    this.router.navigate(['User_Search_Normal', { device: device}]);
  }



searchMobile(){
 
  var deviceDropdown = $('.ui.selection.dropdown').dropdown('get value');
  console.log("Device Dropdown",deviceDropdown);
  if (deviceDropdown == "" || deviceDropdown == undefined) {
      $('.device-modal').modal('show');
    }
    else {
      this.router.navigate(['User_Search_Normal', { device: deviceDropdown}]);
      
    }
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
    this.ap_device = device;
    this.uid = uid;

    $('.home-cancel-modal').modal({
            closable: false,
            onDeny: function () {
              return true;
            }
          }).modal('show');

}

  deleteConfirm(apID, time, date, state, spid, ap_device, uid) {

    console.log("Delete Confirmed");
    var timestamp = Date.now();

    this.appointments = [];
    this.firebaseDatabase.changeAppointmentStatus(apID, "cancel");
    this.firebaseDatabase.sendNotifications(apID, date, time, ap_device, spid, "cancel", uid, timestamp);
  }

}
