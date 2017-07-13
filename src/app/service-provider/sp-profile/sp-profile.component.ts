import { Component, OnInit } from '@angular/core';
import { SpLoginServiceService } from '../../services/sp-login-service.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { SpFirebaseDatabaseService } from '../../services/sp-firebase-database.service';
import { AngularFireAuth } from 'angularfire2/auth';
declare var $:any;

@Component({
  selector: 'app-sp-profile',
  templateUrl: './sp-profile.component.html',
  styleUrls: ['./sp-profile.component.css']
})
export class SpProfileComponent implements OnInit {

  loading: boolean;
  imgurl : string;
  spid:string;
  spuser : any;
  spData: FirebaseObjectObservable<any>;
  spname : string;
  email : string[];
  oldemail : string[];
  hotline : string[];
  oldhotline : string[];
  logo = "";
  oldlogo = "";
  ph : string[];
  oldph : string[];
  selectedFile : any;
  

  constructor(public spLoginService: SpLoginServiceService, public spFirebaseDatabase: SpFirebaseDatabaseService,
              public afAuth: AngularFireAuth) { }

  ngOnInit() {

    this.afAuth.authState.subscribe(x => {
      if(x){
        this.spid = x.uid;
        this.spData = this.spFirebaseDatabase.getNavbarData(x.uid);
        this.spData.subscribe(data => {
          this.spuser = data;
          if (data) {
            this.spname = data.company;
            this.imgurl = data.logo;
            this.email = data.email;
            this.oldemail = data.email;
            this.hotline = data.hotline;
            this.ph = data.ph;
            this.oldph = data.ph;
          }
      });
  }
  });
}

public fileChangeEvent(fileInput: any){
      if (fileInput.target.files && fileInput.target.files[0]) {
        var reader = new FileReader();
        this.selectedFile = fileInput.target.files;
        console.log("File Name ",fileInput.target.files[0].name);
        console.log(fileInput.target.files[0]);

        reader.onload = function (e : any) {
            $('#preview').attr('src', e.target.result);
        }

        reader.readAsDataURL(fileInput.target.files[0]);
        // this.spFirebaseDatabase.ImageUpload(this.selectedFile.name,this.selectedFile);

    }
}

  onSubmit(form){
   
    if(this.selectedFile){
      this.spFirebaseDatabase.ImageUpload(this.selectedFile[0].name,this.selectedFile[0],this.spid);
    }
    if (form.ph !== this.oldph || form.email !== this.oldemail || form.hotline !== this.oldhotline) {

      this.spFirebaseDatabase.updateSPProfile(form.ph, form.email,form.hotline,this.spid);
    }
  }
}
