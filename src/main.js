// Este é o ponto de entrada da sua aplicação
/*porta de entrada da aplicação: importar todas as funções, no html chama-se apenas o main*/
/*render da página de acordo com a rota*/

import welcome from "./lib/welcome/index.js";
import login from "./lib/login/index.js";
import signup from "./lib/signup/index.js";
import feed from "./lib/feed/index.js";

const main = document.querySelector("#root");

const init = () => {
    /*window.addEventListener("hashchange", () => { */
    main.innerHTML = "";
    /*limpar o main a cada load*/
    switch (window.location.hash) {
        case " ":
            main.appendChild(welcome());
            break;
        case "#login":
            main.appendChild(login());
            break;
        case "#signup":
            main.appendChild(signup());
            break;
        case "#feed":
            main.appendChild(feed());
            break;
        default:
            main.appendChild(welcome());
    }
};

/*
window.addEventListener("load", () => {
    main.appendChild(welcome());
    init();
})
*/

/*window: objeto javascript que representa a janela do navegador*/
/*load: carregamento da janela*/
/*chamar o init pra verificar toda vez que a tela for alterada ou o hash*/
window.addEventListener('load', init);
window.addEventListener('hashchange', init);