import printMe from './print.js';
import { file, parse } from './globals.js';


function component() {
  var element = document.createElement('div');

  element.innerHTML = join(['Hello', 'webpack'], ' ');

  // Assume we are in the context of `window`
  this.alert('Hmmm, this probably isn\'t a great idea...')

  console.log(file);

  parse();

  printMe();

  return element;
}

document.body.appendChild(component());