import React from 'react';
import './App.css';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import { AuthProvider } from './contexts/auth/AuthProvider';
import MyRoutes from './components/MyRoutes';

function App() {
  return (
    <ConfigProvider
      locale={ptBR}
      theme={{
        token: {
          colorPrimary: 'rgb(0, 21, 42)',
          colorLink: '#white',
          colorLinkHover: 'rgb(0, 0, 0)',
          borderRadius: 3,
          colorTextHeading: 'rgb(0,21,42)',
        },
      }}
    >
      {/*<Routes>
          <Route path='/*' element={<Sistema />} />
          </Routes>*/}
      <MyRoutes />
    </ConfigProvider>
  );
}

export default App;
