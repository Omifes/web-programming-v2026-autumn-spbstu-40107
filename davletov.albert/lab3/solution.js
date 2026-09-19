export function removeDuplicates(arr) {
  let myArr = new Array();

  for (const num of arr) {
    if (myArr.includes(num) === false) {
      myArr.push(num);
    }
  }

  return myArr;
}