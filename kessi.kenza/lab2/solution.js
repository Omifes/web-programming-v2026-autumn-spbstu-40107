export function countVowels(str) {
  // Check if the input is not a string
  if (typeof str !== 'string') {
    return 0;
  }

  const vowels = ['a', 'e', 'i', 'o', 'u'];

  return str
    .toLowerCase()
    .split('')
    .filter((char) => vowels.includes(char)).length;
}
