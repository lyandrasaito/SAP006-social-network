/*template strings e eventos do feed*/ 

export default () => {
    const container = document.createElement('div');

    const template = `
    <h1>Feed</h1>
    `;

    container.innerHTML = template;

    return container;
}