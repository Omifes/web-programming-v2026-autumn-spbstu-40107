export function countVowels(str) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  if (typeof str !== 'string') {
    return 0;
  }
  return str
    .toLowerCase()
    .split('')
    .filter((char) => vowels.includes(char)).length;
}
