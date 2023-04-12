import {
	BrowserRouter,
	RouterProvider,
	createBrowserRouter,
} from 'react-router-dom'

import { Dashboard } from './pages/dashboard'
import Data from './pages/data'
import './App.css'

export const routeArr = [
	{ element: <Dashboard />, path: 'db' },
	{ element: <Data />, path: 'data' },
]

export const router = createBrowserRouter(routeArr)

export function App({ baseURL }: any) {
	return <RouterProvider router={router} />
}
