import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TaskNew from './pages/TaskNew'
import TaskEdit from './pages/TaskEdit'
import TaskList from './pages/TaskList'
import ProjectList from './pages/ProjectList'
import ProjectEdit from './pages/ProjectEdit'
import Calendar from './pages/Calendar'
import Settings from './pages/Settings'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/new" element={<TaskNew />} />
        <Route path="/task/edit/:id" element={<TaskEdit />} />
        <Route path="/projects/edit/:id" element={<ProjectEdit />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App
