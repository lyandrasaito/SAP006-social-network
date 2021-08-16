/*template strings e eventos do login*/
export default () => {
    const container = document.createElement('div');

    const template = `
        <div class="content flexBox">
            <div class="area flexBox">
                <h3 class="flexBox">Login</h3>
                <img src="img/icon.jpeg" width="30%"/> 
                <form class="flexBox" id="loginForm">
                    <input type="email" id="email" class="entradas" placeholder="E-mail: ">
                    <input type="password" id="senha" class="entradas" placeholder="Senha: ">
                    <button type="submit" class="button" id="entrar">Entrar</button>
                </form>
                <button type="" class="button" id="google">Google</button>
            </div>
        </div>
    `;

    container.innerHTML = template;

    /*
    const entrar = container.querySelector('#entrar');
    entrar.addEventListener('click', () => {
        window.location.hash = '#feed';
    });*/


    //Escutando o submit do formulário
    const formLogin = container.querySelector('#loginForm');
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();

        //Pegar o input do formulário (id="signUp") e acessar o id do input e-mail
        //const nome = signUp['nome'].value;
        const email = loginForm['email'].value;
        const senha = loginForm['senha'].value;

        entrar(email, senha);

        //print
        console.log(email, senha);
    });

    //Logando usuários temporariamente no index.Passar a função para o services posteriormente.
    function entrar(email, senha) {
        firebase.auth().signInWithEmailAndPassword(email, senha).then((credencial) => {
            console.log(credencial.user);
            console.log("Logado");
            window.location.hash = '#feed';
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert("Verifique se inseriu corretamente seu e-mail e senha");
        });
    }




    //https://firebase.google.com/docs/auth/web/google-signin?hl=pt-br
    const google = container.querySelector('#google');
    google.addEventListener('click', (e) => {
        e.preventDefault();
        logarGoogle();
    });

    function logarGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                const credential = result.credential;
                console.log("Logado com Google");
                window.location.hash = '#feed';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                alert("Verifique se inseriu corretamente seu e-mail e senha!");
            });
    }



    return container;
}