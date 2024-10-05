
import { useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  ShoppingBagIcon,
  
  
  ClipboardDocumentListIcon,
  CreditCardIcon, 
  UserIcon,DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import logo from '../../assests/Images/imly-logo-new.jpg';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import {CogIcon } from '@heroicons/react/20/solid';
import './Navigation.js';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },

  // { name: 'Create Orders', href: '/AddOrders', icon: UserIcon },

  { name: 'Orders', href: '/Orders', icon: ClipboardDocumentListIcon },
  { name: 'Payments', href: '/Payments', icon: CreditCardIcon  },
  { name: 'Services', href: '/Returns', icon: DocumentMagnifyingGlassIcon },

  { name: 'Customers', href: '/Customer', icon: UsersIcon },
  { name: 'Reports', href: '/Reports', icon: FolderIcon },

  // { name: 'Add Products', href: '/products', icon: FolderIcon },
  { name: 'Users', href: '/user', icon: UsersIcon },
  { name: 'UserRole', href: '/RoleUser', icon: UsersIcon },
  { name: 'Production', href: '/production', icon: CogIcon },



  // { name: 'Products', href: '/product', icon: FolderIcon },
  { name: 'Stores', href: '/Stores', icon: ShoppingBagIcon },
  // { name: 'Createorder', href: '/createorder', icon: ShoppingBagIcon },
];

const userNavigation = [
  { name: 'Your profile', href: '#' },
  { name: 'Sign out', href: '/' }, // Redirect to login page
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Initialize useLocation

  // const handleSignOut = () => {
  //   // Handle sign out logic here
  //   navigate('/'); // Navigate to login page
  // };
  const handleSignOut = () => {
    // Remove token from local storage
    localStorage.removeItem('token'); 
    
    // Handle any additional sign-out logic here
  
    // Navigate to login page
    navigate('/');
  };
  

  const handleSettingsClick = (event) => {
    event.preventDefault();
    // Handle settings logic here, such as opening a settings modal
    console.log('Settings button clicked');
  };

  return (
//     <>
//       <div>
//         <Dialog open={sidebarOpen} onClose={() => setSidebarOpen(false)} className="relative z-50 lg:hidden">
//           <DialogBackdrop
//             transition
//             className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
//           />

//           <div className="fixed inset-0 flex">
//             <DialogPanel
//               transition
//               className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
//             >
//               <TransitionChild>
//                 <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
//                   <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
//                     <span className="sr-only">Close sidebar</span>
//                     <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
//                   </button>
//                 </div>
//               </TransitionChild>
//               <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
//                 <div className="flex h-16  shrink-0 items-center">
//                   <img
//                     alt="Your Company"
//                     src={logo}
//                     className="h-20 w-20 mt-4"
//                   />
//                 </div>
//                 <nav className="flex flex-1 flex-col">
//                   <ul role="list" className="flex flex-1 flex-col gap-y-7">
//                     <li>
//                       <ul role="list" className="-mx-2 space-y-1">
//                         {navigation.map((item) => (
//                           <li key={item.name}>
//                             <a
//                               href={item.href}
//                               onClick={() => setSidebarOpen(false)} // Close sidebar on click
//                               className={classNames(
//                                 // location.pathname === item.href
//                                 location.pathname.startsWith(item.href)
//                                   ? 'bg-custom-darkblue text-white'
//                                   : 'text-gray-900 hover:bg-custom-lightblue hover:text-white',
//                                 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
//                               )}
//                             >
//                               <item.icon 
//                                 aria-hidden="true"
//                                 color='black'
//                                 className={classNames(
//                                   location.pathname.startsWith(item.href)
//                                     ? 'text-white'
//                                     : 'text-indigo-200 group-hover:text-gray-200',
//                                   'h-6 w-6 shrink-0'
//                                 )}
//                               />
//                               {item.name}
//                             </a>
//                           </li>
//                         ))}
//                       </ul>
//                     </li>
//                     <li className="mt-auto">
//                       <button
//                         onClick={handleSettingsClick}
//                         className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading text-white hover:bg-indigo-700 hover:text-white"
//                       >
//                         <Cog6ToothIcon
//                           aria-hidden="true"
//                           className="h-6 w-6 shrink-0 text-white group-hover:text-white"
//                         />
//                         Settings
//                       </button>
//                     </li>
//                   </ul>
//                 </nav>
//               </div>
//             </DialogPanel>
//           </div>
//         </Dialog>

//         <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
//           <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
//             <div className="flex h-16 shrink-0 items-center">
//               <img
//                 alt="Your Company"
//                 src={logo}
//                 className="h-20 w-40 mt-4"
//               />
//             </div>
//             <nav className="flex flex-1 flex-col">
//               <ul role="list" className="flex flex-1 flex-col gap-y-7">
//                 <li>
//                   <ul role="list" className="-mx-2 space-y-1">
//                     {navigation.map((item) => (
//                       <li key={item.name}>
//                         <a
//                           href={item.href}
//                           onClick={() => setSidebarOpen(false)} // Close sidebar on click
//                           className={classNames(
//                             // location.pathname === item.href
//                             location.pathname.startsWith(item.href)
//                               ? 'bg-custom-darkblue  text-white'
//                               : ' text-white-900 hover:bg-custom-lightblue hover:text-gray-700',
//                             'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
//                           )}
//                         >
//                           <item.icon
//   aria-hidden="true"
//   className={classNames(
//     // location.pathname === item.href
//     location.pathname.startsWith(item.href)
//      ? 'text-white' : 'group-hover:text-gray-700',
//     'h-6 w-6 shrink-0 text-black' // Base color set to black
//   )}
// />       {item.name}
//                         </a>
//                       </li>
//                     ))}
//                   </ul>
//                 </li>
//                 <li className="mt-auto">
//                   <button
//                     onClick={handleSettingsClick}
//                     className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-custom-lightblue hover:text-gray-700"
//                   >
//                     <Cog6ToothIcon
//                       aria-hidden="true"
//                       className="h-6 w-6 shrink-0  text-gray-700 group-hover:text-gray-700"
//                     />
//                     Settings
//                   </button>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </div>

//         <div className="lg:pl-72">
//           <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
//             <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
//               <span className="sr-only">Open sidebar</span>
//               <Bars3Icon aria-hidden="true" className="h-6 w-6" />
//             </button>

//             <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />

//             <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
//               <form action="#" method="GET" className="relative flex flex-1">
//                 <label htmlFor="search-field" className="sr-only">
//                   Search
//                 </label>
//                 <MagnifyingGlassIcon
//                   aria-hidden="true"
//                   className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
//                 />
//                 <input
//                   id="search-field"
//                   name="search"
//                   type="search"
//                   placeholder="Search..."
//                   className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
//                 />
//               </form>
//               <div className="flex items-center gap-x-4 lg:gap-x-6">
//                 <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
//                   <span className="sr-only">View notifications</span>
//                   <BellIcon aria-hidden="true" className="h-6 w-6" />
//                 </button>

//                 <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" />

//                 <Menu as="div" className="relative">
//                   <MenuButton className="-m-1.5 flex items-center p-1.5">
//                     <span className="sr-only">Open user menu</span>
//                     <img
//                       alt=""
//                       src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//                       className="h-8 w-8 rounded-full bg-gray-50"
//                     />
//                     <span className="hidden lg:flex lg:items-center">
//                       <span aria-hidden="true" className="ml-4 text-sm font-semibold leading-6 text-gray-900">
//                         Tom Cook
//                       </span>
//                       <ChevronDownIcon aria-hidden="true" className="ml-2 h-5 w-5 text-gray-400" />
//                     </span>
//                   </MenuButton>
//                   <MenuItems
//                     transition
//                     className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
//                   >
//                     {userNavigation.map((item) => (
//                       <MenuItem key={item.name}>
//                         <a
//                           href={item.href}
//                           className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
//                           onClick={item.name === 'Sign out' ? handleSignOut : undefined} // Handle sign out
//                         >
//                           {item.name}
//                         </a>
//                       </MenuItem>
//                     ))}
//                   </MenuItems>
//                 </Menu>
//               </div>
//             </div>
//           </div>

//           <main className="py-0">
//             <div className="px-4 sm:px-6 lg:px-8"></div>
//           </main>
//         </div>
//       </div>
//     </>


<>
<div>
  <Dialog open={sidebarOpen} onClose={() => setSidebarOpen(false)} className="sidebar">
    <DialogBackdrop
      transition
      className="sidebar-backdrop"
    />

    <div className="sidebar-panel">
      <DialogPanel
        transition
        className="sidebar-content"
      >
        <TransitionChild>
          <div className="sidebar-close-btn">
            <button type="button" onClick={() => setSidebarOpen(false)} className="sidebar-open">
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon aria-hidden="true" className="xmarkicon" />
            </button>
          </div>
        </TransitionChild>
        <div className="sidebar-logo-div1">
          <div className="sidebar-logo-div2">
            <img
              alt="Your Company"
              src={logo}
              className="sidebar-logo"
            />
          </div>
          <nav className="sidebar-nav">
            <ul role="list" className="sidebar-nav1">
              <li>
                <ul role="list" className="sidebar-nav-item">
                  {navigation.map((item) => (
                    <li key={item.name}>
                    
                      <a
  href={item.href}
  onClick={() => setSidebarOpen(false)} // Close sidebar on click
  className={classNames(
    location.pathname.startsWith(item.href) ? 'link-active1' : 'link-inactive1',
    'link-common1'
  )}
>
                        <item.icon
  aria-hidden="true"
  color='black'
  className={classNames(
    location.pathname.startsWith(item.href) ? 'icon-active2' : 'icon-inactive2',
    'icon-common2'
  )}
/>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
          
              <li className="list-item-auto">
  <button
    onClick={handleSettingsClick}
    className="button-settings"
  >
    <Cog6ToothIcon
      aria-hidden="true"
      className="icon-settings"
    />
    Settings
  </button>
</li>

            </ul>
          </nav>
        </div>
      </DialogPanel>
    </div>
  </Dialog>

  <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <img
          alt="Your Company"
          src={logo}
          className="h-20 w-40 mt-4"
        />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={() => setSidebarOpen(false)} // Close sidebar on click
                    className={classNames(
                      // location.pathname === item.href
                      location.pathname.startsWith(item.href)
                        ? 'bg-custom-darkblue  text-white'
                        : ' text-white-900 hover:bg-custom-lightblue hover:text-gray-700',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                    )}
                  >
                    <item.icon
aria-hidden="true"
className={classNames(
// location.pathname === item.href
location.pathname.startsWith(item.href)
? 'text-white' : 'group-hover:text-gray-700',
'h-6 w-6 shrink-0 text-black' // Base color set to black
)}
/>       {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li className="list-item-auto">
            <button
              onClick={handleSettingsClick}
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-custom-lightblue hover:text-gray-700"
            >
              <Cog6ToothIcon
                aria-hidden="true"
                className="h-6 w-6 shrink-0  text-gray-700 group-hover:text-gray-700"
              />
              Settings
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
    {/* <div className="sidebar-container2">
  <div className="sidebar-content2">
    <div className="sidebar-logo2">
      <img alt="Your Company" src={logo} className="company-logo2" />
    </div>
    <nav className="sidebar-nav2">
      <ul role="list" className="sidebar-list2">
        <li>
          <ul role="list" className="nav-items2">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  onClick={() => setSidebarOpen(false)} // Close sidebar on click
                  className={`nav-link2 ${
                    location.pathname.startsWith(item.href)
                      ? 'nav-link-active2'
                      : 'nav-link-inactive2'
                  }`}
                >
                  <item.icon
                    aria-hidden="true"
                    className={`nav-icon2 ${
                      location.pathname.startsWith(item.href)
                        ? 'nav-icon-active2'
                        : 'nav-icon-inactive2'
                    }`}
                  />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </li>
        <li className="settings-item2">
          <button
            onClick={handleSettingsClick}
            className="settings-button2"
          >
            <Cog6ToothIcon aria-hidden="true" className="settings-icon2" />
            Settings
          </button>
        </li>
      </ul>
    </nav>
  </div>
</div>   */}


   <div className="lg:pl-72">
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
      </button>

      <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form action="#" method="GET" className="relative flex flex-1">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
          />
          <input
            id="search-field"
            name="search"
            type="search"
            placeholder="Search..."
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
            <span className="sr-only">View notifications</span>
            <BellIcon aria-hidden="true" className="h-6 w-6" />
          </button>

          <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" />

          <Menu as="div" className="relative">
            <MenuButton className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              <img
                alt=""
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="h-8 w-8 rounded-full bg-gray-50"
              />
              <span className="hidden lg:flex lg:items-center">
                <span aria-hidden="true" className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                  Tom Cook
                </span>
                <ChevronDownIcon aria-hidden="true" className="ml-2 h-5 w-5 text-gray-400" />
              </span>
            </MenuButton>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              {userNavigation.map((item) => (
                <MenuItem key={item.name}>
                  <a
                    href={item.href}
                    className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                    onClick={item.name === 'Sign out' ? handleSignOut : undefined} // Handle sign out
                  >
                    {item.name}
                  </a>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>
      </div>
    </div>

    <main className="py-0">
      <div className="px-4 sm:px-6 lg:px-8"></div>
    </main>
  </div> 

{/* <div className="container">
  <div className="sticky-navbar">
    <button type="button" onClick={() => setSidebarOpen(true)} className="mobile-menu-button">
      <span className="sr-only">Open sidebar</span>
      <Bars3Icon aria-hidden="true" className="h-6 w-6" />
    </button>

    <div aria-hidden="true" className="divider-mobile" />

    <div className="search-container">
      <form action="#" method="GET" className="search-form">
        <label htmlFor="search-field" className="sr-only">Search</label>
        <MagnifyingGlassIcon aria-hidden="true" className="search-icon" />
        <input id="search-field" name="search" type="search" placeholder="Search..." className="search-input" />
      </form>

      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <button type="button" className="notification-button">
          <span className="sr-only">View notifications</span>
          <BellIcon aria-hidden="true" className="h-6 w-6" />
        </button>

        <div aria-hidden="true" className="divider-desktop" />

        <Menu as="div" className="relative">
          <Menu.Button className="user-menu-button">
            <span className="sr-only">Open user menu</span>
            <img
              alt=""
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="user-avatar"
            />
            <span className="user-name-container">
              <span aria-hidden="true" className="user-name">Tom Cook</span>
              <ChevronDownIcon aria-hidden="true" className="chevron-down" />
            </span>
          </Menu.Button>
          <Menu.Items className="menu-items">
            {userNavigation.map((item) => (
              <Menu.Item key={item.name}>
                <a
                  href={item.href}
                  className="menu-link"
                  onClick={item.name === 'Sign out' ? handleSignOut : undefined}
                >
                  {item.name}
                </a>
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
      </div>
    </div>
  </div>

  <main className="py-0">
    <div className="px-4 sm:px-6 lg:px-8"></div>
  </main>
</div> */}

</div>
</>


  );
}
