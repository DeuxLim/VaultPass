//---------------------------- INITIALIZE FIREBASE ----------------------------------------//  
        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
        import { getDatabase } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
        import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
        import { getFirestore, collection, collectionGroup ,getDocs, onSnapshot, doc, setDoc, addDoc, getDoc, query, where,deleteDoc, updateDoc} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";


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
        const db = getFirestore();
        const auth = getAuth();
        const database = getDatabase();
//---------------------------- INITIALIZE FIREBASE ----------------------------------------//  

//---------------------------- LOGOUT ----------------------------------------//  
    // GET USER'S DATA FROM DATABASE
    export async function GetAllDataOnceForLogOut(){
        const user = auth.currentUser; 
        const q = query(collection(db, "users", user.uid, "userLogouts"));
        const querySnapshot = await getDocs(q);
        var logoutData = [];
        querySnapshot.forEach((doc) => {
            logoutData.push(doc.data());
        });
        AddAllLoggedOutToTheTable(logoutData);
        
    }

    // GET USER'S DATA FROM DATABASE VIA SNAPSHOT FOR REALTIME CHANGES
    export async function GetAllDataRealtimeForLogout(){
        const user = auth.currentUser; 
        const q = query(collection(db, "users", user.uid, "userLogouts"));
        const unsubscribe = onSnapshot(q,(querySnapshot) => {
        var logoutData = [];
            querySnapshot.forEach((doc)=>{
                logoutData.push(doc.data());
            });      
            AddAllLoggedOutToTheTable(logoutData);

             //clear logs button
             const getClearButtonLogout = document.getElementById("clearAll");
             getClearButtonLogout.addEventListener("click", () => {
                if (confirm("Are you sure you want to clear logs?")) {
                 const user = auth.currentUser;
                 const table = document.getElementById("logoutTable").children;
                 for(let i =0; i < table.length; i++) {
                 const tableElement = table[i];
                 const timeRecord = tableElement.children[2].innerHTML;
                 deleteDoc(doc(db, "users", user.uid, "userLogouts", timeRecord))
                 let cleared = document.getElementById("cleared-message");
                                setTimeout(showError, 5);
                                setTimeout(closeError,1000);
                                function showError(){
                                    cleared.classList.add("active")
                                }
                                function closeError(){
                                    cleared.classList.remove("active")
                                }
                 }
                }
             });
        })
    }
//---------------------------- LOGOUT ----------------------------------------//  

var logoutNo = 0;
var tbody = document.getElementById("logoutTable");
function AddloggedOutToTable(date, locationName, time){
    var trow = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    var td4 = document.createElement("td");
    td1.innerHTML = ++logoutNo + ".";
    td2.innerHTML = date
    td3.innerHTML = time
    td4.innerHTML = locationName
    trow.setAttribute("class", "logoutRow");
    td1.setAttribute("class", "logoutNumber");
    td2.setAttribute("class", "logoutDate");
    td3.setAttribute("class", "logoutTime");
    td4.setAttribute("class", "logoutLocation");
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    tbody.appendChild(trow);
}
function AddAllLoggedOutToTheTable(logoutlist){
    logoutNo = 0;
    tbody.innerHTML = "";
    logoutlist.forEach(logoutuser => {
        AddloggedOutToTable(logoutuser.date, logoutuser.locationName, logoutuser.time)
    })
}

