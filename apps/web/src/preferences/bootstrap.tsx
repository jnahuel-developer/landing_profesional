import { preferenceStorageKey } from './model';

export const appearanceBootstrap = `(()=>{const d=document.documentElement,k=${JSON.stringify(preferenceStorageKey)},x={version:1,theme:'system',density:'comfortable',motion:'system'},T=['system','light','dark','high-contrast'],D=['comfortable','compact'],M=['system','reduced'];try{const p=JSON.parse(localStorage.getItem(k)||'null');if(p&&p.version===1&&T.includes(p.theme)&&D.includes(p.density)&&M.includes(p.motion))Object.assign(x,p)}catch{}const dark=matchMedia('(prefers-color-scheme: dark)').matches,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;d.dataset.theme=x.theme==='system'?(dark?'dark':'light'):x.theme;d.dataset.themePreference=x.theme;d.dataset.density=x.density;d.dataset.motionPreference=x.motion;d.dataset.motion=x.motion==='reduced'||reduced?'reduced':'full'})();`;

export function AppearanceBootstrap() {
  return (
    <script dangerouslySetInnerHTML={{ __html: appearanceBootstrap }} id="appearance-bootstrap" />
  );
}
