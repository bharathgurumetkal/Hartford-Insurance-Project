import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../auth/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login {
  email = '';
  password = '';
  showPassword = false;
  


  constructor(private auth: Auth, private router: Router) {}

login() {
    this.auth.login(this.email, this.password, (user) => {

      if (user) {

        // Only allow agent and customer login
        if (user.role !== 'admin' && user.role !== 'agent' && user.role !== 'customer') {
          alert("Access Denied");
          return;
        }

        localStorage.setItem('user', JSON.stringify(user));

        // Role-based redirect
        if (user.role === 'admin') this.router.navigate(['/admin']);
        else if (user.role === 'agent') this.router.navigate(['/agent']);
        else this.router.navigate(['/customer']);

      } else {
        alert("Invalid Email or Password");
      }

    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
