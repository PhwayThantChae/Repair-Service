import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as knayi from 'knayi-myscript';

declare var $: any;

@Component({
  selector: 'app-user-get-appointment',
  templateUrl: './user-get-appointment.component.html',
  styleUrls: ['./user-get-appointment.component.css']
})
export class UserGetAppointmentComponent implements OnInit {

  @Input() spinfo;
  user:any;
  
  date2 = [];
  date_tmp: Date;
  uid: string;
  imgurl : string;

  date : FormControl;
  time : FormControl;
  spForm: FormGroup;
  address: FormControl;
  brand: FormControl;
  description : FormControl;

  userProfile: FirebaseObjectObservable<any>;


  constructor(public loginService: LoginService, public firebaseDatabase: FirebaseDatabaseService,
              public afAuth: AngularFireAuth,public formbuilder : FormBuilder) {

    
    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.user = x;
        this.uid = x.uid;
        this.userProfile = this.firebaseDatabase.getUserProfile(x.uid);
        this.userProfile.subscribe(snapshot => {
          if(snapshot){
           
            this.address.setValue(snapshot.address);
            // this.name.setValue(snapshot.username);
            // this.imgurl = snapshot.imageUrl;
            // if(snapshot.email){
            //   this.email.setValue(snapshot.email);
            // }
            // else{
            //   this.email.setValue("");
            // }
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
      console.log(currentDate,"currentDate");
      tmp = (currentDate.getDate()) + '/' + (currentDate.getMonth() + 1) + '/' + (currentDate.getFullYear());
      this.date2.push(tmp.toString());
    }

    console.log(this.date2);

  }

  ngOnInit() {
    $(".ui.dropdown").dropdown();

    this.address = new FormControl('',[
      Validators.required,
      Validators.minLength(5)
    ]);

    this.time = new FormControl('',[
      Validators.required
    ]);

    this.date = new FormControl('',[
      Validators.required
    ]);

    this.description = new FormControl('');
    this.brand = new FormControl('');

    this.buildForm();
  }

  buildForm():void{
    this.spForm = this.formbuilder.group({
      address : this.address,
      description : this.description,
      time : this.time,
      date : this.date,
      brand : this.brand
    });
  }

 

  onSubmit() {
    
    if (this.brand.value == null || this.brand.value == "") {
      this.brand.setValue("");
    }
    else{
      if(knayi.fontDetect(this.brand.value) == "zawgyi"){
        this.brand.setValue(knayi.fontConvert(this.brand.value, 'unicode'));
      }
      
    }
    if (this.description.value == null || this.description.value == "") {
      this.description.setValue("");
    }
    else{
      if(knayi.fontDetect(this.description.value) == "zawgyi"){
        this.description.setValue(knayi.fontConvert(this.description.value, 'unicode'));
      }
      
    }
   
    var timestamp = Date.now();
    this.firebaseDatabase.writeUserAppointmentData(this.uid, this.spinfo[2], this.spinfo[0],knayi.fontConvert(this.address.value, 'unicode'), 
        this.description.value,  this.brand.value,
        this.time.value, this.date.value, this.spinfo[1],timestamp);
    
    // var modal_id = this.spinfo[2] + this.spinfo[3];
    $('.ui.modal').modal('hide');
    
  }

}
