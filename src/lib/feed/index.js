import { logout, postar, redirect } from '../../services/index.js';

export default () => {

  const db = firebase.firestore();
  const postsRef = db.collection("posts");

  const likePost = (userId, postId) => {
    // Referência do post
    const postRef = postsRef.doc(postId);

    // In a transaction, add the new rating and update the aggregate totals
    // Em uma transação, adiciona o like e atualiza o total agregado
    // https://firebase.google.com/docs/firestore/solutions/aggregation?hl=pt
    return db.runTransaction((transaction) => {

      return transaction.get(postRef).then((res) => {
        if (!res.exists) {
          throw "Post não existe!";
        }

        // Computa novo número de likes
        const newNumLikes = (res.data().numLikes || 0) + 1;

        // Commit para o Firestore
        transaction.update(postRef, {
          numLikes: newNumLikes,
        });

        transaction.set(postRef, { likes: { [userId]: true } }, { merge: true });
      });
    });
  };

  const unlikePost = (userId, postId) => {
    // Referência do post
    const postRef = postsRef.doc(postId);



    // Em uma transação, adiciona o like e atualiza o total agregado
    return db.runTransaction((transaction) => {
      return transaction.get(postRef).then((res) => {
        if (!res.exists) {
          throw "Post não existe!";
        }

        // Computa novo número de likes
        const newNumLikes = (res.data().numLikes) - 1;

        // Commit para o Firestore
        transaction.update(postRef, {
          numLikes: newNumLikes,
        });
        //https://firebase.google.com/docs/firestore/solutions/aggregation?hl=pt
        transaction.update(postRef, { likes: { [userId]: false } });
      });
    });
  };



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

      const showButtons = (postId) => `
      <button class="buttonDel button" data-func="delete" data-delete="${postId}">Apagar 🗑</button>
      <button class="buttonEdit button" data-func="edit" data-edit="${postId}">Editar 🖊️</button>
  `;

      function printPost(post) {
        const user = firebase.auth().currentUser;
        const postId = post.id;
        const isOwner = post.email === user.email;
        const userLiked = post.likes[user.uid];

        // Cria div para o post
        const postElement = document.createElement('div');

        // configura id e classe
        postElement.id = post.id;
        postElement.className += "post";

        // configura conteudo 
        postElement.innerHTML = `
          <p class="listaPosts">
             <textarea class="txtArea field flexBox" disabled>${post.text} </textarea>
              ${post.data}
              ${post.email} 

              <span ><span class="no-likes">${post.numLikes || 0}</span> <button data-func="${userLiked ? "unlike" : "like"}"  class="like_btn" style="color: ${userLiked ? "gray" : "red"}">❤</button> | </span>

              ${isOwner ? showButtons(post) : ''}
          </p>
    `;

        // Adiciona listener para os botões
        postElement.addEventListener("click", (event) => {
          // Botão Editar
          if (event.target.dataset.func === "edit") {
            // Checa se o texto é editar ou salvar
            const toEdit = event.target.innerText === "Editar 🖊️";

            // Acessa textarea
            const textArea = postElement.querySelector(".txtArea");

            // Se for "Editar"
            if (toEdit) {
              // Torna textarea editável
              textArea.removeAttribute("disabled");
            } else {
              // Se for "Salvar"
              // Recupera id do post e texto do textarea
              const text = textArea.value;

              // confirma e altera
              const resultado = window.confirm("Deseja alterar o post selecionado?");
              if (resultado) editPost(postId, text);
            }

            // Inverte texto
            event.target.innerText = toEdit ? "Salvar ✅" : "Editar 🖊️";
          }

          // Verifica se o dataset é delete
          if (event.target.dataset.func === "delete") {
            // Solicita confirmação do user
            const resultado = window.confirm("Deseja apagar o post selecionado?");
            // Se confimado, chama a função de deletar o post, passando o id
            if (resultado) deletePost(postId);
          }

          if (event.target.dataset.func === "like") {
            likePost(user.uid, postId);
          }

          if (event.target.dataset.func === "unlike") {
            unlikePost(user.uid, postId);
          }

        });

        return postElement;
      };


      function loadPosts() {
        unsubscribe = firebase.firestore().collection('posts').orderBy('ord', 'asc')
          .onSnapshot((querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                // Recupera dados do post adicionado
                const data = change.doc.data();
                // Seta Id para ser acessado na função printPost
                data.id = change.doc.id;
                // Cria post no template
                const postElement = printPost(data);
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



                // novo texto
                const userId = firebase.auth().currentUser.uid;

                const numLikes = change.doc.data().numLikes || 0;
                const userLiked = change.doc.data().likes[userId];

                // encontra o post no DOM


                // encontra textarea e atualiza o texto

                const numLikesSpan = post.querySelector(".no-likes");
                const likeBtn = post.querySelector(".like_btn");

                // remove data-attribute e adiciona inverso
                // delete likeBtn.dataset[userLiked ? "like" : "unlike"];
                likeBtn.dataset.func = userLiked ? "unlike" : "like";

                // altera cor
                likeBtn.style.color = (userLiked ? "gray" : "red");

                numLikesSpan.textContent = numLikes;

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
