import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sistema from '../../pages/sistema';
import { AuthProvider } from '../../contexts/auth/AuthProvider';

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthProvider>
              <Sistema />
            </AuthProvider>
          }
        />

        {/*<Route path='' element={<Navigate to='/' replace />} />*/}
      </Routes>
    </BrowserRouter>
  );
};

export default MyRoutes;
