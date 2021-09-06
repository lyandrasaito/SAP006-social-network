export const cadastrar = (email, senha) => {
  firebase.auth().createUserWithEmailAndPassword(email, senha).then(() => {
    window.location.hash = '#feed';
  }).catch((error) => {
    const errorCode = error.code;
    if (errorCode === 'auth/weak-password') {
      alert('Insira uma senha com, no mínimo, 6 caracteres');
    } else if (errorCode === 'auth/invalid-email') {
      alert('Formato de e-mail inválido');
    } else if (errorCode === 'auth/email-already-in-use') {
      alert('E-mail já cadastrado');
    } else {
      alert('Algo deu errado, verifique seus dados');
    }
  });
};

export const entrar = (email, senha) => {
  firebase.auth().signInWithEmailAndPassword(email, senha).then(() => {
    window.location.hash = '#feed';
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    alert('Verifique se inseriu corretamente seu e-mail e senha');
  });
};

export const logarGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      const credential = result.credential;
      console.log('Logado com Google', credential);
      window.location.hash = '#feed';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert('Verifique se inseriu corretamente seu e-mail e senha!');
    });
};

export const logout = () => {
  firebase.auth().signOut().then(() => {
    window.location.hash = '#welcome';
    console.log('O usuário fez logout.');
  });
};

export const getPosts = () => firebase.firestore().collection('posts');

export const postar = (text) => {
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
    ord: ordenar,
  };

  const postsCollection = firebase.firestore().collection('posts');
  postsCollection.add(post).then(res => {
    document.getElementById('postText').value = '';
  });
};

  /*
  function deletePost(postId) {
    const postsCollection = firebase.firestore().collection('posts');
    postsCollection.doc(postId).delete().then(doc => {
      console.log('Post apagado.');
    });
  }*/