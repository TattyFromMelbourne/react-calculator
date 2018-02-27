import React, {Component} from 'react';

class InfoAboutApp extends Component {
  render() {
    return (<header className="App-header">
      <h1 className="App-title">React Calculator</h1>
      <div className="App-intro">
        Calculator built with React.js v16, see the&nbsp;
        <a href="https://github.com/TattyFromMelbourne/react-calculator" target="_new">GitHub repo</a>.
      </div>
    </header>);
  }
}

export default InfoAboutApp;
