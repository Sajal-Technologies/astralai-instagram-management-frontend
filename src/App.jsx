import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';

import './css/style.css';

// Import pages
import Messages from './pages/Messages';
import PageNotFound from './pages/utility/PageNotFound';
import Signin from './pages/Signin';
import AllInstagramAccounts from './pages/instagram/AllInstagramAccounts';
import AddInstagramAccount from './pages/instagram/AddAccount';
import EditInstagramAccount from './pages/instagram/EditAccount';
import ViewSingleAccount from './pages/instagram/ViewSingleAccount';
import MessageTemplates from './partials/messages/MessageTemplates';
import UsersManagementPage from './pages/AllUsers';
import MessageHistory from './partials/messages/MessageHistory';

// ProtectedRoute component
const ProtectedRoute = ({ element: Component }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route path="/login" element={<Signin />} />
        <Route path="/" element={<Navigate to="/instagram/accounts" />} />
        <Route path="/instagram/accounts" element={<ProtectedRoute element={AllInstagramAccounts} />} />
        <Route path="/instagram/add-account" element={<ProtectedRoute element={AddInstagramAccount} />} />
        <Route path="/instagram/edit-account" element={<ProtectedRoute element={EditInstagramAccount} />} />
        <Route path="/instagram/view-single" element={<ProtectedRoute element={ViewSingleAccount} />} />
        <Route path="/message-templates" element={<ProtectedRoute element={MessageTemplates} />} />
        <Route path="/users" element={<ProtectedRoute element={UsersManagementPage} />} />
        <Route path="/message-history" element={<ProtectedRoute element={MessageHistory} />} />
        <Route path="/messages" element={<ProtectedRoute element={Messages} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
