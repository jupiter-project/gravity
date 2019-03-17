import React from 'react';
import ApplicationLayout from './layout/application.jsx';

class GravityPage extends React.Component {
  render() {
    return (
      <ApplicationLayout data={this.props}>
        <div className="page-title">Election 2020 <p>
        Please log in to view the candidates and submit your votes.
        </p>
        </div>

            <div className="card card-register mx-auto">
              <div className="card-header bg-custom text-light h5">
                Voting dApp Status
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table
                    className="table table-bordered"
                    width="100%"
                    cellSpacing="0"
                  >
                    <tbody>
                      <tr>
                        <td>dApp Passphrase</td>
                        <td
                          className={
                            this.props.requirements.passphrase
                              ? 'text-success'
                              : 'text-danger'
                          }
                        >
                          {this.props.requirements.passphrase
                            ? 'Connected'
                            : 'Missing'}
                        </td>
                      </tr>
                      <tr>
                        <td>dApp Address</td>
                        <td
                          className={
                            this.props.requirements.address
                              ? 'text-success'
                              : 'text-danger'
                          }
                        >
                          {this.props.requirements.address
                            ? 'Connected'
                            : 'Missing'}
                        </td>
                      </tr>
                      <tr>
                        <td>dApp Public Key</td>
                        <td
                          className={
                            this.props.requirements.public_key
                              ? 'text-success'
                              : 'text-danger'
                          }
                        >
                          {this.props.requirements.public_key
                            ? 'Connected'
                            : 'Missing'}
                        </td>
                      </tr>
                      <tr>
                        <td>dApp Data Encryption</td>
                        <td
                          className={
                            this.props.requirements.encryption
                              ? 'text-primary'
                              : 'text-danger'
                          }
                        >
                          {this.props.requirements.encryption
                            ? 'Ready'
                            : 'Not-Encrypted'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
      </ApplicationLayout>
    );
  }
}

module.exports = GravityPage;
