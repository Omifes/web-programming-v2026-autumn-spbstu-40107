export function removeDuplicates(arr) {
  let myArr = [];

  for (const num of arr) {
    if (myArr.includes(num) === false) {
      myArr.push(num);
    }
  }

  return myArr;
}
