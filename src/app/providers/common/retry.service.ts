import { Injectable } from '@angular/core';
import { of, throwError, Observable } from 'rxjs';
import { take, delay, flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RetryService {

  retryFunction() {
    return (errors: Observable<any>) => errors.pipe(
      flatMap((error, index) => {
        if (!error.status || error.status !== 401) {
          return throwError(error);
        }
        return of(error).pipe(delay(2500));
      }),
      take(2));
  }
}
