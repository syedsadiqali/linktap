function getItem(key: string) {
  return window && window.localStorage.getItem(key);
}

function setItem(key: string, value: string) {
  return window && window.localStorage.setItem(key, value);
}


export {getItem, setItem}