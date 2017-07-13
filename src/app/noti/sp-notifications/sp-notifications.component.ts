import { Component, OnInit } from '@angular/core';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { SpFirebaseDatabaseService } from '../../services/sp-firebase-database.service';

@Component({
  selector: 'app-sp-notifications',
  templateUrl: './sp-notifications.component.html',
  styleUrls: ['./sp-notifications.component.css']
})
export class SpNotificationsComponent implements OnInit {

  user: any;
  notificationsObservable: FirebaseListObservable<any[]>;
  spNoti = [];
  loading: boolean;
  return_string: string;

  constructor(public afAuth: AngularFireAuth, public spFirebaseDatabase: SpFirebaseDatabaseService, public db: AngularFireDatabase) { }

  ngOnInit() {

    this.loading = true;
    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.user = x;
        console.log(x.uid);
        this.notificationsObservable = this.spFirebaseDatabase.getAllNotifications();
        this.notificationsObservable.map(y => {

          y.filter(y => {
            if (y.spid == x.uid) {
              this.spNoti.push(y);
              y.timestamp = this.timestampToNoti(y.timestamp);
            }

          })
          this.spNoti.reverse();
          console.log(this.spNoti); //count here
        }).subscribe(data => {
          if (data) {
            this.loading = false;

          }
          else {
            this.loading = false;

          }
        })
      }
    });
  }

  timestampToNoti(timestamp){

    var todayDate = new Date(Date.now()).getTime();  // convert timestamp to Date and getTime()
    var notiDate = new Date(timestamp).getTime();
    var diff = Math.round((todayDate - notiDate) / 3600000);
    this.return_string = this.spFirebaseDatabase.convert_Hours_To_NotiTime(diff);  // convert differentiated timestamp to hours
    return this.return_string;

  }


}
