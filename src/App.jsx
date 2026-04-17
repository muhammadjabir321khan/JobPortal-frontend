// App.jsx
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from './routes.jsx';
import { Provider } from 'react-redux';
import { store } from './stores/store';
import AuthBootstrap from './components/AuthBootstrap';

const router = createBrowserRouter(routes);

function App() {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;