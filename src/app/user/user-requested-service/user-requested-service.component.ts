import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
declare var $:any;

@Component({
  selector: 'app-user-requested-service',
  templateUrl: './user-requested-service.component.html',
  styleUrls: ['./user-requested-service.component.css']
})
export class UserRequestedServiceComponent implements OnInit {

  uid:string;
  appointments = [];
  appointmentList:FirebaseListObservable<any>;
  loading : boolean;

  apID : string;
  time : string;
  date : string;
  state : string;
  spid : string;
  device : string;
  username : string;
  imgurl: string;
  
  constructor(public loginService:LoginService,public firebaseDatabase:FirebaseDatabaseService,
              public afAuth: AngularFireAuth) { 

    this.appointments = [];
    this.afAuth.authState.subscribe(x => {
      if(x){
        this.uid = x.uid;
        this.appointmentList = this.firebaseDatabase.readUserAppointmentData();
        this.appointmentList.map(y => 
            y.filter(y => {
              if(y.uid == x.uid){
                this.appointments.push(y);
              }
            })).subscribe(data => {
              if(data){
                this.loading = false;
              }
              else{
                this.loading = true;
              }
            });
      }
    });
  
  
  }

  ngOnInit() {
    // this.appointments = [];
  }

  
  cancelAppointment(apID,time,date,state,spid,device,username,uid,imgurl){
    
    // this.appointments = [];
    this.apID = apID;
    this.time = time;
    this.date = date;
    this.state = state;
    this.spid = spid;
    this.device = device;
    this.username = username;
    this.uid = uid;
    this.imgurl = imgurl;

    var current = this.firebaseDatabase.getCurrentDateTime();
    var timestamp = Date.now();
    if(state == "completed"){
      var appointedtime = time.substring(0,2);
      var parts = date.split('/');
      var currentDate = new Date();
      var hoursleft = 0;
      var diff = 0;
    
      if(parts[0]>=currentDate.getUTCDate()){
          diff = parts[0] - currentDate.getUTCDate();
          if(diff==1){
            if(appointedtime == 9){
              hoursleft = (24 - currentDate.getHours())+9;
              console.log("Hours Left"+ hoursleft);
            }
            if(appointedtime == 12){
              hoursleft = (24 - currentDate.getHours())+12;
              console.log("Hours Left"+ hoursleft);
            }
            if(appointedtime == 9){
              hoursleft = (24 - currentDate.getHours())+15;
              console.log("Hours Left"+ hoursleft);
            }
              
          }
      }
      
      switch(diff){
        
        case 0 : console.log("Show Dialog"); 
                  $('.cancel-modal').modal({
                        closable  : false,
                        onDeny    : function(){
                          return true;
                        }
                      }).modal('show');break;

        case 1 : if(hoursleft>=24){
                    this.appointments = [];
                    this.firebaseDatabase.changeAppointmentStatus(apID,"cancel");
                    this.firebaseDatabase.sendNotifications(apID,date,time,device,spid,"cancel",username,uid,current[0],
                                              current[1],timestamp,imgurl);
                  } 
                  else{
                    $('.cancel-modal').modal({
                        closable  : false,
                        onDeny    : function(){
                          return false;
                        }
                      }).modal('show');
                  }break;

        default: this.appointments = [];
                 this.firebaseDatabase.changeAppointmentStatus(apID,"cancel");
                 this.firebaseDatabase.sendNotifications(apID,date,time,device,spid,"cancel",username,uid,current[0],
                                                        current[1],timestamp,imgurl);
        
      }
    }
    else{
      console.log("You can cancel for pending state.");
      this.appointments= [];
      this.firebaseDatabase.changeAppointmentStatus(apID,"cancel");
      
    }
  }


  
  rescheduledAppointment(apid,date,time,device,spid,state,username,uid,imgurl,action){
 
    var current = this.firebaseDatabase.getCurrentDateTime();
    var timestamp = Date.now();
    this.appointments = [];
    if(action == "accept"){
      this.firebaseDatabase.changeAppointmentStatus(apid,"completed");
      this.firebaseDatabase.sendNotifications(apid,date,time,device,spid,"completed",username,uid,current[0],
                                              current[1],timestamp,imgurl);
    }
    else{
      this.firebaseDatabase.changeAppointmentStatus(apid,"cancel");
      this.firebaseDatabase.sendNotifications(apid,date,time,device,spid,"cancel",username,uid,current[0],
                                              current[1],timestamp,imgurl);
    }
  }

  deleteConfirm(apID,time,date,state,spid,device,username,uid,imgurl){
    console.log("Delete Confirmed");
    var current = this.firebaseDatabase.getCurrentDateTime();
    var timestamp = Date.now();

    this.appointments = [];
    this.firebaseDatabase.changeAppointmentStatus(apID,"cancel");
    this.firebaseDatabase.sendNotifications(apID,date,time,device,spid,"cancel",username,uid,current[0],
                                              current[1],timestamp,imgurl);
  }

}
