import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SIDEBAR_MENU } from './sidebar.config';
import { AuthService, UserRole } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent  {


  role!:UserRole;
  menu:any=[];

  get roleColor():string{
    switch(this.role){
      case 'admin':return 'bg-blue-200';
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

 

  constructor(private auth: AuthService) {
     this.role = this.auth.getUserRole(); 
      console.log('SIDEBAR ROLE →', this.role); // 'admin' | 'agent' | 'client'
    this.menu = SIDEBAR_MENU[this.role];
  }

  

}
