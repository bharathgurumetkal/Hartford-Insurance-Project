import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SIDEBAR_MENU } from './sidebar.config';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../auth/services/auth';
type UserRole = 'admin' | 'agent' | 'client';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent  {

role!:UserRole;

   constructor(private auth: Auth) {
     this.role = this.auth.getRole(); 
      console.log('SIDEBAR ROLE →', this.role); // 'admin' | 'agent' | 'client'
    this.menu = SIDEBAR_MENU[this.role];
  }

  
  menu:any=[];

  get roleColor():string{
    
    switch(this.role){
      case 'admin':return 'bg-blue-600';
      case 'agent':return 'bg-green-200';
      case 'client':return 'bg-yellow-200';
      default:return 'bg-gray-200';
    }
  }
  get roleTextColor():string{
    switch(this.role){
      case 'admin':return 'text-blue-400';
      case 'agent':return 'text-green-400';
      case 'client':return 'text-yellow-400';
      default:return 'text-gray-400';
    }
  }

 

 

  

}
