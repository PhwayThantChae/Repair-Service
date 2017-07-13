import { Component, OnInit } from '@angular/core';
import { SpLoginServiceService } from '../../services/sp-login-service.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-sp-login',
  templateUrl: './sp-login.component.html',
  styleUrls: ['./sp-login.component.css']
})
export class SpLoginComponent implements OnInit {

  email:string;
  password : string;
  constructor(public login:SpLoginServiceService,public router: Router,public afAuth: AngularFireAuth,public spLoginService:SpLoginServiceService) {
    if(this.spLoginService.currentSp()){
      console.log("Service Provider Automatic Log out");
      this.spLoginService.spLogOut();
    }
  }

  ngOnInit() {
  }

  onSubmit(form:any){
    console.log("hey");
    console.log(form.email);
    this.login.spLogin(form.email,form.password);
   
    this.afAuth.authState.subscribe(auth=>{
        if(auth){
          this.router.navigate(['Sp_Homepage']);
        }
    });
  }

}
