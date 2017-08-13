import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { SpFirebaseDatabaseService } from '../../services/sp-firebase-database.service';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-sp-customer-support',
  templateUrl: './sp-customer-support.component.html',
  styleUrls: ['./sp-customer-support.component.css']
})
export class SpCustomerSupportComponent implements OnInit {

  subject : FormControl;
  description : FormControl;
  spSupportForm : FormGroup;

  constructor(public spFirebaseDatabase: SpFirebaseDatabaseService,
              public afAuth: AngularFireAuth,public formbuilder:FormBuilder) { }

  ngOnInit() {

    this.afAuth.authState.subscribe(x => {
      if(x){
        
      }
    })

    this.description = new FormControl('',[Validators.required]);
    this.subject = new FormControl('',[Validators.required]);
    this.bulidForm();
  }

  bulidForm():void{
  this.spSupportForm = this.formbuilder.group({
    description : this.description,
    subject : this.subject
  });
}

}
