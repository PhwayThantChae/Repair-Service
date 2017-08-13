import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Observable } from 'rxjs/Rx';
import { FirebaseDatabaseService } from '../../services/firebase-database.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
import { service_provider } from 'sp-modal';
declare var $: any;


@Component({
  selector: 'app-user-search-normal',
  templateUrl: './user-search-normal.component.html',
  styleUrls: ['./user-search-normal.component.css']
})
export class UserSearchNormalComponent implements OnInit {

  // searchForm = new FormGroup
  searchFormGroup: FormGroup;

  filteredItems: Array<any>;
  spData: FirebaseListObservable<any[]>;
  townships = [];
  name: FormControl;
  township: FormControl;
  nameString : string;
  townshipString: string;
  device: any;
  loading: boolean;
  emergency: string;
  searchSubject: Subject<any>;
  spDataObservable: Observable<any>;


  constructor(public loginService: LoginService, public router: Router, public afAuth: AngularFireAuth,
    public db: AngularFireDatabase, public route: ActivatedRoute, public formbuilder: FormBuilder, public firebaseDatabase: FirebaseDatabaseService) {

    route.params.subscribe(params => {
      this.device = params.device;
      this.emergency = "no";
    });

    

    this.filteredItems = [];

    this.firebaseDatabase.getTownship().map(x => {
      if (x) {
        x.forEach(y => {
          let t = {
            'name': y['name'],
            'name_mm': y['name_mm'],
            'state_id': y['state_id']
          }
          this.townships.push(t);
        })
      }
    }).subscribe(data => {
      if (data) {
        this.townships = [];
        this.townships.push(data);
      }
    })


    this.afAuth.authState.subscribe(x => {
      if(x){
        this.firebaseDatabase.getUserProfile(x.uid).map(y => {
          if(y){
            // this.townshipString = y.township;
            this.SpecificTownshipResult(y.township,null);

          }
        }).subscribe(data => {});
      }
      else{
        this.allTownshipsResult();
      }
    });

  }


  ngOnInit() {
    $(".ui.dropdown").dropdown();
    this.filteredItems = [];

    this.name = new FormControl('');
    this.township = new FormControl('', [
      Validators.required
    ]);
    this.buildForm();

  }

  buildForm(): void {
    this.searchFormGroup = this.formbuilder.group({
      name: this.name,
      township: this.township
    });
  }


  onSubmit() {
    this.filteredItems = [];
    this.loading = true;
    if (this.township.value == "all") {
      this.allTownshipsResult();
    }
    else {
      console.log(this.name.value,"is name null");
      this.SpecificTownshipResult(this.township.value,this.name.value);
    }

  }

  allTownshipsResult() {

    this.nameString = "";
    this.townshipString = "Every";
    this.spDataObservable = this.firebaseDatabase.SearchSpByAllTownships().map(x => {
      x.filter(x => {
        if (x["emergency"] === "both" || x["emergency"] === this.emergency) {
          if (x["services"]) {
            x.services.forEach(y => {
              if (y == this.device) {
                this.filteredItems.push(x);
                return this.filteredItems;
              }
            })
          }
        }

      })
    })

    this.spDataObservable.subscribe(data => {
      if (data) {
        this.filteredItems = data;
        this.loading = false;
      }
      else {
        this.loading = false;
      }
    });
  }

  SpecificTownshipResult(township,name) {

    this.nameString = "";
    this.townshipString = township;
    if(name == null || name == "" ){
      this.nameString == "";
      this.firebaseDatabase.SearchSpByTownship(township).map(z => {
        z.filter(z => {
          if (z["emergency"] === "both" || z["emergency"] === this.emergency) {
            if (z["services"]) {
              z.services.forEach(a => {
              console
                if (a == this.device) {
                  this.filteredItems.push(z);

                  return this.filteredItems;
                }
              })
            }
          }

        })
      }).subscribe(filteredData => {
        if (filteredData) {
          console.log("Filtered Items", filteredData);
          this.filteredItems = []
          this.filteredItems.push(filteredData);
          this.loading = false;
        }
        else {
          this.loading = false;
        }
      });
    }
    else{
      this.nameString = name;
      this.firebaseDatabase.SearchSpByTownship(township).map(z => {
        z.filter(z => {
          if (z["emergency"] === "both" || z["emergency"] === this.emergency) {
            if (z["search"].search(this.name.value.toLowerCase()) > -1) {
            if (z["services"]) {
              z.services.forEach(a => {
                if (a == this.device) {
                  this.filteredItems.push(z);

                  return this.filteredItems;
                }
              })
            }
          }
          }

        })
      }).subscribe(filteredData => {
        if (filteredData) {
          console.log("Filtered Items", filteredData);
          this.filteredItems = []
          this.filteredItems.push(filteredData);
          this.loading = false;
        }
        else {
          this.loading = false;
        }
      });
  }

  }


}
