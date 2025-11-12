/**
 * CSS styles for the visualization
 */
export const CSS = `
    :root {
      --color-charcoal-dark: #21313C;
      --color-slate-gray: #6B7C89;
      --color-green: #13AA52;
      --color-white: white;
      --color-gray-light: #F7F7F7;
      --color-mint-light: #F0F4F2;
      --color-mint-very-light: #E8F4F1;
      --color-gray-border: #E8EDEB;
      --color-gray-scrollbar: #D1D9D6;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: var(--color-white);
      color: var(--color-charcoal-dark);
      line-height: 1.5;
      height: 100vh;
      overflow: hidden;
    }

    /* Layout */
    .container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    aside {
      width: 17.5rem;
      background: var(--color-gray-light);
      border-right: 1px solid var(--color-gray-border);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Header */
    header {
      border-bottom: 1px solid var(--color-gray-border);
      background: var(--color-white);
    }

    h1 {
      font-size: 1.125rem;
      font-weight: 600;
      padding: 1rem;
    }

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
    }

    /* Form elements */
    input, select {
      width: 100%;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      line-height: 1.5;
      border: 1px solid var(--color-gray-border);
      border-radius: 0.25rem;
      background: var(--color-white);
      color: var(--color-charcoal-dark);
      transition: border-color 0.15s;
      height: 2.25rem;
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--color-green);
    }

    select {
      cursor: pointer;
      margin-top: 0.5rem;
    }

    /* Navigation */
    nav {
      flex: 1;
      overflow-y: auto;
      padding: 0.5rem 0;
    }

    nav a {
      display: block;
      padding: 0.625rem 1rem;
      color: var(--color-charcoal-dark);
      text-decoration: none;
      font-size: 0.875rem;
      transition: background-color 0.15s;
      border-left: 3px solid transparent;
    }

    nav a:hover {
      background: var(--color-mint-light);
    }

    nav a.active {
      background: var(--color-mint-very-light);
      border-left-color: var(--color-green);
      font-weight: 500;
    }

    /* Content */
    .content {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    section {
      margin-bottom: 2rem;
      scroll-margin-top: 1.5rem;
    }

    section:last-child {
      margin-bottom: 0;
    }

    section > header {
      padding-bottom: 0.75rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid var(--color-gray-border);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* Cards */
    article {
      padding: 1rem;
      margin-bottom: 0.75rem;
      background: var(--color-white);
      border: 1px solid var(--color-gray-border);
      border-radius: 0.25rem;
    }

    article:last-child {
      margin-bottom: 0;
    }

    article > header {
      font-size: 1rem;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--color-gray-border);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    article > header > span {
      font-weight: 600;
    }

    article > header:only-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    /* Links */
    a {
      color: var(--color-green);
      text-decoration: none;
      opacity: 0.7;
      transition: opacity 0.15s;
    }

    a:hover {
      opacity: 1;
      text-decoration: underline;
    }

    /* Utility classes */
    .text-muted {
      color: var(--color-slate-gray);
    }

    .text-small {
      font-size: 0.75rem;
    }

    .text-monospace {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.8125rem;
    }

    .ml-auto {
      margin-left: auto;
    }

    .separator {
      color: var(--color-slate-gray);
      opacity: 0.5;
    }

    /* Property list */
    ul {
      list-style: none;
    }

    li {
      margin: 0.5rem 0;
      padding: 0.5rem 0.75rem;
      background: var(--color-gray-light);
      border-radius: 0.25rem;
      border-left: 3px solid var(--color-green);
    }

    li strong {
      font-weight: 500;
    }

    li .text-small {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    /* States */
    .hidden {
      display: none;
    }

    .empty-state {
      padding: 2.5rem;
      text-align: center;
      color: var(--color-slate-gray);
      font-size: 0.875rem;
    }

    /* Scrollbar */
    nav::-webkit-scrollbar,
    .content::-webkit-scrollbar {
      width: 0.5rem;
    }

    nav::-webkit-scrollbar-track,
    .content::-webkit-scrollbar-track {
      background: transparent;
    }

    nav::-webkit-scrollbar-thumb,
    .content::-webkit-scrollbar-thumb {
      background: var(--color-gray-border);
      border-radius: 0.25rem;
    }

    nav::-webkit-scrollbar-thumb:hover,
    .content::-webkit-scrollbar-thumb:hover {
      background: var(--color-gray-scrollbar);
    }
  `;
