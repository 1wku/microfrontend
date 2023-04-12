import Router, { Route } from "preact-router";
import { Link } from "preact-router/match";

import "./app.css";
import { Home } from "./pages/home.page";
import { Reactapp } from "./pages/reactapp.page";
import { Neactapp } from "./pages/nextapp.page";

const routeChangeEvent = new CustomEvent("app:route:change", {
  bubbles: true,
});

const handleRoute = () => {
  window.dispatchEvent(routeChangeEvent);
};

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
          <Route component={Home} path="/" />
          <Route component={Reactapp} path="/app1/:*" />
          <Route component={Neactapp} path="/app2/:*" />
        </Router>
      </div>
    </>
  );
}
