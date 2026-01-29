import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../auth/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  fullName = '';
  email = '';
  password = '';
  role = '';
  showPassword = false;

  emailExists = false;

  passwordStrength = '';
  passwordStrengthClass = '';

  constructor(private auth: Auth, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // 🔹 Check if email already exists
  checkEmail() {
    if (!this.email) return;

    this.auth.checkEmailExists(this.email, (exists) => {
      this.emailExists = exists;
    });
  }

  // 🔹 Password strength checker
  checkPasswordStrength() {
    const pass = this.password;

    if (!pass) {
      this.passwordStrength = '';
      this.passwordStrengthClass = '';
      return;
    }

    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*]/.test(pass);

    if (pass.length < 6) {
      this.passwordStrength = 'Weak';
      this.passwordStrengthClass = 'text-red-500';
    }
    else if (hasUpper && hasNumber && hasSpecial) {
      this.passwordStrength = 'Strong';
      this.passwordStrengthClass = 'text-green-600';
    }
    else {
      this.passwordStrength = 'Medium';
      this.passwordStrengthClass = 'text-yellow-500';
    }
  }

  // 🔹 Register
  register() {

    if (!this.fullName || !this.email || !this.password || !this.role) {
      alert("Please fill all fields");
      return;
    }

    if (this.emailExists) {
      alert("Email already registered. Please login.");
      return;
    }

    if (this.passwordStrength === 'Weak') {
      alert("Password too weak. Use at least 6 characters with uppercase, number & special character.");
      return;
    }

    this.auth.register(this.fullName, this.email, this.password, this.role, (success) => {

      if (success) {
        alert("Registration Successful! Please Login.");
        this.router.navigate(['/login']);
      } else {
        alert("Registration Failed!");
      }

    });
  }
}