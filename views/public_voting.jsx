import React from 'react';
import ApplicationLayout from './layout/application.jsx';

class PublicVotingPage extends React.Component {
  render() {
    return (
        <ApplicationLayout data={this.props}>
            <h1 className="text-center">Public Voting</h1>

            <div id="PublicVotingComponent">

            </div>
        </ApplicationLayout>
    );
  }
}

module.exports = PublicVotingPage;
