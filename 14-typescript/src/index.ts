import {join} from 'lodash';
import svg from './svg.svg';

function component() {
    var element = document.createElement('div');
    var img = document.createElement('img');
    img.src = svg;

    element.innerHTML = join(['Hello', 'webpack'], ' ');

    element.appendChild(img);

    return element;
}

document.body.appendChild(component());