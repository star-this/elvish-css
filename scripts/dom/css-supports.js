export function cssSuports(cssProperty, classPropertyFlag) {
  var root = document.documentElement; // <html>

  if (cssProperty in root.style) {
    root.classList.add(classPropertyFlag);
    return true;
  } else {
    root.classList.add(`no-${classPropertyFlag}`);
    return false;
  }
}
