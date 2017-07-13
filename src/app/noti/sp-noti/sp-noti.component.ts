import { Component, OnInit,Input } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-sp-noti',
  templateUrl: './sp-noti.component.html',
  styleUrls: ['./sp-noti.component.css']
})
export class SpNotiComponent implements OnInit {

  @Input() spNoti;

  constructor() { }

  ngOnInit() {


      $('.spcustom.item')
      .popup({
        popup: '.spcustom.popup',
        position: 'bottom center',
        lastResort: 'bottom center',
        inline: true,
        // boundary:   $('body'),
        on: 'click'
      });

  }

}
