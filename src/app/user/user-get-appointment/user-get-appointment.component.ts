import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
import { AngularFireAuth } from 'angularfire2/auth';

declare var $: any;

@Component({
  selector: 'app-user-get-appointment',
  templateUrl: './user-get-appointment.component.html',
  styleUrls: ['./user-get-appointment.component.css']
})
export class UserGetAppointmentComponent implements OnInit {

  @Input() spinfo;
  user:any;
  time = ["9am - 12pm", "12pm - 3pm", "3pm - 6pm"];
  date2 = [];
  date_tmp: Date;
  name: string;
  uid: string;
  address: string;
  email: string;
  ph: string;
  imgurl : string;
  userProfile: FirebaseObjectObservable<any>;


  constructor(public loginService: LoginService, public firebaseDatabase: FirebaseDatabaseService,
              public afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.user = x;
        this.uid = x.uid;
        this.userProfile = this.firebaseDatabase.getUserProfile(x.uid);
        this.userProfile.subscribe(snapshot => {
          if(snapshot){
            this.ph = snapshot.ph;
            this.address = snapshot.address;
            this.name = snapshot.username;
            this.imgurl = snapshot.imageUrl;
            if(snapshot.email){
              this.email = snapshot.email;
            }
            else{
              this.email = "";
            }
          }
        })
      }
      else{
      console.log("not authenticated");
    }
    });

    var d = new Date();
    var tmp = d.getDate() + '/' + (d.getMonth() + 1) + '/' + (d.getFullYear());
    this.date2.push(tmp);

    for (var i = 1; i <= 7; i++) {
      var currentDate = new Date();
      currentDate.setDate(d.getDate() + i);
      tmp = (currentDate.getDate()) + '/' + (d.getMonth() + 1) + '/' + (d.getFullYear());
      this.date2.push(tmp.toString());
    }

  }

  ngOnInit() {
    $(".ui.dropdown").dropdown();
  }

 

  onSubmit(form) {

    console.log("on submit form " + this.spinfo);
    console.log(form);
    if (form.brand == null) {
      form.brand = "";
    }
    if (form.description == null) {
      form.description = "";
    }
    if (form.email == null) {
      form.email = "";
    }
    this.firebaseDatabase.writeUserAppointmentData(this.uid, this.spinfo[2], this.spinfo[0], form.email,
      form.ph, form.address, form.description, form.brand, form.time, form.date, this.spinfo[1], this.spinfo[4], this.spinfo[3],
      this.name,this.imgurl,this.spinfo[5]);
    
    var modal_id = this.spinfo[2] + this.spinfo[3];
    $('#'+modal_id).modal('hide');
    
  }

}
