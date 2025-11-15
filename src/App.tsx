import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TaskNew from './pages/TaskNew'
import TaskEdit from './pages/TaskEdit'
import TaskList from './pages/TaskList'
import Calendar from './pages/Calendar'
import Settings from './pages/Settings'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/new" element={<TaskNew />} />
        <Route path="/task/edit/:id" element={<TaskEdit />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App
