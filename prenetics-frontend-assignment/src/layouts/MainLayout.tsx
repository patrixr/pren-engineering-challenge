import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import NavBar from '../components/NavBar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Patient Management', path: '/patients' },
    { name: 'Result Upload', path: '/results' },
    { name: 'Kit Activation', path: '/kits' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out bg-white border-r ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-8">Prenetics</h2>
          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b z-30">
        <div className="p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <main className={`lg:ml-64 min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-4 lg:p-8 mt-16 lg:mt-0">
          <Outlet />
        </div>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;