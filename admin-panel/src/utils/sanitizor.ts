import validator from "validator";

//sanitize email
export const sanitizeEmail = (email: string): string => {
  const normalized = validator.normalizeEmail(email, {
    all_lowercase: true,
    gmail_remove_dots: false,
  });

  if (!normalized || !validator.isEmail(normalized)) {
    throw new Error("Invalid email format");
  }

  return normalized;
};

//sanitize string
export const sanitizeString = (value: string): string => {
  return validator.escape(validator.trim(value));
};

export const sanitizeNumber = (value: unknown): number => {
  const strValue = String(value);
  const trimmed = validator.trim(strValue);
  return validator.isNumeric(trimmed, { no_symbols: true })
    ? Number(trimmed)
    : 0;
};
