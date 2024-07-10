export interface UserAttributeI {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ResetUserPassword {
  password: string;
  confirmPassword: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
