import welcome from './lib/welcome/index.js';
import login from './lib/login/index.js';
import signup from './lib/signup/index.js';
import feed from './lib/feed/index.js';

const main = document.querySelector('#root');

const init = () => {
  main.innerHTML = '';
  switch (window.location.hash) {
    case ' ':
      main.appendChild(welcome());
      break;
    case '#login':
      main.appendChild(login());
      break;
    case '#signup':
      main.appendChild(signup());
      break;
    case '#feed':
      main.appendChild(feed());
      break;
    case '#welcome':
      main.appendChild(welcome());
      break;
    default:
      main.appendChild(welcome());
  }
};

window.addEventListener('load', init);
window.addEventListener('hashchange', init);
