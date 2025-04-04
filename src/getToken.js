const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyBMXFb-BgRu0N0NJ6bzadZ72KGCMfDJEio",
  authDomain: "voice_productivity.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

signInWithEmailAndPassword(auth, "testuser2@example.com", "password@456")
  .then((userCredential) => {
    return userCredential.user.getIdToken();
  })
  .then((token) => {
    console.log("🔥 Firebase ID Token:");
    console.log(token);
  })
  .catch((error) => {
    console.error(error.code, error.message);
  });
