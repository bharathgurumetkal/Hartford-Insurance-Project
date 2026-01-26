import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-policy-management',
  imports: [],
  templateUrl: './policy-management.html',
  styleUrl: './policy-management.css',
})
export class PolicyManagement {
  polices:any[]=[];
  constructor(private api:AuthService){}
  ngOnInit(){
    this.getPolicies();
  }

  getPolicies(){
    this.api.getPolicies().subscribe((pol:any)=>{
      this.polices=pol;
       console.log(this.polices);
    });
  }
 

}
