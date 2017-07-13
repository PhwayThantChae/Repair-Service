import { Component, OnInit } from '@angular/core';
import { SpFirebaseDatabaseService } from '../../services/sp-firebase-database.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
declare var $: any;

@Component({
  selector: 'app-sp-homepage',
  templateUrl: './sp-homepage.component.html',
  styleUrls: ['./sp-homepage.component.css']
})
export class SpHomepageComponent implements OnInit {

  date2 = [];
  date3 = [];
  date: string;
  time: string;
  appointments = [];
  day: string;
  loading: boolean;
  appointmentList: FirebaseListObservable<any[]>
  constructor(public spFirebase: SpFirebaseDatabaseService, public afAuth: AngularFireAuth) {


  }

  ngOnInit() {

    $(".ui.dropdown").dropdown();

    this.date2 = this.spFirebase.getNextSevenDays();
    this.date3 = this.spFirebase.getNextSevenDays().slice(1, this.date2.length);
    this.day = this.spFirebase.getWeekDay();
    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.loading = true;
        console.log(x.uid);
        this.appointmentList = this.spFirebase.getAppointmentsSPHome();
        this.appointmentList.map(y => {
          y.filter(y => {
            console.log(y.imgurl);
            if (y.spid == x.uid && y.state == "completed" && y.date == this.date2[0]) {
              this.appointments.push(y);
              console.log(this.appointments);
              if (this.appointments.length > 0) {
                this.loading = false;
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

  onSubmit(form) {
    console.log(form.date);
    console.log(form.time);
    this.loading = true;
    this.appointments = [];
    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.appointmentList = this.spFirebase.getAppointmentsSPFiltered(x.uid);
        this.appointmentList.map(y => {
          y.filter(y => {
            if (y.state == "completed" && y.time == form.time && y.date == form.date) {
              this.appointments.push(y);
              console.log(this.appointments);
            }
          })
        }).subscribe(data => {
          if (data) {
            this.loading = false;
            console.log(data);
          }
          else {
            this.loading = false;
            console.log("no data");
          }
        })
      }
    })
  }

  todayAppointments(today) {

    console.log("TODAY",today);

    this.loading = true;
    this.appointments = [];
    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.loading = true;
        this.appointmentList = this.spFirebase.getAppointmentsSPHome();
        this.appointmentList.map(y => {
          y.filter(y => {
            if (y.spid == x.uid && y.state == "completed" && y.date == this.date2[0]) {
              this.appointments.push(y);
              console.log(this.appointments);
              if (this.appointments.length > 0) {
                this.loading = false;
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

}
