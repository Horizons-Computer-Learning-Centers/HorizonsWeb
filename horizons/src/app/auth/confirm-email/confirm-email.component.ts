import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, ResponseTypeEnum } from '../../shared/api/auth-api';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'horizons-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
})
export class ConfirmEmailComponent implements OnInit {
  successMessage: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    let token = this.route.snapshot.paramMap.get('token');

    if (userId && token) {
      token = decodeURIComponent(token);
      this.authService
        .confirmEmail(userId, token)
        .pipe(
          catchError((error) => {
            // Handle the error here
            console.error('Error confirming email:', error);
            this.successMessage = error;
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response) {
            // Handle successful confirmation here
            this.successMessage = response;
          }
        });
    }
  }
}
