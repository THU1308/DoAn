import { Component } from '@angular/core';
import { UserDto } from '../dto/user.dto';
import { UserRequest } from '../request/user.request';
import { UserService } from '../services/user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent {

  users: any[] = [];
  selectedUser: any;
  usernameToResetPassword: string = '';
  usernameToUpdateRole: string = '';
  usernameToEnable: string = '';
  userNameToEdit: string = '';
  isLoading = false;
  userRequest: UserRequest = {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    state: '',
    address: '',
    phone: ''
  };
  showNotification: boolean = false;
  message: string = '';

  currentUserName: any
  getCurrentUser() {
    this.userService.getCurrenUserLogin().subscribe({
      next: (res: any) => {
        this.currentUserName = res.data.username;
      },
      error: (err) => console.error(err),
    });
  }

  // Flags to control visibility of forms
  isEditFormVisible = false;
  isUpdateRoleFormVisible = false;
  isEnableUserFormVisible = false;
  isResetPasswordFormVisible = false;


  showEditForm(user: any) {
    this.selectedUser = { ...user }; // Copy thông tin người dùng vào selectedUser
    this.userRequest.userName = this.selectedUser.userName
    this.isEditFormVisible = true;
    this.isUpdateRoleFormVisible = false;
    this.isEnableUserFormVisible = false;
    this.isResetPasswordFormVisible = false;
  }

  showUpdateRoleForm(user: any) {
    this.usernameToUpdateRole = user.username; // Điền tên người dùng vào trường cập nhật vai trò
    this.isEditFormVisible = false;
    this.isUpdateRoleFormVisible = true;
    this.isEnableUserFormVisible = false;
    this.isResetPasswordFormVisible = false;
  }

  showEnableUserForm(user: any) {
    this.usernameToEnable = user.username; // Điền tên người dùng vào trường kích hoạt
    this.isEditFormVisible = false;
    this.isUpdateRoleFormVisible = false;
    this.isEnableUserFormVisible = true;
    this.isResetPasswordFormVisible = false;
  }

  showResetPasswordForm(user: any) {
    this.selectedUser = { ...user }; // Copy thông tin người dùng vào selectedUser
    this.usernameToResetPassword = user.username; // Điền tên người dùng vào trường reset mật khẩu
    this.isEditFormVisible = false;
    this.isUpdateRoleFormVisible = false;
    this.isEnableUserFormVisible = false;
    this.isResetPasswordFormVisible = true;
  }

  timeoutNotification(milisecon: number) {
    setTimeout(() => {
      this.showNotification = false;
    }, milisecon);
  }

  notification(message: string) {
    this.showNotification = true;
    this.message = message;
    this.timeoutNotification(2000);
  }
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Tải danh sách người dùng
  loadUsers() {
    this.isLoading = true;
    this.userService.getListUsers().subscribe(
      (data) => {
        this.users = data.data;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  // Cập nhật thông tin người dùng
  updateUser(userForm: any, user: any) {
    if (this.selectedUser) {
      // Debugger để kiểm tra

      console.log(this.selectedUser.username)
      // Map dữ liệu từ form vào đối tượng userRequest
      this.userRequest.userName = this.selectedUser.username;
      this.userRequest.firstName = userForm.value.firstName;
      this.userRequest.lastName = userForm.value.lastName;
      this.userRequest.email = userForm.value.email;
      this.userRequest.country = userForm.value.country;
      this.userRequest.state = userForm.value.state;
      this.userRequest.address = userForm.value.address;
      this.userRequest.phone = userForm.value.phone;

      // debugger;
      // console.log(this.userRequest)
      // Gọi API cập nhật thông tin người dùng
      this.userService.updateProfile(this.userRequest).subscribe(
        (data) => {
          this.notification("User updated successfully")
          this.loadUsers(); // Reload 
        },
        (error) => {
          console.error(error);
          this.notification("Failed to update user");
        }
      );
    }
  }


  // Cập nhật vai trò người dùng
  updateRole() {
    if (this.usernameToUpdateRole) {
      this.userService.updateUserRole(this.usernameToUpdateRole).subscribe(
        (data) => {
          alert('Role updated successfully');
          this.loadUsers();
        },
        (error) => {
          console.error(error);
          alert('Failed to update role');
        }
      );
    }
  }

  // Kích hoạt người dùng
  enableUser() {
    if (this.usernameToEnable) {
      this.userService.enableEmployee(this.usernameToEnable).subscribe(
        (data) => {
          alert('User enabled successfully');
          this.loadUsers();
        },
        (error) => {
          console.error(error);
          alert('Failed to enable user');
        }
      );
    }
  }

  // Gửi email reset mật khẩu
  resetPassword() {
    this.isLoading = true
    if (this.usernameToResetPassword) {
      console.log(this.selectedUser)
      this.userService.resetPassword(this.selectedUser.email).subscribe(
        (data) => {
          this.isLoading = false
          this.notification("Reset password email sent successfully")
        },
        (error) => {
          console.error(error);
          this.isLoading=false
          this.notification("Failed to send reset password email")
        }
      );
    }
  }

  selectUser(user: any) {
    this.selectedUser = { ...user };
  }
}
