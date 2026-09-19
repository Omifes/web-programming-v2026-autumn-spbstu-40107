export function removeDuplicates(arr) {
  const myArr = [];

  for (const num of arr) {
    if (myArr.includes(num) === false) {
      myArr.push(num);
    }
  }

  return myArr;
}
