/*
app.js is the top level of our React interface that calls our central App component and instructs ReactDOM to
render it in the 'output' div of our index.html.
https://reactjs.org/docs/react-dom.html
*/

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app-component';

ReactDOM.render(
    <App></App>
  ,document.getElementById('output')
);
