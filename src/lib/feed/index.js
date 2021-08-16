/*template strings e eventos do feed*/

export default () => {
    const container = document.createElement('div');

    const template = `
        <div class="content flexBox">
            <div class="area flexBox">
                <h3 class="flexBox">Feed</h3>
                <img src="img/icon.jpeg" width="30%"/> 
                <button type="" id="logout" class="button">Sair</button>
            </div>
        </div>
    `;

    container.innerHTML = template;

    //função de logout temporariamente alocada aqui. Passar para o services posteriormente.
    const logout = container.querySelector('#logout');
    logout.addEventListener('click', (e) => {
        e.preventDefault();
        firebase.auth().signOut().then(() => {
            console.log("O usuário fez logout.")
        });
    });

    return container;
}