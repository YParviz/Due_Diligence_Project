import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext.jsx'; // Assurez-vous que AuthProvider est importé correctement
import Login from './components/login.jsx';
import Register from './components/signup.jsx';
import ForgotPassword from './components/forgotPassword.jsx';
import UserList from './components/userList.jsx';
import ValidateUser from './components/ValidateUser.jsx';
import Home from './components/home.jsx';
import Documents from './components/Documents.jsx'; //
import CreateCompany from './components/CreateCompany.jsx';
import Analysis from './components/Analysis.jsx';

function App() {
  return (
    <div className='app'>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/users' element={<UserList />} />
            <Route path='/home' element={<Home />} /> {/* Ajout de cette ligne */}
            <Route path="/validate-user/:userId" element={<ValidateUser />} />
            <Route path="/documents" element={<Documents />} /> {/* Ajoutez la route pour Documents */}
            <Route path="/create-company" element={<CreateCompany />} />
            <Route path="/analysis/:id" element={<Analysis />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
