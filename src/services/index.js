export const register = (email, senha) => {
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

export const login = (email, senha) => {
  firebase.auth().signInWithEmailAndPassword(email, senha).then(() => {
    window.location.hash = '#feed';
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    alert('Verifique se inseriu corretamente seu e-mail e senha');
  });
};

export const googleLogin = () => {
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

export const sendPost = (text, image) => {
  const user = firebase.auth().currentUser;
  const ordenar = new Date();
  const today = new Date();
  const dataPostagem = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() + ' | ' + today.getHours() + ':' + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();

  const post = {
    text: text,
    email: user.email,
    numLikes: 0,
    likes: {},
    comments: [],
    data: dataPostagem,
    ord: ordenar,
  };

  if (!image) {
    const postsCollection = firebase.firestore().collection('posts');
    postsCollection.add(post).then(res => {
      document.getElementById('postText').value = '';
    });

    return true;
  }

  const parts = image.name.split('.');
  const name = Date.now() + parts[parts.length - 1];
  const storage = firebase.storage().ref(name);
  const upload = storage.put(image);

  upload.on(
    "state_changed",
    function (snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING:
          console.log('Upload is running');
          break;
      }
    },
    function error(e) {
      console.log(e);
      alert(e);
    },

    function complete() {
      storage
        .getDownloadURL()
        .then(function (url) {
          post["imageUrl"] = url;
          const postsCollection = firebase.firestore().collection('posts');
          postsCollection.add(post).then(res => {
            document.getElementById('postText').value = '';
            document.getElementById('file').value = '';

          });
        })
        .catch(function (error) {
          console.log("error encountered");
        });
    }
  );
};

export const redirect = () => window.location.hash = '#welcome';

const db = firebase.firestore();
const postsRef = db.collection('posts');

export const likePost = (userId, postId) => {
  const postRef = postsRef.doc(postId);
  return db.runTransaction((transaction) => {
    return transaction.get(postRef).then((res) => {
      if (!res.exists) {
        throw "Post não existe!";
      }

      const newNumLikes = (res.data().numLikes || 0) + 1;

      transaction.update(postRef, {
        numLikes: newNumLikes,
      });

      transaction.set(postRef, { likes: { [userId]: true } }, { merge: true });
    });
  });
};

export const unlikePost = (userId, postId) => {
  const postRef = postsRef.doc(postId);

  return db.runTransaction((transaction) => {
    return transaction.get(postRef).then((res) => {
      if (!res.exists) {
        throw "Post não existe!";
      }

      const newNumLikes = (res.data().numLikes) - 1;

      transaction.update(postRef, {
        numLikes: newNumLikes,
      });
      transaction.update(postRef, { likes: { [userId]: false } });
    });
  });
};

export const deletePost = (postId) => {
  const postsCollection = firebase.firestore().collection('posts');
  postsCollection.doc(postId).delete().then(doc => {
  });
};

export const editPost = (id, newText) => {
  const postsCollection = firebase.firestore().collection('posts');
  postsCollection.doc(id).update({
    text: newText,
  });
};
