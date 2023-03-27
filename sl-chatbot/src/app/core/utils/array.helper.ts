/**
 * [Delete first occurrence of an item from an array that contains certain text]
 * @param {[text]} string [Text that the string has to contain]
 * */
export function findSpecificItem(text: string, arr: any []){
  let found = -1;
  for (let i = 0; i < arr.length; i++){
    if (arr[i].text.includes('how can I')){
      found = i
      break
    }
  }
  arr.splice(found, 1)
}
