import { logout, postar } from '../../services/index.js';

export default () => {
  const container = document.createElement('div');

  const template = `
        <div class="content flexBox">
            <div class="area flexBox">
                <h3 class="flexBox">Feed</h3>
                <img src="img/icon.jpeg" width="30%"/>
                <h3>Postar:</h3> 
                <form id="postForm" class="flexBox">
                    <input type="textarea" class="entradas" id="postText" required/>
                    <button type="submit" class="button">Enviar</button>
                    <button type="" id="logout" class="button">Sair</button>
                </form>

                <div class="post flexBox">
                    <p id="posts"> </p>
                </div>
            </div>
        </div>
    `;
  container.innerHTML = template;


  /*
  const ap = container.querySelector('#btnDelete');
 // const deleteButton = ap.target.dataset.btnDelete;
  if (ap) {
    const deleteConfirmation = window.confirm('Deseja realmente apagar o post?');
    if (deleteConfirmation) {
      deletePost(ap)
        .then(() => {
          loadPosts();
        });
    } else {
      return false;
    }
  }*/


  const posts = container.querySelector('#postForm');
  posts.addEventListener('submit', (e) => {
    const text = document.getElementById('postText').value;
    e.preventDefault();
    postar(text);

    loadPosts();

  });

  loadPosts();
  function printPosts(post) {
    const postTemplate =
      `
        <div class="post" id='${post.id}'>
              <p id='${post.id}'>
                  ${post.data().text} | 
                  ❤ ${post.data().likes} |
                  ${post.data().data}
                  ${post.data().user_id}
                  
                  
                  <button type="" id="btnDelete" class="button" data-func="${post.id}">Apagar</button>
                  
              </p>
        </div>     
        `

    document.getElementById("posts").innerHTML
      += postTemplate;
    ``
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

  const sair = container.querySelector('#logout');
  sair.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });

  return container;
};