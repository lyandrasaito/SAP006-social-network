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
    <button class="buttonDel button" data-delete="${post.id}">Apagar</button>
    <button class="buttonEdit button" data-edit="${post.id}">Editar</button>
`;

  function printPosts(post) {
    const postTemplate =
      `
        <div class="post" id='${post.id}'>
              <p id='${post.id}' class="listaPosts">
                 <textarea class="txtArea entradas flexBox" disabled>${post.data().text} </textarea>
                 <span> ❤ ${post.data().likes} | </span>
                  ${post.data().data}
                  ${post.data().email} 
                  
                  ${post.data().email === firebase.auth().currentUser.email ? showButtons(post) : ''}
                  
              </p>
        </div>     
        `
    document.getElementById('posts').innerHTML
      += postTemplate;
    ``

    const listDel = document.getElementsByClassName('buttonDel');
    for (let del of listDel) {
      del.addEventListener('click', (postDel))
    };
    function postDel() {
      const id = this.dataset.delete;
      deletePost(id);
    };


    const listEdit = document.getElementsByClassName('buttonEdit');
    for (let edit of listEdit) {
      edit.addEventListener('click', (postUpdate))
    };

    /*
    function postUpdate() {
      const id = this.dataset.edit;

      const txtArea = document.getElementsByClassName('txtArea');
      for (let area of txtArea) {
        area.removeAttribute('disabled');
        
      };
    };*/

    function postUpdate(e) {
      const toEdit = e.target.innerText === "Editar";

      // Recupera <p> parent
      const parent = e.target.parentNode;
      // Acessa textarea mais próximo
      const textArea = parent.querySelector('.txtArea');

      if (toEdit) {
        // Torna textarea editável  
        textArea.removeAttribute('disabled');
      } else {
        // recupera id e texto do textarea
        const id = e.target.dataset.edit;
        const text = textArea.value;

        // confirma e altera
        const resultado = window.confirm("Deseja alterar o post selecionado?");
        if (resultado) editPost(id, text);
      }

      // inverte texto
      e.target.innerText = toEdit ? "Salvar" : "Editar";
    };
  

  };

  function loadPosts() {
    const postsCollection = firebase.firestore().collection('posts');
    const banana = container.querySelector('#posts');
    postsCollection.orderBy('ord', 'desc').get().then(snap => {
      banana.innerHTML = '';
      snap.forEach(post => {
        printPosts(post);
      });
    });
  }

  function deletePost(postId) {
    const postsCollection = firebase.firestore().collection('posts');
    const resultado = window.confirm("Deseja apagar o post selecionado?");
    if (resultado) {
      postsCollection.doc(postId).delete().then(doc => {
        console.log('Post apagado.');
        loadPosts();
      });
    } else {
      return false;
    }
  }

  function editPost(id, newText) {
    const postsCollection = firebase.firestore().collection('posts');
    postsCollection.doc(id).update({
      text: newText,
    })
      .then(() => {
        true;
        loadPosts();
      }
      )
      .catch((error) => error)
  };

  const sair = container.querySelector('#logout');
  sair.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });

  return container;
};