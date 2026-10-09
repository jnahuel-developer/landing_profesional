import { bootstrapAppearance } from './preferences/bootstrap';

if (!window.location.pathname.startsWith('/dev/')) {
  bootstrapAppearance();
}
