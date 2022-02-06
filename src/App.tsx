import Navbar from "components/Navbar"
import { ProjectsProvider } from "contexts/ProjectsContext"
import about from "pages/about"
import contact from "pages/contact"
import home from "pages/home"
import portfolio from "pages/portfolio"
import project from "pages/project"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

const App = () => {
	return (
		<ProjectsProvider>
			<Router>
				<Navbar />
				<div tw="ml-[100px] font-body">
					<Routes>
						<Route path="/" element={home} />
						<Route path="/develop" element={portfolio}>
							<Route path=":projectName" element={project} />
						</Route>
						<Route path="/photo" element={portfolio}>
							<Route path=":projectName" element={project} />
						</Route>
						<Route path="/about" element={about} />
						<Route path="/contact" element={contact} />
					</Routes>
				</div>
			</Router>
		</ProjectsProvider>
	)
}

export default App
