const GMAIL_ADDRESS = /^[^\s@]+@gmail\.com$/i;

export function isGmailAddress(email: string): boolean {
  return GMAIL_ADDRESS.test(email.trim());
}
