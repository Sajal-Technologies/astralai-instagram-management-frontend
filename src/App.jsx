import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Fintech from './pages/Fintech';
import Customers from './pages/ecommerce/Customers';
import Orders from './pages/ecommerce/Orders';
import Invoices from './pages/ecommerce/Invoices';
import Shop from './pages/ecommerce/Shop';
import Shop2 from './pages/ecommerce/Shop2';
import Product from './pages/ecommerce/Product';
import Cart from './pages/ecommerce/Cart';
import Cart2 from './pages/ecommerce/Cart2';
import Cart3 from './pages/ecommerce/Cart3';
import Pay from './pages/ecommerce/Pay';
import Campaigns from './pages/Campaigns';
import UsersTabs from './pages/community/UsersTabs';
import UsersTiles from './pages/community/UsersTiles';
import Profile from './pages/community/Profile';
import Feed from './pages/community/Feed';
import Forum from './pages/community/Forum';
import ForumPost from './pages/community/ForumPost';
import Meetups from './pages/community/Meetups';
import MeetupsPost from './pages/community/MeetupsPost';
import CreditCards from './pages/finance/CreditCards';
import Transactions from './pages/finance/Transactions';
import TransactionDetails from './pages/finance/TransactionDetails';
import JobListing from './pages/job/JobListing';
import JobPost from './pages/job/JobPost';
import CompanyProfile from './pages/job/CompanyProfile';
import Messages from './pages/Messages';
import TasksKanban from './pages/tasks/TasksKanban';
import TasksList from './pages/tasks/TasksList';
import Inbox from './pages/Inbox';
import Calendar from './pages/Calendar';
import Account from './pages/settings/Account';
import Notifications from './pages/settings/Notifications';
import Apps from './pages/settings/Apps';
import Plans from './pages/settings/Plans';
import Billing from './pages/settings/Billing';
import Feedback from './pages/settings/Feedback';
import Changelog from './pages/utility/Changelog';
import Roadmap from './pages/utility/Roadmap';
import Faqs from './pages/utility/Faqs';
import EmptyState from './pages/utility/EmptyState';
import PageNotFound from './pages/utility/PageNotFound';
import KnowledgeBase from './pages/utility/KnowledgeBase';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Onboarding01 from './pages/Onboarding01';
import Onboarding02 from './pages/Onboarding02';
import Onboarding03 from './pages/Onboarding03';
import Onboarding04 from './pages/Onboarding04';
import ButtonPage from './pages/component/ButtonPage';
import FormPage from './pages/component/FormPage';
import DropdownPage from './pages/component/DropdownPage';
import AlertPage from './pages/component/AlertPage';
import ModalPage from './pages/component/ModalPage';
import PaginationPage from './pages/component/PaginationPage';
import TabsPage from './pages/component/TabsPage';
import BreadcrumbPage from './pages/component/BreadcrumbPage';
import BadgePage from './pages/component/BadgePage';
import AvatarPage from './pages/component/AvatarPage';
import TooltipPage from './pages/component/TooltipPage';
import AccordionPage from './pages/component/AccordionPage';
import IconsPage from './pages/component/IconsPage';
import AllInstagramAccounts from './pages/instagram/AllInstagramAccounts';
import AddInstagramAccount from './pages/instagram/AddAccount';
import EditInstagramAccount from './pages/instagram/EditAccount';
import ViewSingleAccount from './pages/instagram/ViewSingleAccount';
import MessageTemplates from './partials/messages/MessageTemplates';
import UsersManagementPage from './pages/AllUsers';

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






        <Route path="/dashboard/analytics" element={<ProtectedRoute element={Analytics} />} />
        <Route path="/dashboard/fintech" element={<ProtectedRoute element={Fintech} />} />
        <Route path="/ecommerce/customers" element={<ProtectedRoute element={Customers} />} />
        <Route path="/ecommerce/orders" element={<ProtectedRoute element={Orders} />} />
        <Route path="/ecommerce/invoices" element={<ProtectedRoute element={Invoices} />} />
        <Route path="/ecommerce/shop" element={<ProtectedRoute element={Shop} />} />
        <Route path="/ecommerce/shop-2" element={<ProtectedRoute element={Shop2} />} />
        <Route path="/ecommerce/product" element={<ProtectedRoute element={Product} />} />
        <Route path="/ecommerce/cart" element={<ProtectedRoute element={Cart} />} />
        <Route path="/ecommerce/cart-2" element={<ProtectedRoute element={Cart2} />} />
        <Route path="/ecommerce/cart-3" element={<ProtectedRoute element={Cart3} />} />
        <Route path="/ecommerce/pay" element={<ProtectedRoute element={Pay} />} />
        <Route path="/campaigns" element={<ProtectedRoute element={Campaigns} />} />
        <Route path="/community/users-tabs" element={<ProtectedRoute element={UsersTabs} />} />
        <Route path="/community/users-tiles" element={<ProtectedRoute element={UsersTiles} />} />
        <Route path="/community/profile" element={<ProtectedRoute element={Profile} />} />
        <Route path="/community/feed" element={<ProtectedRoute element={Feed} />} />
        <Route path="/community/forum" element={<ProtectedRoute element={Forum} />} />
        <Route path="/community/forum-post" element={<ProtectedRoute element={ForumPost} />} />
        <Route path="/community/meetups" element={<ProtectedRoute element={Meetups} />} />
        <Route path="/community/meetups-post" element={<ProtectedRoute element={MeetupsPost} />} />
        <Route path="/finance/cards" element={<ProtectedRoute element={CreditCards} />} />
        <Route path="/finance/transactions" element={<ProtectedRoute element={Transactions} />} />
        <Route path="/finance/transaction-details" element={<ProtectedRoute element={TransactionDetails} />} />
        <Route path="/job/job-listing" element={<ProtectedRoute element={JobListing} />} />
        <Route path="/job/job-post" element={<ProtectedRoute element={JobPost} />} />
        <Route path="/job/company-profile" element={<ProtectedRoute element={CompanyProfile} />} />
        <Route path="/messages" element={<ProtectedRoute element={Messages} />} />
        <Route path="/tasks/kanban" element={<ProtectedRoute element={TasksKanban} />} />
        <Route path="/tasks/list" element={<ProtectedRoute element={TasksList} />} />
        <Route path="/inbox" element={<ProtectedRoute element={Inbox} />} />
        <Route path="/calendar" element={<ProtectedRoute element={Calendar} />} />
        <Route path="/settings/account" element={<ProtectedRoute element={Account} />} />
        <Route path="/settings/notifications" element={<ProtectedRoute element={Notifications} />} />
        <Route path="/settings/apps" element={<ProtectedRoute element={Apps} />} />
        <Route path="/settings/plans" element={<ProtectedRoute element={Plans} />} />
        <Route path="/settings/billing" element={<ProtectedRoute element={Billing} />} />
        <Route path="/settings/feedback" element={<ProtectedRoute element={Feedback} />} />
        <Route path="/utility/changelog" element={<ProtectedRoute element={Changelog} />} />
        <Route path="/utility/roadmap" element={<ProtectedRoute element={Roadmap} />} />
        <Route path="/utility/faqs" element={<ProtectedRoute element={Faqs} />} />
        <Route path="/utility/empty-state" element={<ProtectedRoute element={EmptyState} />} />
        <Route path="/utility/404" element={<ProtectedRoute element={PageNotFound} />} />
        <Route path="/utility/knowledge-base" element={<ProtectedRoute element={KnowledgeBase} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/onboarding-01" element={<ProtectedRoute element={Onboarding01} />} />
        <Route path="/onboarding-02" element={<ProtectedRoute element={Onboarding02} />} />
        <Route path="/onboarding-03" element={<ProtectedRoute element={Onboarding03} />} />
        <Route path="/onboarding-04" element={<ProtectedRoute element={Onboarding04} />} />
        <Route path="/component/button" element={<ProtectedRoute element={ButtonPage} />} />
        <Route path="/component/form" element={<ProtectedRoute element={FormPage} />} />
        <Route path="/component/dropdown" element={<ProtectedRoute element={DropdownPage} />} />
        <Route path="/component/alert" element={<ProtectedRoute element={AlertPage} />} />
        <Route path="/component/modal" element={<ProtectedRoute element={ModalPage} />} />
        <Route path="/component/pagination" element={<ProtectedRoute element={PaginationPage} />} />
        <Route path="/component/tabs" element={<ProtectedRoute element={TabsPage} />} />
        <Route path="/component/breadcrumb" element={<ProtectedRoute element={BreadcrumbPage} />} />
        <Route path="/component/badge" element={<ProtectedRoute element={BadgePage} />} />
        <Route path="/component/avatar" element={<ProtectedRoute element={AvatarPage} />} />
        <Route path="/component/tooltip" element={<ProtectedRoute element={TooltipPage} />} />
        <Route path="/component/accordion" element={<ProtectedRoute element={AccordionPage} />} />
        <Route path="/component/icons" element={<ProtectedRoute element={IconsPage} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
