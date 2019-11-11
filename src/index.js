import React from 'react';
import { StatusBar } from 'react-native';

import './config/ReactotronConfig';

import Routes from './routes';

export default function App() {
  return (
    <>
      <StatusBar barStyle="ligh-content" backgroundColor="#7159c1" />
      <Routes />
    </>
  );
}
