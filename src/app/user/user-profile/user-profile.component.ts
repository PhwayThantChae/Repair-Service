import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  ph: string;
  old_ph: string;
  old_address: string;
  address: string;
  uid: string;
  imgurl: string;
  loading: boolean;
  userProfile: FirebaseObjectObservable<any>;

  constructor(public loginService: LoginService, public firebaseDatabase: FirebaseDatabaseService,
    public afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe(x => {
      if (x) {
        this.uid = x.uid;
        this.userProfile = this.firebaseDatabase.getUserProfile(x.uid);
        this.userProfile.subscribe(snapshot => {
          if (snapshot) {
            this.loading = false;
            this.ph = snapshot.ph;
            this.old_ph = snapshot.phS;
            this.imgurl = snapshot.imageUrl;
            this.address = snapshot.address;
            this.old_address = snapshot.address;
          }
          else {
            this.loading = true;
          }
        })
      }
    });

  }

  ngOnInit() { }

  onSubmit(form) {

    if (form.ph !== this.old_ph || form.address !== this.old_address) {
      this.firebaseDatabase.updateUserProfile(form.ph, form.address, this.uid);
    }

  }

}
