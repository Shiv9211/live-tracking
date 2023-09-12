import {GluestackUIProvider } from '@gluestack-ui/themed';

import Home from './components/Home'
import Login from './components/Login'

export default function App() {
  return (
    <GluestackUIProvider>
      {/* <Home /> */}
      <Login />
    </GluestackUIProvider>
  );
}