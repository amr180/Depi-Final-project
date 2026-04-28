/**
 * EKHDEMNI ADMIN — Application Entry Point
 *
 * Bootstraps shared components, then hands off to the
 * page-specific controller identified by <body data-page="…">.
 */

import SidebarComponent  from './components/sidebar.js';
import DropdownComponent from './components/dropdown.js';

/* ── Lazy-load page controllers ── */
const CONTROLLERS = {
  dashboard: () => import('./controllers/dashboardController.js'),
  login:     () => import('./controllers/loginController.js'),
  users:     () => import('./controllers/usersController.js'),
  roles:     () => import('./controllers/rolesController.js'),
  providers: () => import('./controllers/providerController.js'),
  analytics: () => import('./controllers/dashboardController.js'), // alias
};

async function bootstrap() {
  const page = document.body.dataset.page ?? 'dashboard';

  // Init shared UI components (sidebar injects header + footer too)
  if (page !== 'login' && page !== 'not-found') {
    await SidebarComponent.init();
    DropdownComponent.init();
  }

  // Boot the correct page controller
  const loader = CONTROLLERS[page];
  if (loader) {
    const module = await loader();
    const Controller = module.default;
    await Controller.init?.();
  } else {
    console.warn(`[main.js] No controller registered for page: "${page}"`);
  }
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
