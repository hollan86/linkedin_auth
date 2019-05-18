import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
// constructor(private route: ActivatedRoute) { }

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  token = '';
  all_data = null;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.token = queryParams.get("access_token");
      this.all_data = JSON.parse(queryParams.get("profile_data"));

      localStorage.setItem('access_token',this.token);
      console.log(this.all_data);
      
    })
  }

}
