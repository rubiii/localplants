import { MyAppAccount } from "@localplants/jazz/schema"
import { JazzReactProvider } from "jazz-tools/react"
import { Route, Switch } from "wouter"
import "./App.css"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import PlantPage from "./pages/PlantPage"

function App() {
  const jazzSyncServer = import.meta.env.VITE_JAZZ_SYNC_SERVER

  return (
    <JazzReactProvider
      AccountSchema={MyAppAccount}
      sync={{ peer: jazzSyncServer, when: "signedUp" }}
    >
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />

        <Route path="/plants/:id" component={PlantPage} />

        <Route>404: No such page!</Route>
      </Switch>
    </JazzReactProvider>
  )
}

// function App() {
//   const [greetMsg, setGreetMsg] = useState("")
//   const [name, setName] = useState("")

//   async function greet() {
//     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//     setGreetMsg(await invoke("greet", { name }))
//   }

//   return (
//     <main className="container">
//       <h1>Welcome to Tauri + React</h1>

//       <div className="row">
//         <a href="https://vite.dev" target="_blank">
//           <img src="/vite.svg" className="logo vite" alt="Vite logo" />
//         </a>
//         <a href="https://tauri.app" target="_blank">
//           <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <p className="py-16 bg-black">
//         Click on the Tauri, Vite, and React logos to learn more.
//       </p>

//       <form
//         className="row"
//         onSubmit={(e) => {
//           e.preventDefault()
//           greet()
//         }}
//       >
//         <input
//           id="greet-input"
//           onChange={(e) => setName(e.currentTarget.value)}
//           placeholder="Enter a name..."
//         />
//         <button type="submit">Greet</button>
//       </form>
//       <p>{greetMsg}</p>
//     </main>
//   )
// }

export default App
