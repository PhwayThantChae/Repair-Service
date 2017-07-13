import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
//import { AngularFireDatabaseModule } from 'angularfire2/database';
import 'rxjs/Rx';
import 'rxjs/add/observable/fromPromise';
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
 

  constructor(private loginService: LoginService, public router: Router,public afAuth: AngularFireAuth,public db: AngularFireDatabase) { 
   
   
   
  }

  ngOnInit() {


    $('.full-circle').each(function() {
        $(this).css('lineHeight', $(this).width() + 'px');
      });

    $('.ui.accordion')
      .accordion();

    $('.column .image').dimmer({
            on: 'click'
      });


    //  $('.column .image').click(function(){

       
    //    if ( $( this ).hasClass( "generator" ) ) {
    //      this.setDevice("generator");
    //      console.log(this.device);
    //     $('.column .image').contents(':not(generator)').dimmer('is dimmable',false);
    //    }
    //    if ( $( this ).hasClass( "regulator" ) ) {
    //      this.device = "regulator";
    //      console.log(this.device);
    //     // $('.column .image').contents(':not(.generator)').dimmer('set disabled');
    //    }
    //    if ( $( this ).hasClass( "refrigerator" ) ) {
    //      this.device = "refrigerator";
    //      console.log(this.device);
    //     // $('.column .image').contents(':not(.generator)').dimmer('set disabled');
    //    }
    //    if ( $( this ).hasClass( "washing-machine" ) ) {
    //      this.device = "washing-machine";
    //      console.log(this.device);
    //     // $('.column .image').contents(':not(.generator)').dimmer('set disabled');
    //    }
    //    if ( $( this ).hasClass( "air-conditioner" ) ) {
    //      this.device = "air-conditioner";
    //      console.log(this.device);
    //     // $('.column .image').contents(':not(.generator)').dimmer('set disabled');
    //    }
    //   if ( $( this ).hasClass( "water-motor" ) ) {
    //      this.device = "water-motor";
    //      console.log(this.device);
    //   }
        
    // });
  

  }

  

 
  device_click(device){

    
    if(device == "air-conditioner"){
      this.device = "air-conditioner";
    }
    else if(device == "regulator"){
      this.device = "regulator";
    }
    else if(device == "washing-machine"){
      this.device = "washing-machine";
    }
    else if(device == "water-motor"){
      this.device = "water-motor";
    }
    else if(device =="refrigerator"){
      this.device = "refrigerator";
    }
    else{
      this.device = "generator";
    }
  }

   

 

  search(ans){
    
    if(this.device == null){
        $('.device-modal').modal('show');
    }
    else{
      console.log(ans);
      this.router.navigate(['User_Search_Normal',{device:this.device,emergency:ans}]);
    }
    
  }

}
