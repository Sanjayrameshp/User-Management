import { Component, inject,computed, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-details',
  imports: [RouterModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit{

  activatedRoute = inject(ActivatedRoute);
  userService = inject(UserService)

  userId = signal<number | null>(null);
  selectedUser: { [key: string]: any } = {};
  tableHeaders: string[] = [];
  showDetails : boolean = false;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const idParam = params.get('userid');
      this.userId.set(idParam ? parseInt(idParam) : null);
      
      const existingUsers = this.userService.getUsers();
      
      if (existingUsers.length > 0) {
        this.getUserDetails(existingUsers);
      } else {
        this.userService.getAllUsers().subscribe(users => {
          this.getUserDetails(users);
        });
      }
    });
  }

  getUserDetails(users?: any[]): void {
    const allUsers = users || this.userService.getUsers();
    this.selectedUser = allUsers.find(user => user.index === this.userId());
    this.showDetails = !!this.selectedUser;
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj).filter(key => key !== "edit" && key !== 'index');
  }


}
