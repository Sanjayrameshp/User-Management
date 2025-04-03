import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError, BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api = "https://microsoftedge.github.io/Demos/json-dummy-data/64KB.json";
  
  private usersObject = new BehaviorSubject<any[]>([]);
  allUsers$ = this.usersObject.asObservable();

  private http = inject(HttpClient)

  public getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.api).pipe(
      map(users => users.map((user, index) => ({ ...user, edit: false, index:index }))),
      tap(users => {
        if (this.usersObject.getValue().length === 0) {
          this.usersObject.next(users);
        }
      }),
      catchError(error => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  public getUsers() {
    return this.usersObject.getValue();
  }

  public updateUserByIndex(index: number, updatedData: any) {
    const updatedUsers = this.getUsers().map(user => 
      user.index === index ? { ...updatedData, edit: false } : user
    );
    this.usersObject.next(updatedUsers);
  }

}
