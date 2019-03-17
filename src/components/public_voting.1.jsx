import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import toastr from 'toastr';

class DataRow extends React.Component {
  constructor(props) {
    super(props);
    const vote = this.props.parent.state.votes[this.props.vote];
    const record = vote.vote_record;

    this.state = {
      voteData: this.props.parent.state.votes[this.props.vote],
      Position: record.Position,
      Candidate: record.Candidate,
      Party: record.Party,
      VoteFor: JSON.stringify(record.VoteFor),
      votes: [],
      edit_mode: false,
      date: (new Date(vote.date)).toLocaleString(),
      submitted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.updateRecord = this.updateRecord.bind(this);
    this.editMode = this.editMode.bind(this);
  }

  handleChange(aField, event) {
    this.setState({
      [aField]: event.target.value,
    });
  }

  VoteForUpdate() {
    const newValue = !this.state.VoteFor;
    this.setState({ VoteFor: newValue });
  }

  updateRecord(event) {
    event.preventDefault();
    const page = this;
    this.setState({
      submitted: true,
    });

    this.props.parent.setState({
      update_submitted: true,
    });

    const record = {
      id: this.state.voteData.id,
      Position: this.state.Position,
      Candidate: this.state.Candidate,
      Party: this.state.Party,
      VoteFor: this.state.VoteFor,
      address: this.props.user.record.account,
      date_confirmed: Date.now(),
      user_id: this.props.user.id,
      user_api_key: this.props.user.record.api_key,
      public_key: this.props.public_key,
      user_address: this.props.user.record.account,
    };

    axios.put('/api/votes', { data: record })
      .then((response) => {
        if (response.data.success) {
          page.setState({
            submitted: false,
            edit_mode: false,
          });

          page.props.parent.setState({
            update_submitted: false,
          });

          toastr.success(' Update submitted to the blockchain.');
        } else {
          // console.log(response.data);
          // toastr.error(response.data.message);
          response.data.validations.messages.map((message) => {
            toastr.error(message);
            return null;
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toastr.error('There was an error');
      });
  }

  editMode(event) {
    event.preventDefault();
    this.setState({
      edit_mode: !this.state.edit_mode,
    });
  }

  render() {
    const form = (
        <tr className="text-center">
            <td>
                <input placeholder="" value={this.state.Position } className="form-control" onChange={this.handleChange.bind(this, 'Position')} /><br />
            </td>
            <td>
                <input placeholder="" value={this.state.Candidate } className="form-control" onChange={this.handleChange.bind(this, 'Candidate')} /><br />
            </td>
            <td>
                <input placeholder="" value={this.state.Party } className="form-control" onChange={this.handleChange.bind(this, 'Party')} /><br />
            </td>
            <td>
                <div className="status-toggle">
                <label className={'switch'}>
                    <input type="checkbox" onChange={this.VoteForUpdate.bind(this)} checked={this.state.VoteFor || false} />
                    <span className={'slider round'}></span>
                </label><br />
                </div>
            </td>
            <td>{this.state.date}</td>
            <td>
                <button className="btn btn-danger" onClick={this.editMode.bind(this)}>Cancel</button><br /><br />
                <button className="btn btn-success" disabled={this.state.submitted} onClick={this.updateRecord.bind(this)}>{this.state.submitted ? 'Saving...' : 'Save'}</button>
            </td>
        </tr>
    );

    const voteInfo = this.props.parent.state.votes[this.props.vote];

    const readOnly = (
      <tr className="text-center" key={`row-${(voteInfo.id)}-data`}>
          <td>{voteInfo.vote_record.Position}</td>
          <td>{voteInfo.vote_record.Candidate}</td>
          <td>{voteInfo.vote_record.Party}</td>
          <td>{String(voteInfo.vote_record.VoteFor)}</td>
          <td>{this.state.date}</td>
          <td>
              <button className="btn btn-success" onClick={this.editMode.bind(this)}>Edit</button>
          </td>
      </tr>
    );

    return (
      this.state.edit_mode ? form : readOnly
    );
  }
}

class PublicVotingComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Position: '',
      Candidate: '',
      Party: '',
      VoteFor: false,
      votes: [],
      submitted: false,
      update_submitted: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.createRecord = this.createRecord.bind(this);

    this.VoteForUpdate = this.VoteForUpdate.bind(this);
  }


  componentDidMount() {
    this.loadData();
  }

  resetRecords(newData) {
    this.setState({
      votes: newData,
    });
  }

  loadData() {
    const page = this;
    const config = {
      headers: {
        user_api_key: this.props.user.record.api_key,
        user_public_key: this.props.public_key,
      },
    };

    axios.get(`/api/users/${this.props.user.id}/votes`, config)
      .then((response) => {
        if (response.data.success) {
          page.setState({
            votes: response.data.votes,
          });
          page.monitorData();
        } else {
          toastr.error('No record history');
        }
      })
      .catch((error) => {
        console.log(error);
        toastr.error('There was an error');
      });
  }

  checkUpdates() {
    const self = this;
    const currentData = JSON.stringify(this.state.votes);
    const config = {
      headers: {
        user_api_key: this.props.user.record.api_key,
        user_public_key: this.props.public_key,
      },
    };

    axios.get(`/api/users/${this.props.user.id}/votes`, config)
      .then((response) => {
        if (response.data.success) {
          const responseData = response.data.votes;

          if (currentData !== JSON.stringify(responseData)) {
            self.resetRecords(responseData);
            toastr.success('Update submitted to the blockchain. It might take a few minutes for the changes to be shown below.');
          }
        }
      })
      .catch((error) => {
        console.log(error);
        toastr.error("Could not connect to server. Unable to check and update page's records.");
      });
  }

  monitorData() {
    const self = this;

    setInterval(() => {
      if (!(self.state.submitted || self.state.update_submitted)) {
        self.checkUpdates();
      }
    }, 15000);
  }


  handleChange(aField, event) {
    if (aField === 'Position') {
      this.setState({ Position: event.target.value });
    }
 else if (aField === 'Candidate') {
      this.setState({ Candidate: event.target.value });
    }
 else if (aField === 'Party') {
      this.setState({ Party: event.target.value });
    }
 else if (aField === 'VoteFor') {
      this.setState({ VoteFor: event.target.value });
    }
  }

  createRecord(event) {
    event.preventDefault();
    this.setState({
      submitted: true,
    });

    const page = this;

    const record = {
      Position: this.state.Position,
      Candidate: this.state.Candidate,
      Party: this.state.Party,
      VoteFor: this.state.VoteFor,
      address: this.props.user.record.account,
      date_confirmed: Date.now(),
      user_id: this.props.user.id,
      user_api_key: this.props.user.record.api_key,
      public_key: this.props.public_key,
      user_address: this.props.user.record.account,
    };

    axios.post('/api/votes', { data: record })
      .then((response) => {
        if (response.data.success) {
          page.setState({
            Position: '',
            Candidate: '',
            Party: '',
            VoteFor: false,
            submitted: false,
          });
          toastr.success('vote record submitted to the blockchain. It might take a few minutes for record to be shown below.');
        } else {
          // console.log(response.data);
          // toastr.error(response.data.message);
          response.data.validations.messages.map((message) => {
            toastr.error(message);
            return null;
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toastr.error('There was an error');
      });
  }

  VoteForUpdate() {
    const newValue = !this.state.VoteFor;
    this.setState({ VoteFor: newValue });
  }

  render() {
    const self = this;

    const recordList = (
      this.state.votes.map((vote, index) => <DataRow
          parent={self}
          vote={index}
          user={self.props.user}
          public_key={self.props.public_key}
          key={`row${(vote.id)}`}
          />)
    );

    return (
        <div className="container-fluid card">
            <h1 className="page-title"></h1>

            <div className="">
                <div className="">
                    <div className="card col-md-8 col-lg-8 p-0 mx-auto my-4">
                        <div className="card-header">
                            Record vote
                        </div>
                        <div className="card-body form-group">
                            <div className="row p-2">
                                <div className="col-lg-12 col-md-12">
                                    <label>Position</label>
                                    <input placeholder="" value={this.state.Position } className="form-control" onChange={this.handleChange.bind(this, 'Position')} /><br />
                                </div>
                                <div className="col-lg-12 col-md-12">
                                    <label>Candidate</label>
                                    <input placeholder="" value={this.state.Candidate } className="form-control" onChange={this.handleChange.bind(this, 'Candidate')} /><br />
                                </div>
                                <div className="col-lg-12 col-md-12">
                                    <label>Party</label>
                                    <input placeholder="" value={this.state.Party } className="form-control" onChange={this.handleChange.bind(this, 'Party')} /><br />
                                </div>
                                <div className="col-lg-12 col-md-12">
                                    <label>VoteFor</label>
                                    <div className="status-toggle">
                                        <label className={'switch'}>
                                            <input type="checkbox" onChange={this.VoteForUpdate.bind(this)} checked={this.state.VoteFor || false} />
                                            <span className={'slider round'}></span>
                                        </label><br />
                                    </div>
                                </div>
                            </div>
                            <div className="row p-3">
                                <div className="col-lg-12 col-md-12 col-xs-12 text-center">
                                    <button type="button" className="btn btn-outline btn-default" disabled={this.state.submitted} onClick={this.createRecord.bind(this)}><i className="glyphicon glyphicon-edit"></i>  {this.state.submitted ? 'Saving...' : 'Save'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Candidate</th>
                        <th>Party</th>
                        <th>VoteFor</th>
                        <th>Created on</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {recordList}
                </tbody>
            </table>

        </div>
    );
  }
}

const PublicVotingExport = () => {
  if (document.getElementById('PublicVotingComponent') != null) {
    const element = document.getElementById('props');
    const props = JSON.parse(element.getAttribute('data-props'));

    render(
      <PublicVotingComponent
      user={props.user}
      validation={props.validation}
      public_key={props.public_key}
      />,
      document.getElementById('PublicVotingComponent'),
    );
  }
};

module.exports = PublicVotingExport();
