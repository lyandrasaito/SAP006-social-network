import { register, redirect } from '../../services/index.js';

export default () => {
  const container = document.createElement('div');

  const template = `
        <div class="content flexBox">
            <div class="area flexBox borda">
                <h3 class="flexBox">Cadastro</h3>
                <img src="img/icon.png" class="icon"/> 
                <form class="flexBox" id="signUp">
                    <!--<input type="text" id="nome" class="field" placeholder="Nome: ">-->
                    <input type="email" id="email" class="field" placeholder="E-mail: " required />
                    <input type="password" id="senha" class="field" placeholder="Senha: " required />
                    <button type="submit" id="cadastrar" class="button">Cadastrar</button>                
                </form>
                <button id="back" class="button">Voltar</button>
            </div>
        </div>
    `;

  container.innerHTML = template;

  const signupForm = container.querySelector('#signUp');
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signUp['email'].value;
    const senha = signUp['senha'].value;

    console.log(email, senha);

    register(email, senha);
  });

  const goBack = container.querySelector('#back');
  goBack.addEventListener('click', (e) => {
    e.preventDefault();
    redirect();
  });

  return container;
};
