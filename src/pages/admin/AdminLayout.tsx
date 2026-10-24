import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Radio, 
  Store, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminDataService } from '../../services/adminDataService';
import ThemeToggle from '../../components/ThemeToggle';

export default function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [metrics, setMetrics] = useState(() => adminDataService.getOverviewMetrics());

  // Listen to data changes to update counts
  useEffect(() => {
    const handleDataChange = () => {
      setMetrics(adminDataService.getOverviewMetrics());
    };
    window.addEventListener('yedz_admin_data_change', handleDataChange);
    return () => window.removeEventListener('yedz_admin_data_change', handleDataChange);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      name: 'Overview',
      path: '/admin',
      exact: true,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Leads & Inquiries',
      path: '/admin/leads',
      icon: Users,
      badge: metrics.newLeadsCount > 0 ? `${metrics.newLeadsCount} new` : null,
      badgeColor: 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
    },
    {
      name: 'Audio Campaigns',
      path: '/admin/campaigns',
      icon: Radio,
      badge: `${metrics.activeCampaignsCount} active`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    },
    {
      name: 'Retail Venues',
      path: '/admin/venues',
      icon: Store,
      badge: `${metrics.onlineVenuesCount} live`,
      badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      badge: null,
    },
  ];

  const getBreadcrumbName = () => {
    const current = navItems.find((item) => 
      item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
    );
    return current ? current.name : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-inter transition-colors duration-200">
      


      {/* Top Header */}
      <header className="sticky top-0 z-40 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
        
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/admin" className="flex items-center gap-2.5">
            <img src="/icon.png" alt="YedZ Media" className="h-7 w-7 object-contain" />
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
              YedZ <span className="text-red-600">Admin</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
              v2.4
            </span>
          </Link>
        </div>

        {/* Right: Theme Toggle & User Info */}
        <div className="flex items-center gap-3">
          <ThemeToggle showLabel={false} />

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          {/* User profile */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="h-8 w-8 rounded-full bg-red-600 text-white font-semibold text-xs flex items-center justify-center shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold leading-tight text-slate-900 dark:text-white">{user?.name || 'Admin'}</div>
              <div className="text-[11px] text-slate-500 leading-tight">{user?.role || 'Super Admin'}</div>
            </div>
          </div>
        </div>

      </header>

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 justify-between py-5 px-3">
          <div className="space-y-4">
            
            {/* Nav list */}
            <nav className="space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1">
                Management
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact 
                  ? location.pathname === item.path 
                  : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.exact}
                    className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-red-600' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/40 rounded text-xs text-slate-500 space-y-1">
              <div className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  System Healthy
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">100% UP</span>
              </div>
              <p className="text-[11px] text-slate-400">Audio ad network operational.</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 text-xs font-medium text-slate-500 rounded-md transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-64 max-w-[80%] bg-white dark:bg-slate-900 h-full border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between z-10 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-base text-slate-900 dark:text-white">
                    YedZ <span className="text-red-600">Admin</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact 
                      ? location.pathname === item.path 
                      : location.pathname.startsWith(item.path);

                    return (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.exact}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 ${isActive ? 'text-red-600' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          
          {/* Breadcrumbs Subheader */}
          <div className="px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Link to="/admin" className="hover:text-red-600 transition-colors">Admin</Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900 dark:text-white">{getBreadcrumbName()}</span>
            </div>
          </div>

          {/* Child Page Content */}
          <div className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>

        </main>

      </div>

    </div>
  );
}
