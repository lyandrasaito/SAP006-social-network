import { cadastrar } from '../../services/index.js';

export default () => {
  const container = document.createElement('div');

  const template = `
        <div class="content flexBox">
            <div class="area flexBox">
                <h3 class="flexBox">Cadastro</h3>
                <img src="img/icon.jpeg" width="30%"/> 
                <form class="flexBox" id="signUp">
                    <!--<input type="text" id="nome" class="entradas" placeholder="Nome: ">-->
                    <input type="email" id="email" class="entradas" placeholder="E-mail: " required />
                    <input type="password" id="senha" class="entradas" placeholder="Senha: " required />
                    <button type="submit" id="cadastrar" class="button">Cadastrar</button>
                </form>
            </div>
        </div>
    `;

  container.innerHTML = template;

  const formCadastro = container.querySelector('#signUp');
  formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signUp['email'].value;
    const senha = signUp['senha'].value;

    console.log(email, senha);

    cadastrar(email, senha);
  });
  return container;
};
