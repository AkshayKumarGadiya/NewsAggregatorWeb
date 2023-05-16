import { useState } from "react";
import AuthUser from "../services/authenticationapi";
export default function Login(){
    const {http, saveTokentoSessionStorage} = AuthUser();
    // Set state variables
    const [username, setUserName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [isLogin, setIsLogin] = useState(true);

    const submitLoginData = () => {
        console.log(email + " " + password);
        http.get('/login?email='+ email + '&password=' + password).then((res) => {
                saveTokentoSessionStorage(res.data.user, res.data.access_token);
        })
    }

    const submitRegistrationData = () => {
        console.log(username + " " +email + " " + password);
        http.post('/register', {name: username, email: email, password: password}).then((res) => {
            saveTokentoSessionStorage(res.data.user, res.data.access_token);
        })
    }

    const openRegistrationForm = () => {
        setIsLogin(!isLogin);
    }
    return(
        <div>
                <div className="row justify-content-center pt-5">
                <div className="col-sm-6">
                    <div className="card p-4">
                        {isLogin ?
                            <div>
                                <div className="mb-3 mt-3">
                                    <label className="form-label">Email:</label>
                                    <input type="email" className="form-control" id="email" placeholder="Enter email" name="email" onChange={e => setEmail(e.target.value)}/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password:</label>
                                    <input type="password" className="form-control" id="pwd" placeholder="Enter password" name="pswd" onChange={e => setPassword(e.target.value)}/>
                                </div>
                                <button type="submit" onClick={submitLoginData} className="btn btn-primary mt-3">Sign In</button>
                                <p className="mt-3">Click here to create an account: <a href="#" onClick={openRegistrationForm}>Sign Up</a></p>
                            </div>
                            :
                            <div>
                                <div className="mb-3 mt-3">
                                    <label className="form-label">First Name:</label>
                                    <input type="text" className="form-control" id="username" placeholder="Enter Your Name" name="username" onChange={e => setUserName(e.target.value)}/>
                                </div>
                                <div className="mb-3 mt-3">
                                    <label className="form-label">Email:</label>
                                    <input type="email" className="form-control" id="email" placeholder="Enter email" name="email" onChange={e => setEmail(e.target.value)}/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password:</label>
                                    <input type="password" className="form-control" id="pwd" placeholder="Enter password" name="pswd" onChange={e => setPassword(e.target.value)}/>
                                </div>
                                <button type="submit" onClick={submitRegistrationData} className="btn btn-primary mt-3">Sign Up</button>
                                <p className="mt-3">Already have an account? <a href="#" onClick={openRegistrationForm}>Sign In</a></p>
                            </div>
                        }
                        </div>
                    </div>
                </div>
        </div>
    )
}