; import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UsersService } from './../users.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-my-trip',
  templateUrl: './my-trip.component.html',
  styleUrls: ['./my-trip.component.scss']
})
export class MyTripComponent implements OnInit {

  userFavorite;
  users: any[];
  user;
  userId;
  myForm: FormGroup;


  userObj;
  userName;
  userid
  userTripsVisits = [];
  userTripsRestaurants = [];
  userTripsHotels = [];

  userTrips = [];
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formbuilder: FormBuilder,
    private userService: UsersService) {


    //to get user from local storage and use his data to show it in  profile



    this.userObj = JSON.parse(localStorage.getItem('currentUser'))
    this.userName = this.userObj.userName;
    this.userid = this.userObj.id;

    this.userService.getUserFavoriteTrip().subscribe(data => {
      this.userFavorite = data;
      for (let i in this.userFavorite) {
        if (this.userFavorite[i].userId == this.userid) {
          if (this.userFavorite[i].category == 'visit') {
            this.userTripsVisits.push(this.userFavorite[i]);
          } else if (this.userFavorite[i].category == 'hotel') {
            this.userTripsHotels.push(this.userFavorite[i]);
          } else if (this.userFavorite[i].category == 'restaurant') {
            this.userTripsRestaurants.push(this.userFavorite[i]);
          }
        }
      }
    })
    // console.log(this.userTripsHotels)
    // console.log(this.userTripsRestaurants)
    // console.log(this.userTripsVisits)
    
    setTimeout(() => {
      let add = this.userTripsVisits.concat(this.userTripsRestaurants);
      this.userTrips = add.concat(this.userTripsHotels)
    }, 1000);
    
    
    console.log(this.userTrips)
  }
  
  
  // user share post in guide me page 
  onSubmit(form, favorite) {
    form.value.userName = this.userName
    form.value.userid = this.userid
    // console.log(this.userid);
    this.userService.postUserPost(form.value).subscribe(data => {
      form.value = data;
      form.reset()
    })
  }
  // to make user delete any favorite trip he add it in his profile 
  deleteTrip(id, parent) {
    this.userService.deleteUserFavoriteTrip(id).subscribe(data => {
      id = data
      //this to delete post  immediately form html with out refresh 
      parent.remove()
    })
  }




  ngOnInit() {
    this.myForm = this.formbuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }





}
