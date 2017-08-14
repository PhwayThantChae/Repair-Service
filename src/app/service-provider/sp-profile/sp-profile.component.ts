import { Component, OnInit } from '@angular/core';
import { SpLoginServiceService } from '../../services/sp-login-service.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { SpFirebaseDatabaseService } from '../../services/sp-firebase-database.service';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import * as knayi from 'knayi-myscript';
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
  oldemail : string;
  oldhotline : string;
  
  oldlogo = "";
  oldph : string;
  oldaddress : string;
  selectedFile : any;

  logo : FormControl;
  ph : FormControl;
  email : FormControl;
  hotline : FormControl;
  address : FormControl;
  userprofileForm : FormGroup;

  emailArray = [];
  phArray = [];
  hotlineArray = [];


  constructor(public spLoginService: SpLoginServiceService, public spFirebaseDatabase: SpFirebaseDatabaseService,
              public afAuth: AngularFireAuth,public formbuilder:FormBuilder) { }

  ngOnInit() {

    this.afAuth.authState.subscribe(x => {
      if(x){
        this.spid = x.uid;
        this.spData = this.spFirebaseDatabase.getNavbarData(x.uid);
        this.spData.subscribe(data => {
          this.spuser = data;
          if (data) {
             if($.isArray(data['email'])){
                this.emailArray = data['email'].toString().split(',');
              }
              else{
                this.emailArray = data['email'].toString().split(',');
              }

              if($.isArray(data['ph'])){
                this.phArray = data['ph'].toString().split(',');
              }
              else{
                this.phArray = data['ph'].toString().split(',');
              }

              if($.isArray(data['hotline'])){
                this.hotlineArray = data['hotline'].toString().split(',');
              }
              else{
                this.hotlineArray = data['hotline'].toString().split(',');
              }
            this.spname = data.company;
            this.imgurl = data.logo;
            this.email.setValue(this.emailArray.join(', '));
            this.oldemail = this.emailArray.join(', ');
            this.hotline.setValue(this.hotlineArray.join(', '));
            this.ph.setValue(this.phArray.join(', '));
            this.address.setValue(data.address);
            this.oldaddress = data.address;
            this.oldph = this.phArray.join(', ');
            this.oldhotline = this.hotlineArray.join(', ')
          }
      });
  }
});

  this.ph = new FormControl('',[
    Validators.required
  ]);
  this.email = new FormControl('');
  this.hotline = new FormControl('');
  this.address = new FormControl('',[
    Validators.required
  ]);
  this.logo = new FormControl('');
this.bulidForm();
}

bulidForm():void{
  this.userprofileForm = this.formbuilder.group({
    ph : this.ph,
    hotline : this.hotline,
    email : this.email,
    address : this.address,
    logo : this.logo
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

  onSubmit(){

    if(this.selectedFile){
      this.spFirebaseDatabase.ImageUpload(this.selectedFile[0].name,this.selectedFile[0],this.spid);
    }
    if (this.ph.value !== this.oldph || this.email.value !== this.oldemail || this.hotline.value !== this.oldhotline || this.address.value !== this.oldaddress) {
      if(knayi.fontDetect(this.ph.value) == "zawgyi"){
        this.ph.setValue(knayi.fontConvert(this.ph.value, 'unicode'));
      }
      if(knayi.fontDetect(this.address.value) == "zawgyi"){
        this.address.setValue(knayi.fontConvert(this.address.value, 'unicode'));
      }
      if(knayi.fontDetect(this.hotline.value) == "zawgyi"){
        this.hotline.setValue(knayi.fontConvert(this.hotline.value, 'unicode'));
      }
      if(knayi.fontDetect(this.email.value) == "zawgyi"){
        this.email.setValue(knayi.fontConvert(this.email.value, 'unicode'));
      }
      this.spFirebaseDatabase.updateSPProfile(this.ph.value, this.email.value,this.hotline.value,this.address.value,this.spid);
    }
  }
}
