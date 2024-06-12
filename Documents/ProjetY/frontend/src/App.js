import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/authContext.jsx';
import Login from './components/login.jsx';
import Register from './components/signup.jsx';
import ForgotPassword from './components/forgotPassword.jsx';
import UserList from './components/userList.jsx';
import ValidateUser from './components/ValidateUser.jsx';
import Home from './components/home.jsx';
import Documents from './components/Documents.jsx';
import CreateCompany from './components/CreateCompany.jsx';
import Analysis from './components/Analysis.jsx';
import Navbar from './components/navbar.jsx';
import Contact from './components/contact.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import About from './components/About.jsx';
import Profile from './components/profile.jsx';

const App = () => {
  return (
    <div className='app'>
      <AuthProvider>
        <Router>
          <Navbar /> {/* Déplacez la barre de navigation en dehors du composant AppContent */}
          <AppContent />
        </Router>
      </AuthProvider>
    </div>
  );
}

const AppContent = () => {
  return (
    <div className="content">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/users' element={<ProtectedRoute><UserList /></ProtectedRoute>} />
        <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/validate-user/:userId' element={<ValidateUser />} />
        <Route path='/documents' element={<ProtectedRoute><Documents /></ProtectedRoute>} />
        <Route path='/create-company' element={<ProtectedRoute><CreateCompany /></ProtectedRoute>} />
        <Route path='/analysis/:id' element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};


export default App;
