
//--------------------------------------------------------------INITIALIZE FIREBASE AND FIREBASE FEATURES---------------------------------------------------------------------//
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, set, ref, child , get , update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup , onAuthStateChanged, signOut, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, getDocs, onSnapshot, doc, setDoc, addDoc} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCfWmE5m4Qgj9KAAG6__VXLlkV35mI7KO4",
    authDomain: "passwordvault-e06a3.firebaseapp.com",
    projectId: "passwordvault-e06a3",
    storageBucket: "passwordvault-e06a3.appspot.com",
    messagingSenderId: "765990511434",
    appId: "1:765990511434:web:b496577bc5db7fe83ed7b3"
  };
// Initialize Firebase (connect to firebase features)
const app = initializeApp(firebaseConfig);
const database = getDatabase();
const auth = getAuth();
const db = getFirestore();
const provider = new GoogleAuthProvider();
//--------------------------------------------------------------INITIALIZE FIREBASE AND FIREBASE FEATURES---------------------------------------------------------------------//










//---------------------------------------------------------------SIGN UP SUBMIT BUTTON Start---------------------------------------------------------------------//
const Signup = document.getElementById("Signup");
Signup.addEventListener('click',(e) => {
e.preventDefault();
const email = document.getElementById('reg-email').value;
const password = document.getElementById('reg-pass').value;
const name = document.getElementById('reg-name').value;
var cpassword = document.getElementById('reg-cpass').value;
const checkbox = document.getElementById("termsAndConditions");
var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;   
var re2 = /^[^*|\":<>[\]{}`\\()';@&$]+$/;
var nameLength = name.length<4;
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*_])(?=.*[0-9])(?=.*[a-z]).{9,}$/;
const auth = getAuth();



//-----------------------------------FORM VALIDATION ------------------------------------//
if(!re2.test(name) || nameLength){
    document.getElementById("reg-error").innerHTML ="name must contain no special characters and must be greather than 4";
    document.getElementById("reg-name").style.borderBottom = "1px solid red";
    document.getElementById("reg-error").style.display = "block";
} else if(!re.test(email)){
    document.getElementById("reg-error").innerHTML ="Please enter correct email address";
    document.getElementById("reg-email").style.borderBottom = "1px solid red";
    document.getElementById("reg-error").style.display = "block";
} else if(!passwordRegex.test(password)) {
    document.getElementById("reg-error").innerHTML = "Password must be at least 9 characters and contain at least one uppercase , number and special character";
    document.getElementById("reg-pass").style.borderBottom = "1px solid red";
    document.getElementById("reg-error").style.display = "block";
} else if(password != cpassword){
    document.getElementById("reg-error").innerHTML ="Passwords do not match";
    document.getElementById("reg-cpass").style.borderBottom = "1px solid red";
    document.getElementById("reg-error").style.display = "block";
} else if (!checkbox.checked){
    document.getElementById("reg-error").innerHTML ="Terms and conditions is required";
    document.getElementById("reg-cpass").style.borderBottom = "1px solid red";
    document.getElementById("reg-error").style.display = "block";
}
else {
    
    // Signed in automatically.
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        updateProfile(userCredential.user, {
            displayName: name
        })
        const user = userCredential.user;
        return setDoc(doc(db , "users" , user.uid),{
            name: name,
            email: email,
        })
    })
    .then(() => {
        alert('User created! Please Check your Email.');
        sendEmailVerification(auth.currentUser)
    .then(() => {
  });
        window.location.href = "login.html"
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
            document.getElementById("reg-error").innerHTML ='The email is already registered.';
        }
    });
};
});     



//---------------------------------------------------------------SIGN UP SUBMIT BUTTON end---------------------------------------------------------------------//


const termsAndConditions = document.getElementById("termsAndConditionsLink")
const termsPopUp = document.getElementById("termsPopUp")
const closeTerms = document.getElementById("closeTerms")
termsAndConditions.addEventListener('click', () => {
    termsPopUp.style.display = "flex";
})
closeTerms.addEventListener('click', () => {
    termsPopUp.style.display = "none"
})







//---------------------------------------------------------------LOGIN BUTTON start---------------------------------------------------------------------//
  mainlogin.addEventListener('click', async (e) => {
    var email = document.getElementById('log-email').value;
    var password = document.getElementById('log-pass').value;
    var rememberMe = document.getElementById("logCheck").checked;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        if(rememberMe){
            const lock = "11111111111111111111111111111111"
            const salt = CryptoJS.lib.WordArray.random(128/8).toString();
            const derivedKey = CryptoJS.PBKDF2(lock, salt, { keySize: 256/8, iterations: 1000 }).toString(CryptoJS.enc.Hex);
            const encryptionKey = CryptoJS.PBKDF2(lock, salt, { keySize: 256/8, iterations: 1000 }).toString();
            const iv = CryptoJS.lib.WordArray.random(128/8).toString();
            const encEmail = CryptoJS.AES.encrypt(email, encryptionKey, { iv: iv }).toString();
            // Store the email and password in localStorage
            localStorage.setItem("email", encEmail);
            localStorage.setItem("rememberMe", "checked");
            localStorage.setItem("salt", salt);
            localStorage.setItem("iv", iv);
        } else {
            // Remove the email and password from localStorage
            localStorage.removeItem("email");;
            localStorage.removeItem("rememberMe");
        }
        //GET DATE,TIME AND LOCATION
        const user = userCredential.user;
        const currentDate = new Date().toDateString();  
        const options = {hour: '2-digit', minute:'2-digit', second:'2-digit'};
        const time = new Date().toLocaleTimeString(undefined, options); //time
        var userLogsInfo = {
            date : currentDate,
            time : time
        };
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
        });
        /* if (!position) {
            return;
        } */
        const API_KEY = '45be228952834fad854773f48f212919';
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}`);
        const data = await response.json();
        const locationName = data.results[0].formatted;
        userLogsInfo.locationName = locationName; 
        await setDoc(doc(db, "users" , user.uid, "userLogins", time), userLogsInfo); //sends to database
        window.location.href= "../dashboard/dashboard.html";
    } 
    
    catch (error) { 
        const errorCode = error.code;
        if(errorCode === 'auth/invalid-email'){
            document.getElementById("log-error-email").innerHTML= "Invalid Email";
            document.getElementById("log-error-email").style.margin = '10px';
            document.getElementById("log-email").style.borderBottom = '1px solid red';
        }
        else if(errorCode === 'auth/user-not-found'){
            document.getElementById("log-error-email").innerHTML= "Email not registered";
            document.getElementById("log-error-email").style.margin = '10px';
            document.getElementById("log-email").style.borderBottom = '1px solid red';
        }    
        else if(errorCode === 'auth/wrong-password'){
            document.getElementById("log-error-password").innerHTML= "Wrong Password";
            document.getElementById("log-error-password").style.margin = '10px';
            document.getElementById("log-pass").style.borderBottom = '1px solid red';
        }
        else if (error.code === 'PositionError') {
            alert(error.message)
        }
        else if (email == "" || email == null){
            document.getElementById("log-error-password").innerHTML= "Enter Email";
            document.getElementById("log-error-password").style.margin = '10px';
            document.getElementById("log-pass").style.borderBottom = '1px solid red';
        }
        else if (password == "" || password == null){
            document.getElementById("log-error-password").innerHTML= "Enter Password";
            document.getElementById("log-error-password").style.margin = '10px';
            document.getElementById("log-pass").style.borderBottom = '1px solid red';
        }
    }
})

//---------------------------------------------------------------LOGIN BUTTON end---------------------------------------------------------------------//
