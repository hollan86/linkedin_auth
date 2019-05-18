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
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.token = queryParams.get("access_token")
      localStorage.setItem('access_token',this.token);
    })

    
    var url = 'https://api.linkedin.com/v2/me';
    //var data = {username: 'example'};

    fetch(url, {
      method: 'GET', // or 'PUT'
      //body: JSON.stringify(data), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
        'Connection': 'keep-alive'
      }
    }).then(res => res.json())
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));
  }

}
