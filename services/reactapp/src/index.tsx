import { render as r } from 'react-dom'
import { routeArr } from './App'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

export type renderOptions = {
	baseURL: string
}

export const render = ({ baseURL }: renderOptions) => {
	class ReactApp extends HTMLElement {
		router: any
		connectedCallback() {
			this.innerHTML = `<div id="reactapp"></div>`
			const router = createBrowserRouter(routeArr, { basename: baseURL })
			this.router = router
			this.renderReactApp()
			this.listenLocation()
		}
		renderReactApp() {
			r(
				<RouterProvider router={this.router} />,
				document.getElementById('reactapp') as HTMLElement,
			)
		}
		listenHandler = () => {
			console.log('oke')
			this.router.navigate(window.location.pathname)
		}
		listenLocation() {
			window.addEventListener('app:route:change', this.listenHandler)
		}
		disconnectedCallback() {
			console.warn('react app disconnect')
			window.removeEventListener('app:route:change', this.listenHandler)
		}
	}
	window.customElements.define('react-app', ReactApp)
}
