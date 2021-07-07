import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Login } from 'src/app/core/domain/dto/login';
import { AuthService } from 'src/app/core/service/auth.service';
import { TokenService } from 'src/app/core/service/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  isLogged = false;

  isLoginFail = false;

  loginDto!: Login;

  username!: string;

  password!: string;

  errorMessage!: string;

  roles: string[] = [];

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }

  onLogin(): void {
    this.loginDto = new Login(this.username, this.password);
    this.authService.login(this.loginDto).subscribe(
      (data) => {
        this.isLogged = true;

        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.username);
        this.tokenService.setAuthorities(data.authorities);
        this.roles = data.authorities;
        this.router.navigate(['/']);
        this.autoReload();
      },
      (err) => {
        this.isLogged = false;
        this.errorMessage = err.error.message;
        this.toastr.error(this.errorMessage, 'Failed!', {
          timeOut: 3000,
          positionClass: 'toast-top-center',
        });
        // console.log(err.error.message);
      }
    );
  }

  autoReload() {
    window.location.reload();
  }

  successAlert() {
    Swal.fire('Good job!', 'You clicked the button!', 'success');
  }
}
