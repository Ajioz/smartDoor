import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";

const SlideAuth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    if (username !== "" || password !== " ") {
      try {
        await Auth.signIn(username, password);
        // Redirect to dashboard after successful sign-in
        navigate("/dashboard");
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    // console.log({ email, username, password });
    try {
      await Auth.signUp({
        username,
        password,
        attributes: { email },
        autoSignIn: true,
      });
      // console.log(user);
    } catch (error) {
      // console.log("error signing up:", error);
    }
    reset();
  };

  const reset = async () => {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    setUsername("");
    setPassword("");
    setEmail("");
  };

  async function confirmSignUp(username, code) {
    try {
      await Auth.confirmSignUp(username, code);
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  }

    return (
        <div className="body-size">
        <div className="main">
            <input type="checkbox" id="chk" aria-hidden="true" />
            <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
            >
            <input
                type="button"
                value=" confirm email"
                style={{ display: "relative", top: "0", right: "0" }}
                onClick={() => confirmSignUp("spaco", "046488")}
            />
            </div>
            <div className="signup">
            <form onSubmit={handleSignUp}>
                <label htmlFor="chk" aria-hidden="true">
                Sign up
                </label>
                <input
                className="auth-input"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="User name"
                required
                />
                <input
                className="auth-input"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                />
                <input
                className="auth-input"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                />
                <button className="authBtn">Sign up</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            </div>

            <div className="login">
            <form onSubmit={handleSignIn}>
                <label htmlFor="chk" aria-hidden="true">
                Login
                </label>
                <input
                className="auth-input"
                type="text"
                name="username"
                placeholder="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                />
                <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                />
                <button className="authBtn">Login</button>
            </form>
            </div>
        </div>
        </div>
    );
    };

    export default SlideAuth;