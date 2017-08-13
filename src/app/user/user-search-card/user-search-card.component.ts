import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserGetAppointmentComponent } from '../user-get-appointment/user-get-appointment.component';
declare var $: any;


@Component({
  selector: 'app-user-search-card',
  templateUrl: './user-search-card.component.html',
  styleUrls: ['./user-search-card.component.css']
})
export class UserSearchCardComponent implements OnInit {

  @Input() result: any[];
  spinfo = [];
  device: string;
  emergency: string;
  constructor(public route: ActivatedRoute, public loginService: LoginService, public afAuth: AngularFireAuth,
              public userGetAppointment : UserGetAppointmentComponent ) {

    route.params.subscribe(params => {
      this.device = params.device;
      this.emergency = "no";
    });
  }

  ngOnInit() {

  }

  getAppointment(key) {

    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.spinfo = [];
        this.spinfo.push(this.device);
        this.spinfo.push(this.emergency);
        this.spinfo.push(key);
        // this.spinfo.push(branch);
        // this.spinfo.push(name);
        // this.spinfo.push(logo);

        console.log("Showing Modal " + this.spinfo);
         
      }
    });
    
    if(!this.afAuth.auth.currentUser){
      var login_modal_id = key+"_login";
      $('.not-login-modal').attr('id',login_modal_id);
      $('#'+login_modal_id).modal('show');
    }

    if(this.afAuth.auth.currentUser){
       var modal_id = key;
        $('.appointment-modal').attr('id', modal_id);
        $('#'+modal_id)
          .modal('setting', 'transition', "scale")
          .modal('show');
    }



    // if(this.loginService.isAuthenticated()){
    //   this.spinfo.push(this.device);
    //   this.spinfo.push(key);
    //   this.spinfo.push(this.emergency);
    //   this.spinfo.push(name);
    //   this.spinfo.push(branch);

    //   console.log("Showing Modal "+this.spinfo);
    //   $('.appointment-modal')
    //       .modal('setting', 'closable', false)
    //       .modal('setting', 'transition', "scale")
    //       .modal('show');
    // }
    // else{
    //   console.log("Please log in to book the appointment.");
    //   $('.not-login-modal').modal('show');
    // }

  }

  closeModal(){
    $('.ui.modal').modal('hide');
  }

}
