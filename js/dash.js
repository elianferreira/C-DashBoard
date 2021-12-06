const db = firebase.firestore();

document.getElementById('logout').addEventListener('click', LogoutUser);

let provider = new firebase.auth.GoogleAuthProvider();
let logout = document.getElementById('logout');
let chamados = 0;

function showUserDetails(user) {
  document.getElementById('userDetails').innerHTML = `
    <div class="img-profile">
      <img src="${user.photoURL}">
    </div>
    <div class="userProfile">
      <p class="user-name">${user.displayName}</p>
      <p class="user-name-admin">${'Admin'}</p>
    </div>
  `;
}

// {/* <p class="user-email">${user.email}</p> */}

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

const taskForm = document.getElementById('task-form');
const tasksContainer = document.getElementById('tasksContainer');
let tasksContainer2 = document.getElementById('tasksContainer2');
let mainContainer = document.querySelector('.container');
let createPrimera = document.querySelector('.primeira-coluna');
let createSegunda = document.querySelector('.segunda-coluna');
let createTerceira = document.querySelector('.terceira-coluna');
let createQuarta = document.querySelector('.quarta-coluna');
let container2 = document.querySelector('.container2');
let textAnimation = document.querySelector('.h1-text-animation');

createPrimera.addEventListener('click', () => {
  if (mainContainer.classList.contains('active')) {
    mainContainer.classList.remove('active');
    textAnimation.classList.remove('active');
  } else {
    mainContainer.classList.add('active');
    tasksContainer.classList.remove('active');
    container2.classList.remove('active');
    tasksContainer2.classList.remove('active');
    textAnimation.classList.add('active');
  }
});

createSegunda.addEventListener('click', () => {
  if (container2.classList.contains('active')) {
    container2.classList.remove('active');
    textAnimation.classList.remove('active');
  } else {
    container2.classList.add('active');
    tasksContainer2.classList.remove('active');
    mainContainer.classList.remove('active');
    tasksContainer.classList.remove('active');
    textAnimation.classList.add('active');
  }
});

createTerceira.addEventListener('click', () => {
  if (tasksContainer.classList.contains('active')) {
    tasksContainer.classList.remove('active');
    textAnimation.classList.remove('active');
  } else {
    tasksContainer.classList.add('active');
    mainContainer.classList.remove('active');
    tasksContainer2.classList.remove('active');
    container2.classList.remove('active');
    textAnimation.classList.add('active');
  }
});
createQuarta.addEventListener('click', () => {
  if (tasksContainer2.classList.contains('active')) {
    tasksContainer2.classList.remove('active');
    textAnimation.classList.remove('active');
  } else {
    tasksContainer2.classList.add('active');
    container2.classList.remove('active');
    tasksContainer.classList.remove('active');
    mainContainer.classList.remove('active');
    textAnimation.classList.add('active');
  }
});

let editStatus = false;
let id = '';

/**
 * Save a New Task in Firestore
 * @param {string} title the title of the Task
 * @param {string} description the description of the Task
 */
const saveTask = (title, description) =>
  db.collection('tasks').doc().set({
    title,
    description,
  });

const getTasks = () => db.collection('tasks').get();

const onGetTasks = (callback) => db.collection('tasks').onSnapshot(callback);

const deleteTask = (id) => db.collection('tasks').doc(id).delete();

const getTask = (id) => db.collection('tasks').doc(id).get();

const updateTask = (id, updatedTask) =>
  db.collection('tasks').doc(id).update(updatedTask);

window.addEventListener('DOMContentLoaded', async (e) => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const task = doc.data();

      tasksContainer.innerHTML += `<div class="card card-body">
    <h3 class="h5">${task.title}</h3>
    <p class="p">${task.description}</p>
    <div class="btns-edits">
      <button class="btn btn-delete" data-id="${doc.id}">
        🗑 Delete
      </button>
      <button class="btn btn-edit" data-id="${doc.id}">
        🖉 Edit
      </button>
    </div>
  </div>`;
    });

    const btnsDelete = tasksContainer.querySelectorAll('.btn-delete');
    btnsDelete.forEach((btn) =>
      btn.addEventListener('click', async (e) => {
        console.log(e.target.dataset.id);
        try {
          await deleteTask(e.target.dataset.id);
        } catch (error) {
          console.log(error);
        }
      })
    );

    const btnsEdit = tasksContainer.querySelectorAll('.btn-edit');
    btnsEdit.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        try {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();
          taskForm['task-title'].value = task.title;
          taskForm['task-description'].value = task.description;

          editStatus = true;
          id = doc.id;
          taskForm['btn-task-form'].innerText = 'Update';
        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = taskForm['task-title'];
  const description = taskForm['task-description'];

  try {
    if (!editStatus) {
      await saveTask(title.value, description.value);
    } else {
      await updateTask(id, {
        title: title.value,
        description: description.value,
      });

      editStatus = false;
      id = '';
      taskForm['btn-task-form'].innerText = 'Save';
    }

    taskForm.reset();
    title.focus();
  } catch (error) {
    console.log(error);
  }
});

function guardar() {
  let nome = document.getElementById('nome').value;
  let apelido = document.getElementById('apelido').value;
  let idade = document.getElementById('idade').value;
  db.collection('users')
    .add({
      first: nome,
      last: apelido,
      born: idade,
    })
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id);
      document.getElementById('nome').value = '';
      document.getElementById('apelido').value = '';
      document.getElementById('idade').value = '';
    })
    .catch(function (error) {
      console.error('Error adding document: ', error);
    });
}

//db.collection("users").get().then((querySnapshot) => {
db.collection('users').onSnapshot((querySnapshot) => {
  tasksContainer2.innerHTML = '';

  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    tasksContainer2.innerHTML += `<div class="card card-body">
    <h3 class="h5">Bem vindo ${
      doc.data().first
    }, suas tarefas estão na aba Serviços</h3>
    <p>${doc.data().first}</p>
    <p>${doc.data().last}</p>
    <p>${doc.data().born}</p>

    <div class="btns-edits">
      <button class="btn btn-delete" onClick="eliminar('${doc.id}')">
        🗑 Delete
      </button>
      <button class="btn btn-edit" onClick="editar('${doc.id}', '${
      doc.data().first
    }', '${doc.data().last}', '${doc.data().born}')">
        🖉 Edit
      </button> 
    </div>
  </div>`;
  });
});

function eliminar(id) {
  db.collection('users')
    .doc(id)
    .delete()
    .then(function () {
      console.log('Document successfully deleted!');
    })
    .catch(function (error) {
      console.error('Error removing document: ', error);
    });
}

function editar(id, nome, apelido, fecha) {
  document.getElementById('nome').value = nome;
  document.getElementById('apelido').value = apelido;
  document.getElementById('idade').value = fecha;
  let boton = document.getElementById('boton');
  boton.innerHTML = 'Editar';

  boton.onclick = function () {
    let washingtonRef = db.collection('users').doc(id);

    let nome = document.getElementById('nome').value;
    let apelido = document.getElementById('apelido').value;
    let idade = document.getElementById('idade').value;

    return washingtonRef
      .update({
        first: nome,
        last: apelido,
        born: idade,
      })
      .then(function () {
        console.log('Document successfully updated!');
        document.getElementById('nome').value = '';
        document.getElementById('apelido').value = '';
        document.getElementById('idade').value = '';
        boton.innerHTML = 'Guardar';
      })
      .catch(function (error) {
        console.error('Error updating document: ', error);
      });
  };
}
