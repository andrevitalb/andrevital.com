import Navbar from "components/Navbar"
import { ProjectsProvider } from "contexts/ProjectsContext"
import About from "pages/about"
import Contact from "pages/contact"
import Home from "pages/home"
import Portfolio from "pages/portfolio"
import Project from "pages/project"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

const App = () => {
	return (
		<ProjectsProvider>
			<Router>
				<Navbar />
				<div className="ml-[100px] font-body">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/develop" element={<Portfolio />}>
							<Route path=":projectId" element={<Project />} />
						</Route>
						<Route path="/photo" element={<Portfolio />}>
							<Route path=":projectId" element={<Project />} />
						</Route>
						<Route path="/about" element={<About />} />
						<Route path="/contact" element={<Contact />} />
					</Routes>
				</div>
			</Router>
		</ProjectsProvider>
	)
}

export default App
