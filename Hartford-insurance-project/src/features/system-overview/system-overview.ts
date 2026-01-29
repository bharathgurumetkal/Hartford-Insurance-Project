import { Component } from '@angular/core';
import { Auth } from '../../auth/services/auth';
import { StatCardComponent } from '../../app/components/stat-card/stat-card';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-overview',
  imports: [StatCardComponent,CommonModule],
  templateUrl: './system-overview.html',
  styleUrl: './system-overview.css',
})
export class SystemOverview {
  stats = {
    policies: 0,
    agents: 0,
    claims: 0,
    revenue: 0
  };
  
  recentActivities: any[] = [];

  claimsSummary={
    approved:0,
    rejected:0,
    pending:0
  };
  
  constructor(private api:Auth,private cdr: ChangeDetectorRef){}
ngOnInit() {
  this.loadRecentActivity();



  this.api.getPolicies().subscribe((p:any) => {
    this.stats.policies = p.length;

     const totalRevenue = p.reduce(
      (sum: number, policy: { premium: any; }) => sum + Number(policy.premium || 0),
      0
    );

    this.stats = {
      ...this.stats,
      policies: p.length,
      revenue: totalRevenue
    };

    this.cdr.detectChanges();
  });
  this.api.getAgents().subscribe((a:any) =>{  this.stats.agents = a.length
    this.cdr.detectChanges();
  });
this.api.getClaims().subscribe((c:any) => {
    this.stats.claims= c.length;
    this.claimsSummary={
      pending:c.filter((c: { status: string; })=>c.status==='Pending').length,
      approved:c.filter((c: {status:String;})=>c.status==='Approved').length,
      rejected:c.filter((c: {status:String;})=>c.status==='Rejected').length
    }
    this.cdr.detectChanges();
  });
  

}



loadRecentActivity() {
  this.api.getClaims().subscribe((claims: any) => {
    this.recentActivities = claims.slice(-5).reverse();
    console.log(this.recentActivities);
    this.cdr.detectChanges();
  });
};

}


