import { Component, OnInit } from '@angular/core';
import { SpLoginServiceService } from '../../services/sp-login-service.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-sp-login',
  templateUrl: './sp-login.component.html',
  styleUrls: ['./sp-login.component.css']
})
export class SpLoginComponent implements OnInit {

  email:FormControl;
  password : FormControl;
  spLogInForm : FormGroup;

  constructor(public login:SpLoginServiceService,public router: Router,public afAuth: AngularFireAuth,
              public spLoginService:SpLoginServiceService,public formbuilder : FormBuilder) {
    if(this.spLoginService.currentSp()){
      console.log("Service Provider Automatic Log out");
      this.spLoginService.spLogOut();
    }
  }

  ngOnInit() {
     
    this.email = new FormControl('',[
      Validators.required,
      Validators.email
    ]);

    this.password = new FormControl('',[
      Validators.required
    ]);
    this.buildForm();
  }

  buildForm():void{

    this.spLogInForm = this.formbuilder.group({
      email : this.email,
      password : this.password
    });
  }

  onSubmit(){
    
    this.login.spLogin(this.email.value,this.password.value);
  
  }

}
