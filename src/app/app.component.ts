import { Component, OnInit } from '@angular/core';
import * as config from './../../config';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showLogin = true;
  
  ngOnInit(): void {
  }
  //title = 'app';
  linkedin(){
    window.location.replace('https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=' + config.client_id + '&redirect_uri=https%3A%2F%2Fhollan-linkedin.herokuapp.com%2Fauth%2Fcallback&scope=r_liteprofile%20r_emailaddress%20w_member_social')
    this.showLogin = false;
  }
}
