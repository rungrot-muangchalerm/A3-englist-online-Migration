function blink() {
  const blinks = document.getElementsByTagName('blink');
  for (let i = blinks.length - 1; i >= 0; i -= 1) {
    const item = blinks[i];
    item.style.visibility = item.style.visibility === 'visible' ? 'hidden' : 'visible';
  }
  window.setTimeout(blink, 1000);
}

if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', blink, false);
} else if (window.addEventListener) {
  window.addEventListener('load', blink, false);
} else if (window.attachEvent) {
  window.attachEvent('onload', blink);
} else {
  window.onload = blink;
}
