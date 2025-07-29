import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [postsState, setPostsState] = useState([]);

  useEffect(() => {
    getData();
  }, [loading]);

  let submitForm = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await fetch("https://groceries-to-go-back-end.vercel.app//api/users", {
        method: "POST",
        // headers: {
        //   Accept: "application/json",
        //   "Content-Type": "application/json",
        // },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });
      // res = await res.json();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    // setPostsState([...postsState, res]);
    setName("");
    setEmail("");
    setPassword("");
    setLoading(false);
  };
  let submitDelete = async (e, id) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await fetch("https://groceries-to-go-back-end.vercel.app//api/users/delete", {
        method: "POST",
        // headers: {
        // Accept: "application/json",
        // "Content-Type": "application/json",
        // },
        body: JSON.stringify({
          _id: id,
        }),
      });
      // res = await res.json();
      setLoading(false);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    // setPostsState([...postsState, res]);
    setName("");
    setEmail("");
    setPassword("");
    setLoading(false);
  };

  async function getData() {
    const url = "https://groceries-to-go-back-end.vercel.app//api/users";
    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const { success, data } = await response.json();
      await setPostsState(data);
    } catch (error) {
      console.error(error.message);
    }
  }
  console.log(postsState);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <form onSubmit={submitForm}>
        <label>
          Enter your name:
          <input
            type="text"
            className="bg-slate-200"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          Email:
          <input
            type="text"
            className="bg-slate-200"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          Password:
          <input
            type="text"
            className="bg-slate-200"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {postsState.map((element, index) => {
        return (
          <div key={index}>
            <p>{element.name}</p>
            <p>{element.email}</p>
            <button onClick={(e) => submitDelete(e, element._id)}>
              delete
            </button>
          </div>
        );
      })}
    </>
  );
}

export default App;
