import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DataTable } from '../../app/components/data-table/data-table';



@Component({
  selector: 'app-agent-management',
  imports: [DataTable],
  templateUrl: './agent-management.html',
  styleUrl: './agent-management.css',
})
export class AgentManagement {

  agents:any[]=[];

  columns:string[]=[];
  keys:string[]=[];

constructor(private api:AuthService){}
ngOnInit(){
  this.getAgents();
}
getAgents(){
  this.api.getAgents().subscribe((agents:any)=>{
    this.agents=agents;
    if(agents.length>0){
      this.keys=Object.keys(agents[0]);
      this.columns=this.keys.map(k=>
        k.replace(/([A-Z])/g,'$1').toUpperCase()
      )
    }

  })
}



}
