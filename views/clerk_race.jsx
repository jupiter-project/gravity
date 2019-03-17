import React from 'react';
import ApplicationLayout from './layout/application.jsx';

class ClerkRacePage extends React.Component {
  render() {
    return (
        <ApplicationLayout data={this.props}>
            <h1 className="text-center">Clerical Race</h1>

            <div id="ClerkRaceComponent">

            </div>
        </ApplicationLayout>
    );
  }
}

module.exports = ClerkRacePage;
