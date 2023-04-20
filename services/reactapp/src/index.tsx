import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { render as r } from 'react-dom'

import './index.css'
import { routeArr } from './App'

export type renderOptions = {
	baseURL: string
}

export const render = ({ baseURL }: renderOptions) => {
	class ReactApp extends HTMLElement {
		router: any
		connectedCallback() {
			this.innerHTML = `<div id="reactapp"></div>`
			const router = createBrowserRouter(routeArr, {
				basename: baseURL,
			})
			this.router = router
			this.renderReactApp()
			this.listenLocation()
		}
		disconnectedCallback() {
			window.removeEventListener(
				'app:route:change',
				this.listenHandler,
			)
		}
		renderReactApp() {
			r(
				<RouterProvider router={this.router} />,
				document.getElementById('reactapp') as HTMLElement,
			)
		}
		listenLocation() {
			window.addEventListener(
				'app:route:change',
				this.listenHandler,
			)
		}

		private listenHandler = () => {
			this.router.navigate(window.location.pathname)
		}
	}
	window.customElements.define('react-app', ReactApp)
}
