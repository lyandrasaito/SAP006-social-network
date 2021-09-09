import { logout, postar, redirect } from '../../services/index.js';

export default () => {

  const container = document.createElement('div');
  let unsubscribe, authUnsubscribe;

  // onAuthStateChanged adiciona um observador para alterações no estado de login do usuário.
  authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
    // Se o user estiver logado, renderiza 
    if (user) {
      const template = `
        <div class="content flexBox">
            <div class="area flexBox">
                <img src="img/icon.jpeg" width="30%" class="flexbox"/>
                <h3>Postar:</h3> 
                <form id="postForm" class="flexBox">
                    <input type="textarea" class="field" id="postText" required/>
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

        // loadPosts();

      });

      // Carrega posts
      loadPosts();

      const showButtons = (post) => `
    <button class="buttonDel button" data-func="delete" data-delete="${post.id}">Apagar 🗑</button>
    <button class="buttonEdit button" data-func="edit" data-edit="${post.id}">Editar 🖊️</button>
`;

      function printPosts(post) {

        // Cria div para o post
        const postElement = document.createElement('div');

        // configura id e classe
        postElement.id = post.id;
        postElement.className += "post";

        // configura conteudo 
        postElement.innerHTML = `
          <p class="listaPosts">
             <textarea class="txtArea field flexBox" disabled>${post.text} </textarea>
             <span> ❤ ${post.likes} | </span>
              ${post.data}
              ${post.email} 
              
              ${post.email === firebase.auth().currentUser.email ? showButtons(post) : ''}
          </p>
    `;

        // Adiciona listener para os botões
        postElement.addEventListener('click', (event) => {
          // Botão Editar
          if (event.target.dataset.func === 'edit') {

            // Checa se o texto é editar ou salvar
            const toEdit = event.target.innerText === "Editar 🖊️";

            // Acessa textarea 
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

            // Inverte texto
            event.target.innerText = toEdit ? "Salvar ✅" : "Editar 🖊️";
          }

          // Verifica se o dataset é delete
          if (event.target.dataset.func === 'delete') {
            const id = event.target.dataset.delete;
            // Solicita confirmação do user
            const resultado = window.confirm("Deseja apagar o post selecionado?");
            // Se confimado, chama a função de deletar o post, passando o id
            if (resultado) deletePost(id);
          }

        });

        return postElement;
      };


      function loadPosts() {
        unsubscribe = firebase.firestore().collection('posts').orderBy('ord', 'asc')
          .onSnapshot((querySnapshot) => {
            console.log("called");
            querySnapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                // Recupera dados do post adicionado
                const data = change.doc.data();
                // Seta Id para ser acessado na função printPosts
                data.id = change.doc.id;
                // Cria post no template
                const postElement = printPosts(data);
                // Adiciona POST no começo do feed (template)
                document.getElementById('posts').prepend(postElement);
              } else if (change.type === "removed") {
                // recupera id do post removido
                const id = change.doc.id;
                // Encontra o post com o id recuperado no DOM 
                const post = document.getElementById(id);
                // Remove o post do id referido do DOM (template)
                post.remove();
              } else if (change.type === "modified") {
                // Recupera id do post modificado
                const id = change.doc.id;
                // Novo texto
                const newText = change.doc.data().text;
                // Encontra o post com o id recuperado no DOM
                const post = document.getElementById(id);
                // Encontra textarea e atualiza o texto
                const textArea = post.querySelector(".txtArea");
                textArea.value = newText;
              }
            });
          });
      };

      function deletePost(postId) {
        const postsCollection = firebase.firestore().collection('posts');
        postsCollection.doc(postId).delete().then(doc => {
          const postElement = document.getElementById(postId);
          // postElement.remove();
          console.log('Post apagado.');
          // loadPosts();
        });
      };

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
        // Listeners escutam a página até segunda ordem. Ao fazer o logout, 
        // chamamos unsubscribe() e authUnsubscribe() para que os
        // listeners do firebase retornem seu método unsubscribe interno
        // https://cloud.google.com/firestore/docs/samples/firestore-listen-detach#firestore_listen_detach-nodejs
        unsubscribe();
        authUnsubscribe();
      });

    } else {
      // Se o user não estiver logado, redireciona
      redirect();
    }

  });

  return container;

};
