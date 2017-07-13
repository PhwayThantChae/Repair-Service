import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { LoginService } from './login.service';
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
  profileInfo = [];

  constructor(public db: AngularFireDatabase, private loginService: LoginService) {

    this.appointmentData = db.list('/user-appointments');
    this.sendNotificationData = db.list('/sp-notifications');

  }

  writeUserData(userId, name, email, ph, address, imageUrl) {

    this.db.object('users/' + userId).set({
      username: name,
      email: email,
      ph: ph,
      address: address,
      imageUrl: imageUrl
    });
  }

  writeUserAppointmentData(uid, spid, device, email, ph, address, description, brand, time, date, emergency,
    name, branch, username, imgurl, spimg) {

    var appointment_data = {
      'uid': uid,
      'username': username,
      'imgurl': imgurl,
      'spid': spid,
      'device': device,
      'userEmail': email,
      'userPh': ph,
      'userAddress': address,
      'description': description,
      'brand': brand,
      'time': time,
      'date': date,
      'emergency': emergency,
      'company': name,
      'branch': branch,
      'spimg': spimg,
      'state': 'pending'
    };

    this.appointmentData.push(appointment_data);
  }

  readUserAppointmentData(): FirebaseListObservable<any> {

    this.readAppointmentData = this.db.list('/user-appointments');
    return this.readAppointmentData;
  }


  updateUserProfile(ph, address, uid) {

    this.db.object('/users/' + uid).update({
      ph: ph,
      address: address
    });
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
        orderByChild: 'timestamp',
        limitToFirst: 5
      }
    });
    return this.notiData;
  }

  getAllNotifications() {
    this.allnotiData = this.db.list('/notifications', {
      query: {
        orderByChild: 'timestamp',
      }
    });

    return this.allnotiData;
  }

  deleteNotification(key) {
    this.db
  }

  sendNotifications(apid, date, time, device, spid, state, username, uid, currentDate, currentTime, timestamp,imgurl) {

    var noti = {
      'uid': uid,
      'username': username,
      'spid': spid,
      'apid': apid,
      'time': time,
      'date': date,
      'device': device,
      'currentDate': currentDate,
      'currentTime': currentTime,
      'timestamp': timestamp,
      'state': state,
      'userimg' : imgurl,
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



}
