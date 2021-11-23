// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     location.replace('pages/dashboard.html');
//   }
// });

document.getElementById('login').addEventListener('click', GoogleLogin);
// document.getElementById('logout').addEventListener('click', LogoutUser);

let provider = new firebase.auth.GoogleAuthProvider();

function GoogleLogin() {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((res) => {
      console.log(res.user);
      document.getElementById('LoginScreen').style.display = 'none';
      showUserDetails(res.user);
    })
    .catch((e) => {
      console.log(e);
    });
}

function checkAuthState() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      location.replace('dashboard.html');
      // showUserDetails(user);
    } else {
    }
  });
}

checkAuthState();
