import { auth, createUserWithEmailAndPassword, 
    onAuthStateChanged, signInWithEmailAndPassword,
    sendPasswordResetEmail,signOut,provider, signInWithPopup,
    getFirestore,db,collection,
    addDoc} from "./firebase.js";
    
    const validateEmail = (email) => {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
        return emailRegex.test(email);
    };
    
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*@).{8,}$/;
        return passwordRegex.test(password);
    };
    
    // get record of current user
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is signed in:", user);
        } else {
            console.log("user not exist.");
        }
    });
    
    // //for sigin//
    const signIn = (event) => {
        event.preventDefault();
    
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
    
        if (!validateEmail(email)) {
            alert("Invalid email format.");
            return;
        }
        if (!validatePassword(password)) {
            alert("Password must contain at least 8 characters, including a number, an uppercase letter, and a special character.");
            return;
        }
        
        signInWithEmailAndPassword(auth, email, password)
        .then((response) => {
            alert("Account successfully signed in"); 
            if (window.location.href.includes("signin.html")) {
                setTimeout(() => {
                    window.location.href = "select.html";
                }, 2000); 
            }
        })
            .catch((error) => {
                alert("Invalid email or password format. Please check your input.");
                console.log("error", error.message);
            });
    };
    
    
    // //for forget password//
    const forgetPass = (event) => {
        event.preventDefault();
    
        const email = document.getElementById("email").value.trim();
        if (!validateEmail(email)) {
            alert("Invalid email format.");
            return;
        }
    
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Password reset email sent! Check your inbox.");
            })
            .catch((error) => {
                console.error("Error sending password reset email:", error);
                alert("An error occurred: " + error.message);
            });
    }
    
    
    // //for logout//
    const logOut = () => {
        signOut(auth).then((user) => {
            
            if (user) {
                alert("account sucessfully logout");
            }
            if (window.location.href.includes("select.html")) {
                setTimeout(() => {
                window.location.href = "index.html"; 
               }, 2000);
            }
            else{
                alert(`account has already loged out signup again!`); 
                setTimeout(() => {
                    if (window.location.href.includes("select.html")) {
                        window.location.href = "signup.html"; 
                }
            }, 2000);
            }
        })
        .catch((error) => {
            console.log("Error:", error.code);
        });
    }
    
    
    //for google signup//
    const googleSignup = () => {
        signInWithPopup(auth, provider)
            .then(({ user }) => {
                if (window.location.href.includes("signup.html")) {
                    setTimeout(() => {
                        window.location.href = "select.html";
                    }, 2000); 
                }
                const token = GoogleAuthProvider.credentialFromResult(result).accessToken;
                console.log('token:',token);
                console.log('User:', user);
              
            })
            .catch(({ code, message, customData }) => {
                console.error(`Error: ${code} - ${message}`, customData.email);
            });
    };
    
    // //for signup//
    const signUp = (event) => {
        event.preventDefault();
    
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let conPassword = document.getElementById("con_password").value;
        let firstName = document.getElementById("first_name").value;
        let lastName = document.getElementById("last_name").value; 
        let number = document.getElementById("number").value;
        let userData = { firstName,lastName, number, email, password };
        console.log(userData);
    
        if (!validateEmail(email)) {
            alert("Invalid email format.");
            return;
        }
        if (!validatePassword(password)) {
            alert("Password must contain at least 8 characters, including a number, an uppercase letter, and a special character.");
            return;
        }
        if (password !== conPassword) {
            alert("Passwords do not match.");
            return;
        }
    
        createUserWithEmailAndPassword(auth, email, password)
        .then(async (response) => {
          console.log("user", response.user);
          alert("Your Account is successfully signed up");
              // ________________________________Add Doc
          try {
            const docRef = await addDoc(collection(db, "users"), {
              ...userData,
              uId: response.user.uid,
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
                if (window.location.href.includes("signup.html")) {
                    setTimeout(() => {
                        window.location.href = "select.html";
                    }, 2000); 
                }
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    alert("This email is already in use. Please use a different email.");
                } else {
                    alert(error.message);
                }
                console.log("error", error.message);
            });
    };
    
    document.addEventListener("DOMContentLoaded", () => {
       const signUpBtn = document.getElementById("signup_btn")
       const signInBtn  = document.getElementById("signin_btn")
       const googleBtn = document.getElementById("google-btn")
       const logoutBtn  = document.getElementById("logout-btn")
       const FP = document.querySelector("p #FP")
      
    
       if (signUpBtn) {
        signUpBtn.addEventListener("click", signUp);
       }  
       if (signInBtn) {
        signInBtn.addEventListener("click", signIn);
       }
       if (googleBtn) {
        googleBtn.addEventListener("click", googleSignup);
       }
       if (logoutBtn) {
        logoutBtn.addEventListener("click", logOut);
       }
       if (FP) {
        FP.addEventListener("click", forgetPass);
       }
     });
    
    
            
    
    