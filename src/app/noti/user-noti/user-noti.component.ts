import { Component, OnInit, Input } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-user-noti',
  templateUrl: './user-noti.component.html',
  styleUrls: ['./user-noti.component.css']
})

export class UserNotiComponent implements OnInit {

  @Input() userNoti;

  constructor() { 
    
  }

  ngOnInit() {

    $('.custom.item')
      .popup({
        popup: '.custom.popup',
        position: 'bottom center',
        lastResort: 'bottom center',
        inline: true,
        // boundary:   $('body'),
        on: 'click'
      });

  }


}


