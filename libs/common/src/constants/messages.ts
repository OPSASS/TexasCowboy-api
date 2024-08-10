export enum Message {
  INVALID_PASSWORD = 'The password is incorrect',
  INACTIVE_ACCOUNT = 'The account is not active',
  INVALID_EMAIL = 'The email address format is incorrect',
  INVALID_PHONE_NUMBER = 'The phone number format is incorrect',
  PASSWORD_NOT_MATCH = 'The passwords do not match',
  PASSWORD_ERROR = 'The password must include uppercase, lowercase letters, numbers, and special characters',
  ACCOUNT_EXISTED = 'The email address or phone number already exists',
  MAJOR_EXISTED = 'The subject information already exists',
  ACTIVATION_CODE_EXISTED = 'The activation code already exists',
  EMAIL_NOT_FOUND = 'Email address not found. Please use a valid email address!'
}
