import printMe from './print.js';
import { file, parse } from './globals.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registered failed: ', registrationError);
    });
  });
}

function component() {
  var element = document.createElement('div');

  element.innerHTML = join(['Hello', 'webpack'], ' ');

  // Assume we are in the context of `window`
  // this.alert('Hmmm, this probably isn\'t a great idea...')

  console.log(file);

  parse();

  printMe();

  return element;
}

document.body.appendChild(component());
