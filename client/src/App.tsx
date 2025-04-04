import { Link } from "react-router-dom"

function App() {

  return (
    <>
      <div className="flex flex-col">
        Home
        <Link to={"/auth/dashboard"}><button className="cursor-pointer w-52 bg-red-400">dashboard</button></Link>
      </div>
    </>
  )
}

export default App
