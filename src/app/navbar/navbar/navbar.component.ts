import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentURL: number;
  user: any;
  userExist : FirebaseObjectObservable<any>;

  constructor(public router: Router, public afAuth: AngularFireAuth, public route : ActivatedRoute,
              public firebaseDatabase : FirebaseDatabaseService,public db: AngularFireDatabase) {

                
    
      this.afAuth.authState.subscribe(x => {
        if (x) {
          this.userExist = this.db.object('/users/'+x.uid);
          this.userExist.subscribe(snapshot =>{
            let exist = (snapshot.$value !== null);
            console.log("exist",exist);
            if (exist) {
              this.user = snapshot;
            }
            else{
              this.user = null;
            }
        });
        }
        
      });
    // console.log(this.afAuth.auth.currentUser,"current user");
    // if(this.afAuth.auth.currentUser){
    //   this.user = this.afAuth.auth.currentUser;
    // }
    // else{
    //   this.user = null;
    // }

    //  console.log(this.route.snapshot.firstChild.url[0].path);
      // console.log("1111111111",this.route.snapshot.firstChild.url); // array of states

    // console.log(this.route.firstChild);
   
    this.router.events.subscribe((res) => {
      let pathArray = [];
      pathArray = window.location.pathname.split('/');
       console.log(pathArray[1],"WINDOWN LOCASTON");
      // console.log(res["url"][0],"RES");
      // console.log("PARETNTTTTTTTTTT",this.route.parent.snapshot.firstChild.url[0].path);
      this.currentURL = 0;
      switch (pathArray[1]) {
        case "Home": this.currentURL = 0; break;
        case "Sp_LogIn": this.currentURL = 3; break;
        case "NewUser": this.currentURL = 4; break;
        case "Sp_Homepage": this.currentURL = 2; break;
        case "QueuingRequest": this.currentURL = 2; break;
        case "ApprovedRequest": this.currentURL = 2; break;
        case "Sp_Profile": this.currentURL = 2; break;
        case "SpNotifications": this.currentURL = 2; break;
        case "Sp_Noti_Appointment_Detail" : this.currentURL = 2; break;
        case "Sp_Appointment_Detail" : this.currentURL = 2;break;
        case "Sp_Support" : this.currentURL = 2 ; break;
        default: this.currentURL = 1; break;
      }
    });


  }

  ngOnInit() {
  }

}
