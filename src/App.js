import {useState, useRef} from 'react';
import './App.css';

import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth';   

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyCcFhLiXX8ulInqA2kGqWK6xopkI0xU1Ug",
  authDomain: "chat-app-dcaf1.firebaseapp.com",
  projectId: "chat-app-dcaf1",
  storageBucket: "chat-app-dcaf1.appspot.com",
  messagingSenderId: "305953239821",
  appId: "1:305953239821:web:71dad4bad14822272f7644",
  measurementId: "G-265R0NTDW3"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
    
    <>
    <header className="App-header">
        <h1>💬</h1>
        <SignOut/>
      </header>
    </>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button onClick= {signInWithGoogle}>Đăng nhập bằng Google để chat với Tuấn Anh ^^</button>
    </>
  )
}

function SignOut() {
  return (auth.currentUser && (
    <button className='sign-out' onClick={() => auth.signOut()}>Sign Out</button>
  ))
}

function ChatRoom() {

  const dummy = useRef()

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL} = auth.currentUser;

    await messagesRef.add({

      text: formValue, 
      createAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      </div>

      <form onSubmit={sendMessage}>


      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} 
        placeholder="say something nice"
      />

      <button type="submit">Sent</button>

      </form>

    </>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>

      <img src={photoURL}/>

      <p>{text}</p>
    </div>
  )

}

export default App;
