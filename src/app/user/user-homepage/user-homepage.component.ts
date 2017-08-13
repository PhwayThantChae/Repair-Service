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
                      'unavailable': unavailable
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



    // $('.generator').click(function () {
    //   if ($(this).hasClass("generator")) {

    //     $('.dimmerRegulator').dimmer('hide');
    //     $('.dimmerWashingMachine').dimmer('hide');
    //     $('.dimmerAirConditioner').dimmer('hide');
    //     $('.dimmerRefrigerator').dimmer('hide');
    //     $('.dimmerWaterMotor').dimmer('hide');
    //     this.device = "generator";
    //     console.log(this.device);
    //   }
    // });

    // $('.regulator').click(function () {
    //   if ($(this).hasClass("regulator")) {

    //     $('.dimmerGenerator').dimmer('hide');
    //     $('.dimmerWashingMachine').dimmer('hide');
    //     $('.dimmerAirConditioner').dimmer('hide');
    //     $('.dimmerRefrigerator').dimmer('hide');
    //     $('.dimmerWaterMotor').dimmer('hide');
    //     this.device = "regulator";
    //     console.log(this.device);
    //   }
    // });

    // $('.refrigerator').click(function () {
    //   if ($(this).hasClass("refrigerator")) {

    //     $('.dimmerRegulator').dimmer('hide');
    //     $('.dimmerWashingMachine').dimmer('hide');
    //     $('.dimmerAirConditioner').dimmer('hide');
    //     $('.dimmerGenerator').dimmer('hide');
    //     $('.dimmerWaterMotor').dimmer('hide');
    //     this.device = "refrigerator";
    //     console.log(this.device);
    //   }
    // });

    // $('.washing-machine').click(function () {
    //   if ($(this).hasClass("washing-machine")) {

    //     $('.dimmerRegulator').dimmer('hide');
    //     $('.dimmerGenerator').dimmer('hide');
    //     $('.dimmerAirConditioner').dimmer('hide');
    //     $('.dimmerRefrigerator').dimmer('hide');
    //     $('.dimmerWaterMotor').dimmer('hide');
    //     this.device = "washing-machine";
    //     console.log(this.device);
    //   }
    // });

    // $('.air-conditioner').click(function () {
    //   if ($(this).hasClass("air-conditioner")) {

    //     $('.dimmerRegulator').dimmer('hide');
    //     $('.dimmerWashingMachine').dimmer('hide');
    //     $('.dimmerGenerator').dimmer('hide');
    //     $('.dimmerRefrigerator').dimmer('hide');
    //     $('.dimmerWaterMotor').dimmer('hide');
    //     this.device = "air-conditioner";
    //     console.log(this.device);
    //   }
    // });

    // $('.water-motor').click(function () {
    //   if ($(this).hasClass("water-motor")) {

    //     $('.dimmerRegulator').dimmer('hide');
    //     $('.dimmerWashingMachine').dimmer('hide');
    //     $('.dimmerAirConditioner').dimmer('hide');
    //     $('.dimmerRefrigerator').dimmer('hide');
    //     $('.dimmerGenerator').dimmer('hide');
    //     this.device = "water-motor";
    //     console.log(this.device);
    //   }
    // });


  }




  device_click(device) {

    this.router.navigate(['User_Search_Normal', { device: device}]);
  }





  // search() {

  //   if (this.device == "" || this.device == undefined) {
  //     $('.device-modal').modal('show');
  //   }
  //   else {
  //       this.router.navigate(['User_Search_Normal', { device: this.device}]);
        //  this.router.navigate(['User_Search_Normal', { device: this.device, emergency: ans }]);
  //   }

  // }

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

}
