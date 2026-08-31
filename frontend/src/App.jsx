import {RouterProvider} from "react-router-dom";
import {router} from "./app.routes.jsx";
import {AuthProvider} from "./features/auth/auth.context.jsx"

function App() {
  

  return (
  <RouterProvider router={router}/>
  )
}

export default App
