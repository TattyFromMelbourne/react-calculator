import React, {Component} from 'react';
import GitHubCorner from './GitHubCorner'

class InfoAboutApp extends Component {
  render() {
    return (
      <React.Fragment>

        <div>
          <GitHubCorner />
          <h1 className="App-title">React Calculator</h1>
          <div id='intro' className="App-intro">
            Calculator built with React.js v16
          </div>
        </div>
      </React.Fragment>
  )}
}

export default InfoAboutApp;
