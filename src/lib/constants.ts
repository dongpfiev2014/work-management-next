export const PasswordPatternRule = {
  pattern:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
  message:
    "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be between 8 and 16 characters long.",
};

const PasswordInputRule = {
  required: true,
  message: "Please input your password!",
};

const PasswordLowerPatternRule = {
  pattern: /^(?=.*[a-z])/,
  message: "Password must contain at least one lowercase letter.",
};

const PasswordUpperCaseRule = {
  pattern: /^(?=.*[A-Z])/,
  message: "Password must contain at least one uppercase letter.",
};

const PasswordNumberRule = {
  pattern: /^(?=.*\d)/,
  message: "Password must contain at least one number.",
};

const PasswordSpecialCharRule = {
  pattern: /^(?=.*[@$!%*?&])/,
  message:
    "Password must contain at least one special character (@, $, !, %, *, ?, &).",
};

const PasswordLengthRule = {
  min: 8,
  max: 16, // Tối đa 16 ký tự
  message: "Password must be between 8 and 16 characters long.",
  required: true,
};

export const PasswordPatternRules = [
  PasswordInputRule,
  PasswordLowerPatternRule,
  PasswordUpperCaseRule,
  PasswordNumberRule,
  PasswordSpecialCharRule,
  PasswordLengthRule,
];
