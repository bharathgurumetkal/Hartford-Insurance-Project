import { Component, OnInit } from '@angular/core';
import { Claims } from '../../services/claims';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-profile',
  imports: [CommonModule],
  templateUrl: './customer-profile.html',
  styleUrl: './customer-profile.css',
})
export class CustomerProfile implements OnInit{
  customer:any;
  user:any;

  constructor(private claimsService: Claims) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user')!);

    this.claimsService.getCustomerByUserId(this.user.id,(customer)=>{
      this.customer = customer;
    });
  }

  getInitials(name:string) {
    return name.split(' ').map((n:any)=>n[0]).join('');
  }

}
