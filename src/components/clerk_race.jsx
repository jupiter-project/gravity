import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import toastr from 'toastr';

// class DataRow extends React.Component {
//   constructor(props) {
//     super(props);
//     const clerk = this.props.parent.state.clerks[this.props.clerk];
//     const record = clerk.clerk_record;

//     this.state = {
//       clerkData: this.props.parent.state.clerks[this.props.clerk],
//       Name: record.Name,
//       Party: record.Party,
//       clerks: [],
//       edit_mode: false,
//       date: (new Date(clerk.date)).toLocaleString(),
//       submitted: false,
//     };

//     this.handleChange = this.handleChange.bind(this);
//     this.updateRecord = this.updateRecord.bind(this);
//     this.editMode = this.editMode.bind(this);
//   }

//   handleChange(aField, event) {
//     this.setState({
//       [aField]: event.target.value,
//     });
//   }


//   updateRecord(event) {
//     event.preventDefault();
//     const page = this;
//     this.setState({
//       submitted: true,
//     });

//     this.props.parent.setState({
//       update_submitted: true,
//     });

//     const record = {
//       id: this.state.clerkData.id,
//       Name: this.state.Name,
//       Party: this.state.Party,
//       address: this.props.user.record.account,
//       date_confirmed: Date.now(),
//       user_id: this.props.user.id,
//       user_api_key: this.props.user.record.api_key,
//       public_key: this.props.public_key,
//       user_address: this.props.user.record.account,
//     };

//     axios.put('/api/clerks', { data: record })
//       .then((response) => {
//         if (response.data.success) {
//           page.setState({
//             submitted: false,
//             edit_mode: false,
//           });

//           page.props.parent.setState({
//             update_submitted: false,
//           });

//           toastr.success(' Update submitted to the blockchain.');
//         } else {
//           // console.log(response.data);
//           // toastr.error(response.data.message);
//           response.data.validations.messages.map((message) => {
//             toastr.error(message);
//             return null;
//           });
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//         toastr.error('There was an error');
//       });
//   }

//   editMode(event) {
//     event.preventDefault();
//     this.setState({
//       edit_mode: !this.state.edit_mode,
//     });
//   }

//   render() {
//     const form = (
//         <tr className="text-center">
//             <td>
//                 <input placeholder="" value={this.state.Name } className="form-control" onChange={this.handleChange.bind(this, 'Name')} /><br />
//             </td>
//             <td>
//                 <input placeholder="" value={this.state.Party } className="form-control" onChange={this.handleChange.bind(this, 'Party')} /><br />
//             </td>
//             <td>{this.state.date}</td>
//             <td>
//                 <button className="btn btn-danger" onClick={this.editMode.bind(this)}>Cancel</button><br /><br />
//                 <button className="btn btn-success" disabled={this.state.submitted} onClick={this.updateRecord.bind(this)}>{this.state.submitted ? 'Voting...' : 'Vote'}</button>
//             </td>
//         </tr>
//     );

//     const clerkInfo = this.props.parent.state.clerks[this.props.clerk];

//     const readOnly = (
//       <tr className="text-center" key={`row-${(clerkInfo.id)}-data`}>
//           <td>{clerkInfo.clerk_record.Name}</td>
//           <td>{clerkInfo.clerk_record.Party}</td>
//           <td>{this.state.date}</td>
//           <td>
//               <button className="btn btn-success" onClick={this.editMode.bind(this)}>Edit</button>
//           </td>
//       </tr>
//     );

//     return (
//       this.state.edit_mode ? form : readOnly
//     );
//   }
// }

class ClerkRaceComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: '',
      Party: '',
      clerks: [],
      submitted: false,
      update_submitted: false,
      hasVoted: false,
    };
    // this.handleChange = this.handleChange.bind(this);
    this.createRecord = this.createRecord.bind(this);
  }


  componentDidMount() {
    this.loadData();
  }

  // resetRecords(newData) {
  //   this.setState({
  //     clerks: newData,
  //   });
  // }

  loadData() {
    const page = this;
    const config = {
      headers: {
        user_api_key: this.props.user.record.api_key,
        user_public_key: this.props.public_key,
      },
    };

    axios.get(`/api/users/${this.props.user.id}/clerks`, config)
      .then((response) => {
        if (response.data.success) {
          page.setState({
            clerks: response.data.clerks,
          });
          // page.monitorData();
        } else {
          toastr.error('No record history');
        }
      })
      .catch((error) => {
        console.log(error);
        toastr.error('There was an error');
      });
  }

  // checkUpdates() {
  //   const self = this;
  //   const currentData = JSON.stringify(this.state.clerks);
  //   const config = {
  //     headers: {
  //       user_api_key: this.props.user.record.api_key,
  //       user_public_key: this.props.public_key,
  //     },
  //   };

  //   axios.get(`/api/users/${this.props.user.id}/clerks`, config)
  //     .then((response) => {
  //       if (response.data.success) {
  //         const responseData = response.data.clerks;

  //         if (currentData !== JSON.stringify(responseData)) {
  //           self.resetRecords(responseData);
  //           toastr.success('Update submitted to the blockchain. It might take a few minutes for the changes to be shown below.');
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       toastr.error("Could not connect to server. Unable to check and update page's records.");
  //     });
  // }

  // monitorData() {
  //   const self = this;

  //   setInterval(() => {
  //     if (!(self.state.submitted || self.state.update_submitted)) {
  //       self.checkUpdates();
  //     }
  //   }, 15000);
  // }


  // handleChange(aField, event) {
  //   if (aField === 'Name') {
  //     this.setState({ Name: event.target.value });
  //   } else if (aField === 'Party') {
  //     this.setState({ Party: event.target.value });
  //   }
  // }

  createRecord(event) {
    event.preventDefault();
    this.setState({
      submitted: true,
    });

    const page = this;

    const record = {
      Name: this.state.Name,
      Party: this.state.Party,
      address: this.props.user.record.account,
      date_confirmed: Date.now(),
      user_id: this.props.user.id,
      user_api_key: this.props.user.record.api_key,
      public_key: this.props.public_key,
      user_address: this.props.user.record.account,
    };

    axios.post('/api/clerks', { data: record })
      .then((response) => {
        if (response.data.success) {
          page.setState({
            Name: '',
            Party: '',
            submitted: false,
            hasVoted: true,
          });
          toastr.success('clerk record submitted to the blockchain.');
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

  handleRowSelect = (name, party) => {
    if (!this.state.hasVoted) {
      this.setState({
        Name: name,
        Party: party,
      });
    } else {
      toastr.error('You can only vote once!');
    }
  }

  render() {
    // const self = this;

    // const recordList = (
    //   this.state.clerks.map((clerk, index) => <DataRow
    //       parent={self}
    //       clerk={index}
    //       user={self.props.user}
    //       public_key={self.props.public_key}
    //       key={`row${(clerk.id)}`}
    //       />)
    // );

    return (
      <div className="container-fluid">
        <h1 className="page-title">Election 2020</h1>

        <div className="card col-md-8 col-lg-8 p-0 mx-auto my-4">
          <div className="card-header">
              Select a Candidate then click Vote.
          </div>
          <div className="card-body">
                    
            <table className="table table-bordered table-hover">
              {/* <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Party</th>
                </tr>
              </thead> */}
              <tbody>
                <tr onClick={(name, party) => this.handleRowSelect(name = 'Timmy', party = 'Republican')}>
                  <td><input type="radio" checked={this.state.Name === 'Timmy'} onChange={(name, party) => this.handleRowSelect(name = 'Timmy', party = 'Republican')} /></td>
                  <td>Timmy</td>
                  <td>Republican</td>
                </tr>
                <tr onClick={(name, party) => this.handleRowSelect(name = 'Seth', party = 'RCrypto')}>
                  <td><input type="radio" checked={this.state.Name === 'Seth'} onChange={(name, party) => this.handleRowSelect(name = 'Seth', party = 'RCrypto')} /></td>
                  <td>Seth</td>
                  <td>RCrypto</td>
                </tr>
              </tbody>
            </table>
              
            <button
              type="button"
              className="btn btn-custom btn btn-block text-uppercase"
              disabled={this.state.submitted}
              onClick={this.createRecord.bind(this)}>
                {this.state.submitted ? 'Voting...' : 'Vote'}
            </button>
          </div>
        </div>

        {/* <table className="table table-striped table-bordered table-hover">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Party</th>
                    <th>Created on</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {recordList}
            </tbody>
        </table> */}
      </div>
    );
  }
}

const ClerkRaceExport = () => {
  if (document.getElementById('ClerkRaceComponent') != null) {
    const element = document.getElementById('props');
    const props = JSON.parse(element.getAttribute('data-props'));

    render(
      <ClerkRaceComponent
      user={props.user}
      validation={props.validation}
      public_key={props.public_key}
      />,
      document.getElementById('ClerkRaceComponent'),
    );
  }
};

module.exports = ClerkRaceExport();
