import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-policy-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './policy-management.html'
})
export class PolicyManagement {

  policies:any[] = [];

  isEditMode = false;

  form = {
    id: '',
    name: '',
    type: '',
    premium: 0,
    coverage: 0,
    durationDays: 0
  };

constructor(private api:AuthService,private cdr:ChangeDetectorRef){}

ngOnInit():void{
  this.getData();
}

  getData(){
    this.api.getPolicies().subscribe((pol:any)=>{
      this.policies=[...pol]
      this.cdr.detectChanges();
    })
  }


  addPolicy() {
    this.api.getPolicies().subscribe(()=>{
      this.getData();
       this.resetForm();
          this.cdr.detectChanges();
    })

  }

  editPolicy(policy: any) {
    this.form = { ...policy };
    this.isEditMode = true;
  }

  updatePolicy() {
    const index = this.policies.findIndex(p => p.id === this.form.id);
    this.policies[index] = { ...this.form };
    this.resetForm();
  }

  deletePolicy(id: number) {
  const confirmed = confirm('Are you sure you want to delete this policy?');

  if (!confirmed) return;
this.api.deletePolicy(id).subscribe(()=>{
  this.policies = this.policies.filter(p => p.id !== id);
  this.cdr.detectChanges();
})

}


  resetForm() {
    this.form = {
      id: '',
      name: '',
      type: '',
      premium: 0,
      coverage: 0,
      durationDays: 0
    };
    this.isEditMode = false;
  }
  isFormValid() {
  return (
    this.form.name &&
    this.form.type &&
    this.form.premium > 0 &&
    this.form.coverage > 0 &&
    this.form.durationDays > 0
  );
}

}