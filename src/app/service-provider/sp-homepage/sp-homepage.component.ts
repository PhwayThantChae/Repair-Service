import { Component, OnInit } from '@angular/core';
import { SpFirebaseDatabaseService } from '../../services/sp-firebase-database.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-sp-homepage',
  templateUrl: './sp-homepage.component.html',
  styleUrls: ['./sp-homepage.component.css']
})
export class SpHomepageComponent implements OnInit {

  date2 = [];
  date3 = [];
  date: FormControl;
  time: FormControl;
  spHome: FormGroup;
  appointments = [];
  day: string;
  loading: boolean;
  appointmentList: FirebaseListObservable<any[]>;
  constructor(public spFirebase: SpFirebaseDatabaseService, public afAuth: AngularFireAuth,
    public formbuilder: FormBuilder) {


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
            if (y.spid == x.uid && y.state == "completed" && y.date == this.date2[0]) {

              this.spFirebase.getUserInfo(y.uid).map(z => {
                if (z) {
                  let appointment = {
                    "emergency": y.emergency,
                    "imgurl": z["imageUrl"],
                    "username": z["username"],
                    "time": y.time,
                    "date": y.date,
                    "userPh": z["ph"],
                    "device": y.device,
                    "userAddress": z["address"],
                    "description": y.description,
                    "brand": y.brand,
                    "userEmail": z["email"]
                  }

                  return appointment;
                }
              }).subscribe(data => {
                if (data) {
                  this.appointments = [];
                  this.appointments.push(data);
                }
              });

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

    this.date = new FormControl('');
    this.time = new FormControl('');
    this.buildForm();
  }

  buildForm(): void {
    this.spHome = this.formbuilder.group({
      date: this.date,
      time: this.time
    });
  }

  onSubmit() {

    this.loading = true;
    this.appointments = [];
    if (this.time.value == "none" || this.time.value == "undefined") {
      this.time.setValue("");
    }
    if (this.date.value == "undefined") {
      this.date.setValue("");
    }
    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.appointmentList = this.spFirebase.getAppointmentsSPFiltered(x.uid);
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
            if (y.state == "completed" && y.date == this.date.value) {
              if (y.time !== "" && y.time == this.time.value) {

                this.spFirebase.getUserInfo(y.uid).map(z => {
                  if (z) {
                    let appointment = {
                      "emergency": y.emergency,
                      "imgurl": z["imageUrl"],
                      "username": z["username"],
                      "time": y.time,
                      "date": y.date,
                      "userPh": z["ph"],
                      "device": y.device,
                      "userAddress": z["address"],
                      "description": y.description,
                      "brand": y.brand,
                      "userEmail": z["email"]
                    }
                    // this.appointments.push(appointment);
                    return appointment;
                  }
                }).subscribe(data => {
                  if (data) {
                    this.appointments = [];
                    this.appointments.push(data);
                  }
                });
              }
              else {
                this.spFirebase.getUserInfo(y.uid).map(z => {
                  if (z) {
                    let appointment = {
                      "emergency": y.emergency,
                      "imgurl": z["imageUrl"],
                      "username": z["username"],
                      "time": y.time,
                      "date": y.date,
                      "userPh": z["ph"],
                      "device": y.device,
                      "userAddress": z["address"],
                      "description": y.description,
                      "brand": y.brand,
                      "userEmail": z["email"]
                    }
                    // this.appointments.push(appointment);

                    return appointment;
                  }
                }).subscribe(data => {
                  if (data) {
                    this.appointments = [];
                    this.appointments.push(data);
                    console.log("APODSS", this.appointments);
                  }
                });
              }
            }
          })
        }).subscribe(data => {
          if (data) {
            this.loading = false;
            console.log(this.appointments);
          }
          else {
            this.loading = false;
          }
        })
      }
    })
  }

  todayAppointments(today) {

    console.log("TODAY", today);

    this.loading = true;
    this.appointments = [];
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
            if (y.spid == x.uid && y.state == "completed" && y.date == this.date2[0]) {

              this.spFirebase.getUserInfo(y.uid).map(z => {
                if (z) {
                  let appointment = {
                    "emergency": y.emergency,
                    "imgurl": z["imageUrl"],
                    "username": z["username"],
                    "time": y.time,
                    "date": y.date,
                    "userPh": z["ph"],
                    "device": y.device,
                    "userAddress": z["address"],
                    "description": y.description,
                    "brand": y.brand,
                    "userEmail": z["email"]
                  }
                  // this.appointments.push(appointment);
                  return appointment;
                }
              }).subscribe(data => {
                if (data) {
                  this.appointments = [];
                  this.appointments.push(data);
                }
              });

              // this.appointments.push(y);
              // console.log(this.appointments);
              // if (this.appointments.length > 0) {
              //   this.loading = false;
              // }
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
