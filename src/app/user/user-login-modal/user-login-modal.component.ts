import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
import 'rxjs/Rx'; 
import 'rxjs/add/observable/fromPromise';
import * as firebase from 'firebase/app';
declare var $:any;

@Component({
  selector: 'app-user-login-modal',
  templateUrl: './user-login-modal.component.html',
  styleUrls: ['./user-login-modal.component.css']
})
export class UserLoginModalComponent implements OnInit {

 fbText:string;
 userCheck : Observable<any>;
 userUid:any;
 exists:boolean;

  constructor(private loginService:LoginService,private router:Router,private firebaseDatabase:FirebaseDatabaseService) { }

  ngOnInit() {

   
    this.fbText = "Log In with Facebook";

    
    // $('.ui.modal')
    //   .modal('setting', 'observeChanges', true);
  }

  //firebase.auth().onAuthStateChanged(firebaseUser => {});

    login(){
    
    //   //if(!this.loginService.currentUser()){
        this.loginService.login();
        $('.loginmodal')
        .modal('setting', 'observeChanges', true);
     
    }

    currentUser():boolean{

        //console.log(this.loginService.currentUser());
    
        return this.loginService.currentUser();
    }



  

    // routeNavigate(){
    //     $('.ui.modal').modal('hide');
    //     this.router.navigate(['home']);
    // }

 userRegister(ph:string,address:string){

    
    this.userUid = this.loginService.returnUser();
    this.firebaseDatabase.writeUserData(this.userUid.uid,this.userUid.displayName,this.userUid.email,ph,address,this.userUid.photoURL);
    $('.ui.modal').modal('hide');
    this.router.navigate(['User_Homepage']);

   

 }

  

}