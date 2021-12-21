import React from 'react';
import ReactDom from 'react-dom';
import App from './App.js';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import './index.css';

const theme = createTheme();

const store = createStore(
  reducers,
  compose(applyMiddleware(thunk),window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

ReactDom.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />

    </ThemeProvider>
  </Provider>
  , document.getElementById('root'));