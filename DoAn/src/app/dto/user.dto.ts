export class Role {
    id: number;
    name: string;
  
    constructor(id: number, name: string) {
      this.id = id;
      this.name = name;
    }
  }
  
  export class Authority {
    authority: string;
  
    constructor(authority: string) {
      this.authority = authority;
    }
  }
  
  export class UserDto {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    country: string;
    state: string | null;
    address: string;
    phone: string;
    verificationCode: string | null;
    enable: boolean;
    createAt: string;  // Nếu bạn muốn làm việc với đối tượng Date, bạn có thể thay đổi kiểu dữ liệu thành `Date`
    role: Role;
    enabled: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    accountNonExpired: boolean;
    authorities: Authority[];
  
    constructor(
      id: number,
      username: string,
      email: string,
      firstName: string,
      lastName: string,
      password: string,
      country: string,
      state: string | null,
      address: string,
      phone: string,
      verificationCode: string | null,
      enable: boolean,
      createAt: string,
      role: Role,
      enabled: boolean,
      accountNonLocked: boolean,
      credentialsNonExpired: boolean,
      accountNonExpired: boolean,
      authorities: Authority[]
    ) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.password = password;
      this.country = country;
      this.state = state;
      this.address = address;
      this.phone = phone;
      this.verificationCode = verificationCode;
      this.enable = enable;
      this.createAt = createAt;
      this.role = role;
      this.enabled = enabled;
      this.accountNonLocked = accountNonLocked;
      this.credentialsNonExpired = credentialsNonExpired;
      this.accountNonExpired = accountNonExpired;
      this.authorities = authorities;
    }
  }
  