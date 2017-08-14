import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import * as firebase from 'firebase/app';

@Injectable()
export class FirebaseDatabaseService {

  items: FirebaseListObservable<any[]>;
  appointmentData: FirebaseListObservable<any[]>;
  readAppointmentData: FirebaseListObservable<any[]>;
  notiData: FirebaseListObservable<any[]>;
  allnotiData: FirebaseListObservable<any[]>;
  profileData: FirebaseObjectObservable<any>;
  sendNotificationData: FirebaseListObservable<any[]>;
  readSpInfo: FirebaseObjectObservable<any[]>;
  userNoti: FirebaseListObservable<any[]>;
  appointmentDetail: FirebaseObjectObservable<any>;
  notificationDetail: FirebaseObjectObservable<any>;
  appointmentByUid : FirebaseListObservable<any[]>;
  getTownshipData : FirebaseListObservable<any[]>;
  searchSubject: Subject<any>;
  searchSpData : FirebaseListObservable<any[]>;
  feedbackData : FirebaseListObservable<any[]>;
  getContactData : FirebaseListObservable<any[]>;
  profileInfo = [];

  constructor(public db: AngularFireDatabase, public loginService: LoginService, public router:Router) {

    this.searchSubject = new Subject();
    this.feedbackData = db.list('/feedbacks');
    this.appointmentData = db.list('/user-appointments');
    this.sendNotificationData = db.list('/sp-notifications');

  }

  writeUserData(userId, name, email, ph, address,township, imageUrl) {

    this.db.object('/users/' + userId).set({
      username: name,
      email: email,
      ph: ph,
      township : township,
      address: address,
      imageUrl: imageUrl
    }).then(snapshot => {
        this.router.navigate(['User_Homepage']);
      
    });
  }

  writeUserAppointmentData(uid, spid, device, address, description, brand, time, date, emergency, timestamp) {


    var appointment_data = {
      'uid': uid,
      'spid': spid,
      'device': device,
      'userAddress': address,
      'description': description,
      'brand': brand,
      'time': time,
      'date': date,
      'emergency': emergency,
      'state': 'pending',
      'timestamp': timestamp
    };

    this.appointmentData.push(appointment_data);
  }

  readUserAppointmentData(): FirebaseListObservable<any> {

    this.readAppointmentData = this.db.list('/user-appointments');
    return this.readAppointmentData;
  }

  getSpInfo(spid) {

    this.readSpInfo = this.db.object('/sp/' + spid);
    return this.readSpInfo;
  }


  updateUserProfile(ph, address,email,township, uid) {

    this.db.object('/users/' + uid).update({
      ph: ph,
      address: address,
      email : email,
      township : township
    });
  }

  changeAppointmentStatus(apID, state) {
    if (state == "cancel") {
      this.db.object('/user-appointments/' + apID).update({
        state: state
      });
    }
    else {
      this.db.object('/user-appointments/' + apID).update({
        state: state
      });
    }

  }

  deleteAppointment(apid){
    this.db.object('/user-appointments/' + apid).remove();
  }


  getUserProfile(uid): FirebaseObjectObservable<any> {

    this.profileData = this.db.object('/users/' + uid);
    this.profileData.subscribe(snapshot => {
      console.log("snapshot", snapshot);
    });

    return this.profileData;

  }

  getNotifications(): FirebaseListObservable<any[]> {

    this.notiData = this.db.list('/notifications', {
      query: {
        orderByChild: 'read',
        equalTo: false
        // limitToLast: 5
      }
    });

    return this.notiData;
  }

  getAllNotifications() {
    this.allnotiData = this.db.list('/notifications', {
      query: {
        orderByChild: 'timestamp'
      }
    });

    return this.allnotiData;
  }

  getUserNotification(uid) {
    this.userNoti = this.db.list('/notifications', {
      query: {
        orderByChild: 'uid',
        equalTo: uid
      }
    });

    return this.userNoti;
  }



  sendNotifications(apid, date, time, device, spid, state, uid, timestamp) {

    var noti = {
      'uid': uid,
      'spid': spid,
      'apid': apid,
      'time': time,
      'date': date,
      'device': device,
      'timestamp': timestamp,
      'state': state,
      'read': false
    };
    this.sendNotificationData.push(noti);

  }

  getCurrentDateTime(): string[] {
    var current = [];
    var currentDate = new Date();
    current.push(currentDate.toLocaleDateString(), currentDate.toLocaleTimeString());
    return current;
  }

  changeNotiStatus(id, condition) {

    this.db.object('/notifications/' + id).update({
      read: condition
    });

  }

  convert_Hours_To_NotiTime(hours) {

    var return_string;

    if (hours < 24) {  // less than one day
      if (hours < 1) {  // less than one hour
        var min = hours * 60;
        var sec = min * 60;
        if (sec < 60) {
          return_string = sec > 1 ? sec + " seconds ago" : sec + " second ago";
        }
        else {
          return_string = min > 1 ? min + " minutes ago" : min + " minute ago";
        }
      }
      else {
        return_string = hours > 1 ? hours + " hours ago" : hours + " hour ago";
      }
    }
    else {           // more than one day
      var day = Math.round(hours / 24);
      return_string = day > 1 ? day + " days ago" : day + " day ago";
    }
    return return_string;
  }

  getNotificationDetail(notiID) {

    this.notificationDetail = this.db.object('/notifications/' + notiID);
    return this.notificationDetail;

  }

  getAppointmentDetail(apid) {

    this.appointmentDetail = this.db.object('/user-appointments/' + apid);
    return this.appointmentDetail;

  }

  getAppointmentByUid(uid){

    this.appointmentByUid = this.db.list('/user-appointments',{
      query: {
        orderByChild: 'uid',
        equalTo: uid
      }
    });

    return this.appointmentByUid;
  }

  getTownship(){
    this.getTownshipData = this.db.list('/township',{
      query: {
        orderByChild : 'name'
      }
    });

    return this.getTownshipData;
  }

  SearchSpByTownship(township){

    this.searchSpData = this.db.list('/sp', {
      query: {
        orderByChild: 'township',
        equalTo: township
      }
    });
    // this.searchSubject.next(township);
    return this.searchSpData;

  }

  SearchSpByAllTownships(){
    this.searchSpData = this.db.list('/sp', {
      query: {
          orderByChild: 'township'
      }
        });
    return this.searchSpData;
  }

    getNextSevenDays(): string[] {
    var date2 = [];
    var d = new Date();
    var tmp = d.getDate() + '/' + (d.getMonth() + 1) + '/' + (d.getFullYear());
    date2.push(tmp);

    for (var i = 1; i <= 7; i++) {
      var currentDate = new Date();
      currentDate.setDate(d.getDate() + i);
      tmp = (currentDate.getDate()) + '/' + (currentDate.getMonth() + 1) + '/' + (currentDate.getFullYear());
      date2.push(tmp.toString());
    }

    return date2;
  }

  sendFeedback(subject,description,id){

      var feedback = {
        'subject' : subject,
        'description' : description,
        'id' : id
      }

      this.feedbackData.push(feedback);
  }

  getContact(){
    this.getContactData = this.db.list('/admin-contact');
    return this.getContactData;
  }


// addTownship(){
//   let township = 
//     {
//      "name": "Yankin",
//       "name_mm": "ရန်ကင်း",
//       "state_id": "Yangon"
//   }

// this.addTownshipData.push(township);

// }



}
