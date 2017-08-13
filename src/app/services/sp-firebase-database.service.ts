import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class SpFirebaseDatabaseService {

  spData: FirebaseListObservable<any[]>;
  searchSubject: Subject<any>;
  notificationData: FirebaseListObservable<any[]>;
  spNavbar: FirebaseObjectObservable<any>;
  spQueuingAppointments: FirebaseListObservable<any[]>;
  notiData: FirebaseListObservable<any[]>;
  allnotiData: FirebaseListObservable<any[]>;
  appointmentData: FirebaseListObservable<any[]>;
  userInfo : FirebaseObjectObservable<any[]>;
  spNoti : FirebaseListObservable<any[]>;
  notificationDetail : FirebaseObjectObservable<any>;
  appointmentDetail : FirebaseObjectObservable<any>;
  notiIdDetail : FirebaseObjectObservable<any>;
  appointmentSpid : FirebaseListObservable<any[]>;


  constructor(public db: AngularFireDatabase, public firebaseApp: FirebaseApp) {

    this.notificationData = db.list('/notifications');
    this.searchSubject = new Subject();
    this.appointmentData = this.db.list('/user-appointments', {
      query: {
        orderByChild: 'spid',
        equalTo: this.searchSubject
      }
    });

  }

  getUserInfo(uid){

    this.userInfo = this.db.object('/users/'+uid);
    return this.userInfo;
  }



  getNavbarData(uid): FirebaseObjectObservable<any> {

    this.spNavbar = this.db.object('/sp/' + uid);
    return this.spNavbar;

  }

  getUserAppointments(): FirebaseListObservable<any[]> {

    this.spQueuingAppointments = this.db.list('/user-appointments');
    return this.spQueuingAppointments;

  }

  changeAppointmentStatus(apID, state) {
    if (state == "cancel") {
      this.db.object('/user-appointments/' + apID).remove();
    }
    else {
      this.db.object('/user-appointments/' + apID).update({
        state: state
      });
    }

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

  // getCurrentDateTime(): string[] {
  //   var current = [];
  //   var currentDate = new Date();
  //   current.push(currentDate.toLocaleDateString(), currentDate.toLocaleTimeString());
  //   return current;
  // }

  rescheduleAppointment(apID, date, time, state) {
    this.db.object('/user-appointments/' + apID).update({
      date: date,
      time: time,
      state: state
    });
  }

  sendNotification(apID, uID, spID, time, date,currentTimeStamp, device, state) {

    var noti = {
      'uid': uID,
      'spid': spID,
      'apid': apID,
      'time': time,
      'date': date,
      'device': device,
      'timestamp': currentTimeStamp,
      'state': state,
      'read': false
    };
    this.notificationData.push(noti);
  }

  getSpUnreadNotifications(): FirebaseListObservable<any[]> {

    this.notiData = this.db.list('/sp-notifications', {
      query: {
         orderByChild: 'read',
         equalTo : false
      }
    });
    return this.notiData;
  }

  getSpAllNotifications(){
    this.notiData = this.db.list('/sp-notifications', {
      query: {
         orderByChild: 'timestamp'
      }
    });
    return this.notiData;
  }

  getSpNotifications(spid){
    this.spNoti = this.db.list('/sp-notifications',{
      query: {
        orderByChild: 'spid',
        equalTo : spid
      }
    });

    return this.spNoti;
  }

  getAppointmentBySpid(spid){
    this.appointmentSpid = this.db.list('/user-appointments',{
      query: {
        orderByChild: 'spid',
        equalTo : spid
      }
    });

    return this.appointmentSpid;
  }

  getAppointmentsSPHome() {

    this.appointmentData = this.db.list('/user-appointments');
    return this.appointmentData;
  }

  getAppointmentsSPFiltered(spid) {

    this.searchSubject.next(spid);
    return this.appointmentData;

  }

  getWeekDay() {
    var date = new Date().getDay();
    var day;
    switch (date) {
      case 0: day = "Sunday"; break;
      case 1: day = "Monday"; break;
      case 2: day = "Tuesday"; break;
      case 3: day = "Wednesday"; break;
      case 4: day = "Thursday"; break;
      case 5: day = "Friday"; break;
      case 6: day = "Saturday";
    }
    return day;
  }

  updateSPProfile(ph, email, hotline,address, spid) {

    this.db.object('/sp/' + spid).update({
      ph: ph,
      email: email,
      hotline: hotline,
      address : address
    });

  }

  ImageUpload(logoName, logo, spid) {

    console.log('Logo Name', logoName);
    console.log('Logo ', logo);
    var storageRef = this.firebaseApp.storage().ref('/service-providers/' + spid);
    var uploadTask = storageRef.put(logo);
    uploadTask.on('state_changed', snapshot => {

    }, error => {

    }, () => {

      var downloadURL = uploadTask.snapshot.downloadURL;
      console.log("Download URL ", downloadURL);

      if (downloadURL) {
        this.db.object('/sp/' + spid).update({
          logo: downloadURL
        });
        console.log("yout yay");
      }

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

  getAllNotifications() {
    this.allnotiData = this.db.list('/sp-notifications', {
      query: {
        orderByChild: 'timestamp',
      }
    });

    return this.allnotiData;
  }

  changeNotiStatus(id, condition) {

    this.db.object('/sp-notifications/' + id).update({
      read: condition
    });

  }

  getNotificationDetail(notiID) {

    this.notificationDetail = this.db.object('/notifications/' + notiID);
    return this.notificationDetail;

  }

  getAppointmentDetail(apid) {

    this.appointmentDetail = this.db.object('/user-appointments/' + apid);
    return this.appointmentDetail;

  }

  getSpNotiID(notiID){
    
    this.notiIdDetail = this.db.object('/sp-notifications/'+notiID);
    return this.notiIdDetail;

  }


}
