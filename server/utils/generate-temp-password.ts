const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";

function randomChar(chars: string) {
  return chars[Math.floor(Math.random() * chars.length)];
}

// 6 letras (a primeira maiúscula, as demais minúsculas) + 2 números.
export function generateTempPassword(): string {
  const firstLetter = randomChar(UPPERCASE);
  const restLetters = Array.from({ length: 5 }, () => randomChar(LOWERCASE)).join("");
  const digits = Array.from({ length: 2 }, () => randomChar(DIGITS)).join("");
  return `${firstLetter}${restLetters}${digits}`;
}
