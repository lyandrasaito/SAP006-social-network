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

export const postar = (text, image) => {
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

  console.log(image);

  const parts = image.name.split('.');
  const name = Date.now() + parts[parts.length - 1];
  const storage = firebase.storage().ref(name);
  const upload = storage.put(image);

  //update progress bar
  upload.on(
    "state_changed",
    function(snapshot){
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
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