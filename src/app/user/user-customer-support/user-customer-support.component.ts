import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import * as knayi from 'knayi-myscript';
declare var $:any;


@Component({
  selector: 'app-user-customer-support',
  templateUrl: './user-customer-support.component.html',
  styleUrls: ['./user-customer-support.component.css']
})
export class UserCustomerSupportComponent implements OnInit {

  subject : FormControl;
  description : FormControl;
  supportForm : FormGroup;
  phoneArray : string[];
  contactData : any;
  id : string;

  constructor(public FirebaseDatabase: FirebaseDatabaseService,
              public afAuth: AngularFireAuth,public formbuilder:FormBuilder) { }

  ngOnInit() {
      this.afAuth.authState.subscribe(x => {
       
      if(x){
        this.id = x.uid;
        this.FirebaseDatabase.getContact().subscribe(x => {
          if(x){
            x.forEach(x => {

              if($.isArray(x['phone'])){
                this.phoneArray = x['phone'].toString().split(',');
              }
              else{
                this.phoneArray = x['phone'].toString().split(',');
              }

            this.contactData = {
              'phone'  : this.phoneArray.join(', '),
              'address' : x['address'],
              'email' : x['email']
            }
            console.log("Contact Data",this.contactData);
            })
           

          }
        })
      }
    })

    this.description = new FormControl('',[Validators.required]);
    this.subject = new FormControl('',[Validators.required]);
    this.bulidForm();
  }

  bulidForm():void{
  this.supportForm = this.formbuilder.group({
    description : this.description,
    subject : this.subject
  });
  }

  onSubmit(){

   if(knayi.fontDetect(this.description.value) == "zawgyi"){
        this.description.setValue(knayi.fontConvert(this.description.value, 'unicode'));
      }
   if(knayi.fontDetect(this.subject.value) == "zawgyi"){
        this.subject.setValue(knayi.fontConvert(this.subject.value, 'unicode'));
      }

    this.FirebaseDatabase.sendFeedback(this.subject.value,this.description.value,this.id);
    this.subject.setValue('');
    this.description.setValue('');
}

}
