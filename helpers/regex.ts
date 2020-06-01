export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/

// must have a number
const NUM_REGEX = /(?=.*\d).{8,}/
// must have a lowercase letter
const CHAR_LOWER_REGEX = /(?=.*[a-z])/
// must have an uppercase letter
const CHAR_UPPER_REGEX = /(?=.*[A-Z])/
// must have a special character, ie not a number or letter (or space)
const CHAR_SPECIAL_REGEX = /(?=.*[^a-zA-Z0-9 ]).{8,}/
// can't have spaces
const NO_SPACES_REGEX = /^(?!.*\s).{8,}$/
// at least 8 chars
const MIN_CHARS_REGEX = /.{8,}/

export const PasswordRequirements = {
  minLen: (value: string) =>
    MIN_CHARS_REGEX.test(value) || 'Must have at least 8 characters',
  hasLowerChar: (value: string) =>
    CHAR_LOWER_REGEX.test(value) || 'Must have a lower-case letter',
  hasUpperChar: (value: string) =>
    CHAR_UPPER_REGEX.test(value) || 'Must have a upper-case letter',
  hasSpecialChar: (value: string) =>
    CHAR_SPECIAL_REGEX.test(value) || 'Must have a special character',
  hasNum: (value: string) => NUM_REGEX.test(value) || 'Must have a number',
  hasNoSpaces: (value: string) =>
    NO_SPACES_REGEX.test(value) || "Can't have any spaces",
}
