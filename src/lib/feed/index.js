/*template strings e eventos do feed*/

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



  const posts = container.querySelector('#postForm');
  posts.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById("postText").value;
    const user = firebase.auth().currentUser;
    const ordenar = new Date();
    const today = new Date();
    const dataPostagem = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() + ' | ' + today.getHours() + ':' + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();

    const post = {
      text: text,
      user_id: user.email,
      likes: 0,
      comments: [],
      data: dataPostagem,
      ord: ordenar
    }

    const postsCollection = firebase.firestore().collection("posts")
    postsCollection.add(post).then(res => {
      document.getElementById("postText").value = "";
      loadPosts();



    })
  });

  loadPosts();
  function addPosts(post) {

    const postTemplate =
      `
        <div class="post" id='${post.id}'>
              <p id='${post.id}'>
                  ${post.data().text} | 
                  ❤ ${post.data().likes} |
                  ${post.data().data}
                  ${post.data().user_id}
                  
                  
                  <button type="" id="apagar" class="button" data-func="apagar">Apagar</button>
                  
              </p>
        </div>     
        `

    document.getElementById("posts").innerHTML
      += postTemplate;
    ``
  }

  function loadPosts() {
    const postsCollection = firebase.firestore().collection("posts")
    const banana = container.querySelector('#posts');
    banana.innerHTML = "Carregando..."
    postsCollection.orderBy('ord', 'desc').get().then(snap => {
      banana.innerHTML = ""
      snap.forEach(post => {
        addPosts(post)
      })
    });
  }

  function deletePost(postId) {
    const postsCollection = firebase.firestore().collection("posts");
    postsCollection.doc(postId).delete().then(doc => {
      console.log("Post apagado.");
      //loadPosts();
    })
  }

  //loadPosts();
  //deletePost("");



  const logout = container.querySelector('#logout');
  logout.addEventListener('click', (e) => {
    e.preventDefault();
    firebase.auth().signOut().then(() => {
      window.location.hash = '#welcome';
      console.log("O usuário fez logout.")
    });
  });

  return container;
}