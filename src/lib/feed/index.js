import {
  logout, sendPost, redirect, likePost, unlikePost, deletePost, editPost,
} from '../../services/index.js';

export default () => {
  const container = document.createElement('div');

  let unsubscribe;

  const authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const template = `
        <div class="contentFeed flexBox">
            <div class="area flexBox">
                <img src="img/icon.png" class="icon"/>
                <h2>Compartilhe sua arte: </h2> 
                <form id="postForm" class="flexBox">
                    <input type="textarea" class="typePost" id="postText" required/>
                    <h4>Envie uma imagem (opcional): </h4>
                    <input type="file" class="field" id="file" />
                    <button type="submit" class="button">Enviar</button>
                    <button type="" id="logout" class="button">Sair</button>
                </form>
                <div class="postsArea ">
                  <h3 class="flexBox">Feed</h3>
                  <p id="posts" class="flexBox"> </p>
                </div>
            </div>
        </div>
    `;
      container.innerHTML = template;

      let file;

      const posts = container.querySelector('#postForm');
      const image = container.querySelector('#file');
      image.onchange = function (event) {
        file = event.target.files[0];
      };

      posts.addEventListener('submit', (e) => {
        const text = document.getElementById('postText').value;
        e.preventDefault();
        sendPost(text, file);
        file = undefined;
      });

      loadPosts();

      const showButtons = (postId) => `
      <button class="buttonDel" data-func="delete" data-delete="${postId}">Apagar 🗑</button>
      <button class="buttonEdit" data-func="edit" data-edit="${postId}">Editar 🖊️</button>
  `;

      function printPost(post) {
        const user = firebase.auth().currentUser;
        const postId = post.id;
        const isOwner = post.email === user.email;
        const userLiked = post.likes[user.uid];

        const postElement = document.createElement('div');

        postElement.id = post.id;
        postElement.className += "posts";

        postElement.innerHTML = `
          <dl class="flexBox">
             <textarea class="txtArea flexBox" disabled>${post.text}</textarea>
             <dt class="flexBox">${post.data}</dt>
             <dt class="flexBox">${post.email} </dt>
             <dt class="flexBox">${post.imageUrl ? `<img class="imgPost flexBox" src='${post.imageUrl}'` : ""} </dt>
              <span ><span class="no-likes">${post.numLikes || 0}</span> <button data-func="${userLiked ? "unlike" : "like"}"  class="like_btn" style="color: ${userLiked ? "red" : "white"}">❤</button> </span>
              ${isOwner ? showButtons(post) : ''}
              
          </dl>
    `;

        postElement.addEventListener("click", (event) => {
          event.preventDefault();

          if (event.target.dataset.func === "edit") {
            const toEdit = event.target.innerText === "Editar 🖊️";
            const textArea = postElement.querySelector(".txtArea");
            if (toEdit) {
              textArea.removeAttribute("disabled");
            } else {
              const text = textArea.value;
              const resultado = window.confirm("Deseja alterar o post selecionado?");
              if (resultado) editPost(postId, text);
            };
            event.target.innerText = toEdit ? "Salvar ✅" : "Editar 🖊️";
          };

          if (event.target.dataset.func === "delete") {
            const resultado = window.confirm("Deseja apagar o post selecionado?");
            if (resultado) deletePost(postId);
          };

          if (event.target.dataset.func === "like") {
            likePost(user.uid, postId);
          };

          if (event.target.dataset.func === "unlike") {
            unlikePost(user.uid, postId);
          };

        });
        return postElement;
      };

      function loadPosts() {
        unsubscribe = firebase.firestore().collection('posts').orderBy('ord', 'asc')
          .onSnapshot((querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {

              if (change.type === "added") {
                const data = change.doc.data();
                data.id = change.doc.id;
                const postElement = printPost(data);
                document.getElementById('posts').prepend(postElement);
              } else if (change.type === "removed") {
                const id = change.doc.id;
                const post = document.getElementById(id);
                post.remove();
              } else if (change.type === "modified") {
                const id = change.doc.id;

                const newText = change.doc.data().text;

                const post = document.getElementById(id);

                const textArea = post.querySelector(".txtArea");

                textArea.value = newText;

                const userId = firebase.auth().currentUser.uid;

                const numLikes = change.doc.data().numLikes || 0;

                const userLiked = change.doc.data().likes[userId];

                const numLikesSpan = post.querySelector(".no-likes");

                const likeBtn = post.querySelector(".like_btn");

                likeBtn.dataset.func = userLiked ? "unlike" : "like";

                likeBtn.style.color = (userLiked ? "red" : "white");

                numLikesSpan.textContent = numLikes;
              }
            });
          });
      };

      const logoff = container.querySelector('#logout');
      logoff.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
        unsubscribe();
        authUnsubscribe();
      });
    } else {
      redirect();
    }
  });
  return container;
};
