import React from 'react';
import ApplicationLayout from './layout/application.jsx';

class SecretarialRacePage extends React.Component {
  render() {
    return (
        <ApplicationLayout data={this.props}>
            <h1 className="text-center">Secretarial Race</h1>

            <div id="SecretarialRaceComponent">

            </div>
        </ApplicationLayout>
    );
  }
}

module.exports = SecretarialRacePage;
