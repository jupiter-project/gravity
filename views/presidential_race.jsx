import React from 'react';
import ApplicationLayout from './layout/application.jsx';

class PresidentialRacePage extends React.Component {
  render() {
    return (
        <ApplicationLayout data={this.props}>
            <h1 className="text-center">Presidential Race</h1>

            <div id="PresidentialRaceComponent">

            </div>
        </ApplicationLayout>
    );
  }
}

module.exports = PresidentialRacePage;
