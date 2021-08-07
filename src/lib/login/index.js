/*template strings e eventos do login*/
export default () => {
    const container = document.createElement('div');

    const template = `
    <h1>Login</h1>
    <form>
        <input type="email" id="email" class="" placeholder="E-mail: ">
        <input type="password" id="senha" class="" placeholder="Senha: ">
        <button type="button" id="entrar">Entrar</button>
    </form>
    `;

    container.innerHTML = template;

    const entrar = container.querySelector('#entrar');
    entrar.addEventListener('click', () => {
        window.location.hash = '#feed';
    });
    return container;
}