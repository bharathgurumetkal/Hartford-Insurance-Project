import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from '../../services/user-data';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './customer-profile.html',
  styleUrl: './customer-profile.css',
})
export class CustomerProfile implements OnInit {

 user:any;
  customer:any;
  editMode = false;
   isLoading = true; 

  constructor(
    private userData: UserData,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const loggedUser = JSON.parse(localStorage.getItem('user')!);

    this.userData.getFullCustomerProfile(loggedUser.id,(data)=>{
      this.user = data.user;
      this.customer = data.customer;

      // Defaults if empty
      this.customer.phone ||= '';
      this.customer.address ||= '';
      this.customer.communicationPreference ||= 'Email';
      this.customer.kycStatus ||= 'Pending';
      this.isLoading = false;
      this.cd.detectChanges();
    });
  }

  getInitials(name:string) {
    return name.split(' ').map(n=>n[0]).join('');
  }

  enableEdit() {
    this.editMode = true;
  }

  saveProfile() {
    this.userData.updateCustomer(this.customer,()=>{
      alert("Profile Updated Successfully!");
      this.editMode = false;
      this.cd.detectChanges();
    });
  }

  goToKyc() {
    this.router.navigate(['/ekyc']);
  }
}
