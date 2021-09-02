/*Template strings e eventos do cadastro*/

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

    //Escutando o submit do formulário
    const formCadastro = container.querySelector('#signUp');
    formCadastro.addEventListener('submit', (e) => {
        e.preventDefault();
        //Pegar o input do formulário (id="signUp") e acessar o id do input e-mail
        const email = signUp['email'].value;
        const senha = signUp['senha'].value;

        //print
        console.log(email, senha);

        //chamando a função cadastrar e passando email e senha coletados nos inputs
        cadastrar(email, senha);

    });

    //Criando usuários temporariamente no index. Passar a função para o services posteriormente.
    function cadastrar(email, senha) {
        firebase.auth().createUserWithEmailAndPassword(email, senha).then((credencial) => {
            //comandos executados caso 'createUserWithEmailAndPassword' dê certo
            console.log(credencial.user);
            window.location.hash = '#feed';
        }).catch((error) => {
            //https://firebase.google.com/docs/reference/js/firebase.auth.Auth
            //comandos executados caso 'createUserWithEmailAndPassword' não dê certo
            const errorCode = error.code;
            if (errorCode === 'auth/weak-password') {
                alert('Insira uma senha com, no mínimo, 6 caracteres');
            } else if (errorCode === 'auth/invalid-email') {
                alert('Formato de e-mail inválido');
            } else if (errorCode === 'auth/email-already-in-use') {
                alert('E-mail já cadastrado');
            } else {
                alert('Algo deu errado, verifique seus dados');
            }
        });
    }
    return container;
}