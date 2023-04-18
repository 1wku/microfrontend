import Router, { Route, route } from 'preact-router'
import { Link } from 'preact-router/match'

import { Host } from 'micro-iframe/src/models'

import './app.css'
import { Reactapp } from './pages/reactapp.page'
import { Neactapp } from './pages/nextapp.page'
import { Home } from './pages/home.page'

//SECTION - init host
export const host = new Host()
//NOTE - thêm hàm auth được gọi khi app con yêu cầu
host.onChildAuth(() => {
	return { isSuccess: true, data: { role: 'from host' } }
})
//!SECTION

const handleRoute = e => {
	window.dispatchEvent(routeChangeEvent)
	if (
		e.previous?.includes('/nextapp2') &&
		!e.url?.includes('/nextapp2')
	) {
		route('nextapp2' + e.url, true)
	}
}
const routeChangeEvent = new CustomEvent('app:route:change', {
	bubbles: true,
})

export function App() {
	return (
		<>
			<nav class="nav">
				<Link href="/" activeClassName="nav-active">
					Home
				</Link>
				<br />
				<Link href="/app1/data" activeClassName="nav-active">
					app 1 data
				</Link>
				<Link href="/app1/db" activeClassName="nav-active">
					app 1 db
				</Link>
				<br />
				<Link href="/app2" activeClassName="nav-active">
					App 2
				</Link>
				<Link href="/app2/about" activeClassName="nav-active">
					App 2 about
				</Link>
			</nav>
			<div className="main">
				<Router onChange={handleRoute}>
					<Route component={Home} path="/" default />
					<Route component={Reactapp} path="/app1/:*" />
					<Route
						component={Neactapp}
						key="nextapp123"
						path="/app2/:*"
					/>
				</Router>
			</div>
		</>
	)
}
