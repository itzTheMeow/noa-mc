import noa from "./index";

export default function onRemovePointerLock(func: Function, keep: boolean = true) {
  let checkLockInt = setInterval(function () {
    if (!noa.container.hasPointerLock) {
      clearInterval(checkLockInt);
      func();
      if (keep) onRemovePointerLock(func);
    }
  }, 1);
}
