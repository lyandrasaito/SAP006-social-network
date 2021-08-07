/*template strings e eventos das boas vindas*/

export default () => {
    const container = document.createElement('div');

    const template = `
    <h1>Boas vindas</h1>
    <button type="button" id="entrar">Entrar</button>
    <button type="button" id="cadastrar">Cadastrar</button>
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

