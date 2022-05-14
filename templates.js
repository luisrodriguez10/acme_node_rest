const head = ({ title }) => {
    return `
          <head>
              <link rel="stylesheet" href="/assets/styles.css">
              <title>${title}</title>
          </head>
      `;
  };
  
  const nav = ({ users, places }) => {
    return `
          <ul id="nav">
              <li><a href="/">Home</a></li>
              <li><a href="/users">Users (${users.length})</a></li>
              <li><a href="/places">Places (${places.length})</a></li>
          </ul>
      `;
  };

  module.exports = {head, nav};