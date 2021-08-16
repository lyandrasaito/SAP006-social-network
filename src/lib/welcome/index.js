/*template strings e eventos das boas vindas*/

export default () => {
    const container = document.createElement('div');

    const template = `
        <div class="content flexBox">
            <!--<div class="mondrian">-->
                <div class="area flexBox borda">
                    <img src="img/icon.jpeg" width="30%"/> 
                    <img src="img/logo.jpeg" width="50%"/> 
                    <form class="flexBox">
                        <button type="button" id="cadastrar" class="button">Cadastre-se</button>
                        <button type="button" id="entrar" class="button">Login</button>
                    </form>
                </div>
            <!--</div>-->
        </div>
    `;
    container.innerHTML = template;

    const entrar = container.querySelector('#entrar');
    const cadastrar = container.querySelector('#cadastrar');

    entrar.addEventListener('click', () => {
        window.location.hash = '#login';
    });

    cadastrar.addEventListener('click', () => {
        window.location.hash = '#signup';
    });
    return container;
}

