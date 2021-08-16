/*template strings e eventos do feed*/

export default () => {
    const container = document.createElement('div');

    const template = `
        <div class="content flexBox">
        <div class="area flexBox">
            <h3 class="flexBox">Feed</h3>
            <img src="img/icon.jpeg" width="30%"/> 
             
        </div>
        </div>
    `;

    container.innerHTML = template;

    return container;
}