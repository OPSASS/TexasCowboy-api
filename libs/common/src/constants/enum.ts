export enum StatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  APPROVED = 'APPROVED',
  UNAPPROVED = 'UNAPPROVED',
  LOCK = 'LOCK',
  PENDING = 'PENDING',
  CANCEL = 'CANCEL',
  REJECTED = 'REJECTED',
  SUCCESS = 'SUCCESS'
}

export enum VerifyStatusEnum {
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED'
}

export enum RoleEnum {
  USER = 0,
  MENTOR = 1,
  ADMIN = 2
}

export enum GenderEnum {
  MALE = 'MALE',
  FAMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum PermissionEnum {
  CREATE = 'CREATE',
  VIEW = 'VIEW',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  GRANT = 'GRANT'
}

export enum MenuEnum {
  HOME = 'HOME',

  USER = 'USER'
}

export enum EnrollEnum {
  MENTOR = 'MENTOR',
  STUDENT = 'STUDENT'
}

export enum ModelEnum {
  LESSON = 'LESSON',
  TOPIC = 'TOPIC',
  COURSE = 'COURSE',
  TEST = 'TEST',
  QUIZ = 'QUIZ',
  DOCUMENT = 'DOCUMENT',
  QUESTION = 'QUESTION',
  ANSWER = 'ANSWER',
  MENTOR = 'MENTOR'
}

export enum Action {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete'
}

export enum TenancyRegisterEnum {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  DISABLE = 'DISABLE'
}

export enum PaymentEnum {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL'
}

export enum TransactionEnum {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  CANCEL = 'CANCEL'
}

export enum VNPayResponseCodeEnum {
  SUCCESS = '00', // Giao dịch thành công
  FAIL = '01',
  PENDING = '07', // Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).
  ERROR = '09', // Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.
  LIMIT_REQUEST_ERROR = '10', // Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần
  CARD_BLOCKED = '12', // Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.
  WRONG_OTP = '13', // Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.
  CANCEL = '14', // Giao dịch không thành công do: Khách hàng hủy giao dịch.
  NOT_ENOUGH_MONEY = '51', //Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.
  EXCEEDED_DAY_LIMIT = '65', // Giao dịch không thành công do: Quý khách vượt quá hạn mức giao dịch trong ngày.
  BANK_MAINTENANCE = '75', // Giao dịch không thành công do: Ngân hàng đang bảo trì.
  WRONG_PASSWORD = '79', // Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch
  ERROR_OTHER = '99' // Giao dịch không thành công do: Lỗi hệ thống
}

export enum PaymentResponseTextEnum {
  SUCCESS = 'Giao dịch thành công',
  FAIL = 'Giao dịch thất bại',
  PENDING = 'Giao dịch bị nghi ngờ',
  ERROR = 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
  LIMIT_REQUEST_ERROR = 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
  CARD_BLOCKED = 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
  WRONG_OTP = 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
  CANCEL = 'Giao dịch không thành công do: Khách hàng hủy giao dịch.',
  NOT_ENOUGH_MONEY = 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
  EXCEEDED_DAY_LIMIT = 'Giao dịch không thành công do: Quý khách vượt quá hạn mức giao dịch trong ngày.',
  BANK_MAINTENANCE = 'Giao dịch không thành công do: Ngân hàng đang bảo trì.',
  WRONG_PASSWORD = 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
  ERROR_OTHER = 'Giao dịch không thành công do: Lỗi hệ thống'
}
