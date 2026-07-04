const SESSION_EXPIRED_PATTERNS = [
  /token/i,
  /expired/i,
  /unauthorized/i,
  /authentication required/i,
];

const PERMISSION_PATTERNS = [/permission/i, /insufficient permissions/i, /forbidden/i];
const RESERVATION_PATTERNS = [
  /seat is not available/i,
  /seat was just reserved/i,
  /seat unavailable/i,
  /conflicting reservation/i,
  /no longer available/i,
  /already have an active reservation/i,
];

const matchesAny = (value, patterns) => patterns.some((pattern) => pattern.test(value));

export const getFriendlyErrorMessage = (error) => {
  const status = error?.status;
  const message = String(error?.message || '').trim();

  if (status === 401 || matchesAny(message, SESSION_EXPIRED_PATTERNS)) {
    return 'Session expired. Please log in again.';
  }

  if (status === 403 || matchesAny(message, PERMISSION_PATTERNS)) {
    return 'Permission denied.';
  }

  if (matchesAny(message, RESERVATION_PATTERNS)) {
    if (/already have an active reservation/i.test(message)) {
      return 'You already have an active reservation.';
    }
    return 'Seat No Longer Available';
  }

  if (status >= 500) {
    return 'Please Try Again';
  }

  if (/invalid/i.test(message) || /not found/i.test(message)) {
    return message;
  }

  return message || 'Something went wrong';
};
