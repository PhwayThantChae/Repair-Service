import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as knayi from 'knayi-myscript';
declare var $:any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userprofileForm: FormGroup;
  ph: FormControl;
  old_ph: string;
  old_address: string;
  address: FormControl;
  uid: string;
  name: string;
  imgurl: string;
  email: FormControl;
  old_email: string;
  loading: boolean;
  townships = [];
  township : FormControl;
  userProfile: FirebaseObjectObservable<any>;
  appointmentList: FirebaseListObservable<any>;
  pastAppointments = [];
  townshipString : string;

  constructor(public loginService: LoginService, public firebaseDatabase: FirebaseDatabaseService,
    public afAuth: AngularFireAuth, public formbuilder: FormBuilder) {

    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.loading = true;
        this.uid = x.uid;

        this.firebaseDatabase.getTownship().map(x => {
          if(x){
            x.forEach(y => {
              let township = {
              'name' : y['name'],
              'name_mm' : y['name_mm'],
              'state_id' : y['state_id']
            }
              this.townships.push(township);
            })
          }
        }).subscribe(data => {
          if(data){
            this.townships = [];
            this.townships.push(data);
            console.log(this.townships,"township");
          }
        })

        this.userProfile = this.firebaseDatabase.getUserProfile(x.uid);
        this.userProfile.subscribe(snapshot => {
          if (snapshot) {
            this.loading = false;
            this.name = snapshot.username;
            this.ph.setValue(snapshot.ph);
            this.email.setValue(snapshot.email);
            this.old_email = snapshot.email;
            this.old_ph = snapshot.phS;
            this.imgurl = snapshot.imageUrl;
            this.address.setValue(snapshot.address);
            this.old_address = snapshot.address;
            this.townshipString = snapshot.township;
          }
          else {
            this.loading = true;
          }
        });

        this.appointmentList = this.firebaseDatabase.readUserAppointmentData();
        this.appointmentList.map(y => {
          this.firebaseDatabase.getAppointmentByUid(y.uid).$ref.on("child_added", snapshot => {

            if (snapshot) {
              this.pastAppointments = [];
            }
          });
          if (y) {
            this.loading = false;
            y.filter(y => {
              if (y.uid == x.uid) {
                
                var unavailable;

                if(y.state !== 'cancel'){

                  //Check availability of the appointment
                
                  var dateParts = y.date.split('/');
                  var d1 = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));

                  var d2 = new Date(Date.now());
                  d2.setHours(0,0,0,0);
                  var todayDate = Date.parse(d2.toLocaleDateString());
                  unavailable = (d1 >= d2) ? "false" : "true";

                }
                else{
                  unavailable = 'true';
                }
                


                this.firebaseDatabase.getSpInfo(y.spid).map(z => {

                  this.firebaseDatabase.getAppointmentByUid(y.uid).$ref.on("child_changed", snapshot => {
                    console.log("SNAPSHOT", snapshot.val());
                    if (snapshot) {
                      this.pastAppointments = [];
                    }
                  });



                  this.firebaseDatabase.getAppointmentByUid(y.uid).$ref.on("child_removed", snapshot => {
                    console.log("SNAPSHOT", snapshot.val());
                    if (snapshot) {
                      this.pastAppointments = [];
                    }
                  });


                  this.firebaseDatabase.getSpInfo(y.spid).$ref.on("child_changed", snapshot => {
                    console.log("SNAPSHOT", snapshot.val());
                    if (snapshot) {
                      this.pastAppointments = [];
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
                    console.log("Requested Service",requested_service);
                    return requested_service;
                  }
                }).subscribe(data => {
                  if (data) {
                    console.log(data,"pppppppppppppp");
                    if(data.unavailable == 'true'){
                       this.pastAppointments.push(data);
                    }
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
            this.pastAppointments = [];
          }
        });
      }
    });

  }

  ngOnInit() {

    $('.ui.dropdown').dropdown();

    this.ph = new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]|[၀−၉]*$')
    ]);

    this.address = new FormControl('', [
      Validators.required
    ]);

    this.email = new FormControl('', [
      Validators.email
    ]);

    this.township = new FormControl('');
    this.buildForm();
  }

  buildForm(): void {
    this.userprofileForm = this.formbuilder.group({
      ph: this.ph,
      address: this.address,
      email: this.email,
      township : this.township
    });
  }

  onSubmit() {

    if (this.ph.value !== this.old_ph || this.address.value !== this.old_address || this.email.value !== this.old_email
        || this.township.value !== this.townshipString) {
      if (knayi.fontDetect(this.ph.value) == "zawgyi") {
        this.ph.setValue(knayi.fontConvert(this.ph.value, 'unicode'));
      }
      if (knayi.fontDetect(this.address.value) == "zawgyi") {
        this.address.setValue(knayi.fontConvert(this.address.value, 'unicode'));
      }
      if (knayi.fontDetect(this.email.value) == "zawgyi") {
        this.ph.setValue(knayi.fontConvert(this.email.value, 'unicode'));
      }
      if (knayi.fontDetect(this.township.value) == "zawgyi") {
        this.township.setValue(knayi.fontConvert(this.township.value, 'unicode'));
      }
      this.firebaseDatabase.updateUserProfile(this.ph.value, this.address.value, this.email.value,this.township.value, this.uid);
    }

  }

  deleteAppointment(apid){
    this.firebaseDatabase.deleteAppointment(apid);
  }

  

}
