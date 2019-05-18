import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
// constructor(private route: ActivatedRoute) { }

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // this.route.queryParamMap.subscribe(queryParams => {
    //   var token = queryParams.get("access_token")
    //   localStorage.setItem('access_token',token);
    // })
  }

}
