/*métodos que fazem conexão com o Firebase*/














/*
const cad = firebase.auth().createUserWithEmailAndPassword(email, senha).then((credencial) => {
    console.log(credencial.user);
});


const logout = firebase.auth().signOut().then(() => {
    console.log("O usuário fez logout.")
});

module.exports = {cadastrar, logout};*/

/*
export const cadastrar = (email, senha) => {
    //Criando usuários temporariamente no index. Passar a função para o services posteriormente.
    //comandos executados caso 'createUserWithEmailAndPassword' dê certo
    firebase.auth().createUserWithEmailAndPassword(email, senha).then((credencial) => {
        console.log(credencial.user);
        window.location.hash = '#feed';
    }).catch((error) => {
        //https://firebase.google.com/docs/reference/js/firebase.auth.Auth
        //comandos executados caso 'createUserWithEmailAndPassword' não dê certo
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
}*/
