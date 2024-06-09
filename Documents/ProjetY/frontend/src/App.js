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

const App = () => {
  return (
    <div className='app'>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </div>
  );
}

const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/signup', '/forgot-password', '/validate-user/:userId', '/users'];
  
  return (
    <>
      {!hideNavbarRoutes.some(route => location.pathname.match(new RegExp(`^${route.replace(/:\w+/g, '\\w+')}$`))) && <Navbar />}
      <div className="content"> 
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/users' element={<UserList />} />
        <Route path='/home' element={<Home />} />
        <Route path='/validate-user/:userId' element={<ValidateUser />} />
        <Route path='/documents' element={<Documents />} />
        <Route path='/create-company' element={<CreateCompany />} />
        <Route path='/analysis/:id' element={<Analysis />} />
        <Route path='/about' element={<div>About Us Content</div>} /> {/* Ajout de cette ligne pour About Us */}
      </Routes>
      </div>
    </>
  );
}

export default App;
