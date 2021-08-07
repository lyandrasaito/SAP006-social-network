/*template strings e eventos do cadastro*/ 

export default () => {
    const container = document.createElement('div');

    const template = `
    <h1>Cadastro</h1>
    <form>
        <input type="text" id="nome" class="" placeholder="Nome: ">
        <input type="email" id="email" class="" placeholder="E-mail: ">
        <input type="password" id="senha" class="" placeholder="Senha: ">
        <button type="button" id="cadastrar">Cadastrar</button>
    </form>
    `;

    container.innerHTML = template;

    const cadastrar = container.querySelector('#cadastrar');
    cadastrar.addEventListener('click', () => {
        window.location.hash = '#feed';
    });
    return container;
}