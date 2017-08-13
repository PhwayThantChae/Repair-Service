import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as knayi from 'knayi-myscript';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css']
})
export class UserNewComponent implements OnInit {

  fbText: string;
  userCheck: Observable<any>;
  userUid: any;
  exists: boolean;
  phone : FormControl;
  address : FormControl;
  newUserForm : FormGroup;


  constructor(private loginService: LoginService, private router: Router, private firebaseDatabase: FirebaseDatabaseService
                  ,public formbuilder : FormBuilder,public afAuth: AngularFireAuth) { }

  ngOnInit() {

    this.phone = new FormControl('',[
      Validators.required,
      Validators.pattern('^[0-9]*$')
    ]);

    this.address = new FormControl('',[
      Validators.required,
      Validators.minLength(5)
    ]);
    this.buildForm();
  }

  buildForm():void{
    this.newUserForm = this.formbuilder.group({
      phone : this.phone,
      address : this.address
    }); 
  }

  onSubmit() {

    
    if(knayi.fontDetect(this.phone.value) == "zawgyi"){
      this.phone.setValue(knayi.fontConvert(this.phone.value,'unicode'));
    }

    if(knayi.fontDetect(this.address.value) == "zawgyi"){
      this.address.setValue(knayi.fontConvert(this.address.value,'unicode'));
    }

    
    this.userUid = this.afAuth.auth.currentUser;
    console.log(this.userUid.uid);
    this.firebaseDatabase.writeUserData(this.userUid.uid, this.userUid.displayName, this.userUid.email, this.phone.value, this.address.value, this.userUid.photoURL);
   
  }


}
