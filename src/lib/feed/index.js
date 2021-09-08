import { logout, postar } from '../../services/index.js';

export default () => {
  const container = document.createElement('div');

  const template = `
        <div class="content flexBox">
            <div class="area flexBox">
                <img src="img/icon.jpeg" width="30%" class="flexbox"/>
                <h3>Postar:</h3> 
                <form id="postForm" class="flexBox">
                    <input type="textarea" class="entradas" id="postText" required/>
                    <button type="submit" class="button">Enviar</button>
                    <button type="" id="logout" class="button">Sair</button>
                </form>

                <div class="post flexBox">
                  <h3 class="flexBox">Feed</h3>
                  <p id="posts" class=""> </p>
                </div>
            </div>
        </div>
    `;
  container.innerHTML = template;

  const posts = container.querySelector('#postForm');
  posts.addEventListener('submit', (e) => {
    const text = document.getElementById('postText').value;
    e.preventDefault();
    postar(text);

    loadPosts();

  });

  loadPosts();

  const showButtons = (post) => `
    <button class="buttonDel button" data-func="delete" data-delete="${post.id}">Apagar 🗑</button>
    <button class="buttonEdit button" data-func="edit" data-edit="${post.id}">Editar 🖊️</button>
`;

  function createPost(post) {
    // Cria div pro post
    const postElement = document.createElement('div');

    // configura id e classe
    postElement.id = post.id;
    postElement.className += "post";
    
    // configura conteudo 
    postElement.innerHTML = `
          <p class="listaPosts">
             <textarea class="txtArea entradas flexBox" disabled>${post.data().text} </textarea>
             <span> ❤ ${post.data().likes} | </span>
              ${post.data().data}
              ${post.data().email} 
              
              ${post.data().email === firebase.auth().currentUser.email ? showButtons(post) : ''}
          </p>
    `;

    // <div class="post" id='${post.id}'>
    // document.getElementById('posts').innerHTML
    //   += postTemplate;
    // ``

    // Adiciona listener para os botoes
    postElement.addEventListener('click', (event) => {
      // Botão Editar
      if (event.target.dataset.func === 'edit') {

        // Checa se o texto é editar ou salvar
        const toEdit = event.target.innerText === "Editar 🖊️";

        // Acessa textarea mais próximo
        const textArea = postElement.querySelector('.txtArea');

        // Se for "Editar"
        if (toEdit) {
          // Torna textarea editável  
          textArea.removeAttribute('disabled');
        } else { // Se for "Salvar"
          // Recupera id do post e texto do textarea
          const id = event.target.dataset.edit;
          const text = textArea.value;

          // confirma e altera
          const resultado = window.confirm("Deseja alterar o post selecionado?");
          if (resultado) editPost(id, text);
        }

        // inverte texto
        event.target.innerText = toEdit ? "Salvar ✅" : "Editar 🖊️";
      }

      if (event.target.dataset.func === 'delete') {
        const id = event.target.dataset.delete;
        const resultado = window.confirm("Deseja apagar o post selecionado?");
        if (resultado) deletePost(id);
      }

    });

    // const listDel = document.getElementsByClassName('buttonDel');
    // for (let del of listDel) {
    //   console.log("adicionei listener no deletar");

    //   del.addEventListener('click', (postDel))
    // };

    // function postDel() {
    //   const id = this.dataset.delete;
    //   deletePost(id);
    // };


    // const listEdit = document.getElementsByClassName('buttonEdit');
    // for (let edit of listEdit) {
    //   console.log("adicionei listener no editar");
    //   edit.addEventListener('click', (postUpdate))
    // };


    return postElement;
  };

  function postUpdate(e) {
    
  };

  function loadPosts() {
    const postsCollection = firebase.firestore().collection('posts');
    const banana = container.querySelector('#posts');
    postsCollection.orderBy('ord', 'desc').get().then(snap => {
      banana.innerHTML = '';

      // printa posts 
      snap.forEach(post => {
        const postElement = createPost(post);
        document.getElementById('posts').appendChild(postElement);
      });
    });
  }

  function deletePost(postId) {
    const postsCollection = firebase.firestore().collection('posts');
      postsCollection.doc(postId).delete().then(doc => {
        const postElement = document.getElementById(postId);
        postElement.remove();
        console.log('Post apagado.');
        // loadPosts();
      });
    
  }

  function editPost(id, newText) {
    const postsCollection = firebase.firestore().collection('posts');
    postsCollection.doc(id).update({
      text: newText,
    });
  };

  const sair = container.querySelector('#logout');
  sair.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });

  return container;
};