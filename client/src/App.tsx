import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Chat, Login } from './pages'

function App() {
  const router = createBrowserRouter([
    { path: '/login', element: <Login /> },
    { path: '/chat', element: <Chat /> },
    { path: '*', element: <Navigate to={'/login'} /> }
  ])

  return <RouterProvider router={router} />
}

export default App
