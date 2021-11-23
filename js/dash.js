document.getElementById('logout').addEventListener('click', LogoutUser);
// let btnApp = document.getElementById('btn-app');
// btnApp.addEventListener('click', () => {
//   if (logout.classList.contains('active')) {
//     logout.classList.remove('active');
//     overlayApp.classList.remove('active');
//     userDetails.classList.remove('active');
//   } else {
//     logout.classList.add('active');
//     overlayApp.classList.add('active');
//     userDetails.classList.add('active');
//   }
// });

let provider = new firebase.auth.GoogleAuthProvider();
let logout = document.getElementById('logout');

function showUserDetails(user) {
  document.getElementById('userDetails').innerHTML = `
    <div class="img-profile">
      <img src="${user.photoURL}">
    </div>
    <div class="userProfile">
      <p class="user-name">${user.displayName}</p>
      <p class="user-email">${user.email}</p>
    </div>
  `;
}

function checkAuthState() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      showUserDetails(user);
    } else {
    }
  });
}

function LogoutUser() {
  console.log('Logout Btn Call');
  firebase
    .auth()
    .signOut()
    .then(() => {
      location.replace('index.html');
    })
    .catch((e) => {
      console.log(e);
    });
}

checkAuthState();
