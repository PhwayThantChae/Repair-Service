import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
declare var $:any;

@Component({
  selector: 'app-user-sp-profile',
  templateUrl: './user-sp-profile.component.html',
  styleUrls: ['./user-sp-profile.component.css']
})
export class UserSpProfileComponent implements OnInit {

  spID: string;
  sp: any;
 

  emailArray = [];
  phArray = [];
  hotlineArray = [];
  servicesArray = [];

  constructor(public route: ActivatedRoute, public afAuth: AngularFireAuth, public firebaseDatabase: FirebaseDatabaseService, public router: Router) { }

  ngOnInit() {



    this.route.params.subscribe(params => {
      this.spID = params['id'];

      // this.afAuth.authState.subscribe(x => {
      //   if (x) {
          this.firebaseDatabase.getSpInfo(this.spID).map(y => {
            if (y) {
              // this.emailArray = y['email'].split(',');
              if($.isArray(y['email'])){
                console.log(y['email'],"is array");
                this.emailArray = y['email'].toString().split(',');
              }
              else{
                console.log("it is not array");
                this.emailArray = y['email'].toString().split(',');
              }

              if($.isArray(y['ph'])){
                console.log(y['ph'],"is array");
                this.phArray = y['ph'].toString().split(',');
              }
              else{
                console.log("it is not array");
                this.phArray = y['ph'].toString().split(',');
              }
              if($.isArray(y['hotline'])){
                console.log(y['hotline'],"is array");
                this.hotlineArray = y['hotline'].toString().split(',');
              }
              else{
                console.log("it is not array");
                this.hotlineArray = y['hotline'].toString().split(',');
              }

               if($.isArray(y['services'])){
                console.log(y['services'],"is array");
                this.servicesArray = y['services'].toString().split(',');
              }
              else{
                console.log("it is not array");
                this.servicesArray = y['services'].toString().split(',');
              }
            
              let spObject = {
              "address": y["address"],
              "branch": y["branch"],
              "company": y["company"],
              "email": this.emailArray.join(', '),
              "emergency": y["emergency"],
              "hotline": this.hotlineArray.join(', '),
              "logo": y["logo"],
              "ph": this.phArray.join(', '),
              "services": this.servicesArray,
              "township": y["township"]
            }
            return spObject;
            }
            
          }).subscribe(data => {
            if (data) {
              this.sp = data;
            }
          });
      //   }
      // });
    });
  }



}
