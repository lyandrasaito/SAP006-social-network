import { entrar, logarGoogle, redirect } from '../../services/index.js';

export default () => {
  const container = document.createElement('div');

  const template = `
        <div class="content flexBox">
            <div class="area flexBox">
                <h3 class="flexBox">Login</h3>
                <img src="img/icon.jpeg" width="30%"/> 
                <form class="flexBox" id="loginForm">
                    <input type="email" id="email" class="field" placeholder="E-mail: ">
                    <input type="password" id="senha" class="field" placeholder="Senha: ">
                    <button type="submit" class="button" id="entrar">Entrar</button>
                </form>
                <button class="button" id="google">Google</button>
                <button id="back" class="button">Voltar</button>
            </div>
        </div>
    `;

  container.innerHTML = template;

  const formLogin = container.querySelector('#loginForm');
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = loginForm['email'].value;
    const senha = loginForm['senha'].value;

    entrar(email, senha);

    console.log(email, senha);
  });

  const google = container.querySelector('#google');
  google.addEventListener('click', (e) => {
    e.preventDefault();
    logarGoogle();
  });

  const goBack = container.querySelector('#back');
  goBack.addEventListener('click', (e) => {
    e.preventDefault();
    redirect();
  })

  return container;
};
