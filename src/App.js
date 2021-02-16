import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Pages
import home from './pages/home';
import develop from './pages/develop';
import photography from './pages/photography';
import about from './pages/about';
import contact from './pages/contact';

// Components
import Navbar from './components/navbar';

function App() {
  	return (
		<Router>
			<Navbar/>
			<div id="main-container">
				<Switch>
					<Route exact path="/" component={home} />
					<Route path="/desarrollo" component={ develop } />
					<Route path="/fotografia" component={ photography } />
					<Route exact path="/acerca-de" component={ about } />
					<Route exact path="/contacto" component={ contact } />
				</Switch>
			</div>
		</Router>
	);
};

export default App;