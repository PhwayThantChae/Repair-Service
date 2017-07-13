import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
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

  filteredItems: Array<any>;
  spData: FirebaseListObservable<any[]>;
  townships = ["ahlone", "bahan", "mayangone", "pazundaung", "sanchaung", "yankin"];
  name: string;
  township: string;
  device: any;
  loading: boolean;
  emergency: string;
  searchSubject: Subject<any>;


  constructor(private loginService: LoginService, public router: Router, public afAuth: AngularFireAuth,
    public db: AngularFireDatabase, private route: ActivatedRoute) {

    route.params.subscribe(params => {
      this.device = params.device;
      this.emergency = params.emergency;
    });

    console.log(this.emergency);
    this.filteredItems = [];
    this.searchSubject = new Subject();
    this.spData = db.list('/sp', {
      query: {
        orderByChild: 'township',
        equalTo: this.searchSubject
      }
    });


      this.spData.map(x => {
        x.filter(x => {
          if (x["emergency"] === "both" || x["emergency"] === this.emergency) {
            if (x["search"].search(this.name.toLowerCase()) > -1) {
              console.log("name yay");
              if (x["services"]) {
                x.services.forEach(y => {
                  if (y == this.device) {
                    this.filteredItems.push(x);
                  }
                })
              }

            }
          }
        })
      }).subscribe(data => {
        if (data) {
          console.log("Filtered" + this.filteredItems);
          this.loading = false;
        }
        else {
          this.loading = false;
        }
      });
  

  }


  ngOnInit() {
    $(".ui.dropdown").dropdown();
    this.filteredItems = [];
  }


  onSubmit(form: any) {
    this.filteredItems = [];
    this.loading = true;
    this.name = form.name;
    console.log(form.township);

    this.searchSubject.next(form.township);
  }





}
