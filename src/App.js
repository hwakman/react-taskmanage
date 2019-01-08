import React, { Component, Fragment } from 'react';
import writeFileP from 'write-file-p';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Demo from './demo.json'

class TaskList extends Component {
  render(){
    return(
    <div className="col-lg-4 col-sm-12 mb-3 p-1" style={this.props.show ? {display:"block"}:{display:"none"}}>
      <span className="bg-dark justify-content-between align-items-center d-flex rounded shadow-sm">
        <span className="text-light p-2">Ticket #{this.props.ticket}</span>
        <span className="p-3">
          <span className="bg-primary p-2 m-1 rounded-pill text-white" style={{cursor:"pointer"}} onClick={this.props.finish}>Finish</span>
          <span className="bg-warning p-2 m-1 rounded-pill text-white" style={{cursor:"pointer"}} onClick={this.props.return}>Return</span>
          <span className="bg-danger p-2 m-1 rounded-pill text-white" style={{cursor:"pointer"}} onClick={this.props.remove}>Commit</span>
        </span>
      </span>
    </div>
    )
  }
}
// Finish section
class FinishedList extends Component {
  render(){
    return(
    <span className="col-lg-3 mb-3 p-2" style={this.props.show ? {display:"block"}:{display:"none"}}>
      <span className="bg-dark justify-content-between align-items-center d-flex rounded shadow-sm">
        <span className="text-light p-2">Ticket #{this.props.ticket}</span>
        <span className="text-light p-2 bg-danger rounded-right" style={{cursor:"pointer"}} onClick={this.props.commit}>Commit</span>
      </span>
    </span>
    )
  }
}

// Return section
class ReturnList extends Component {
  render(){
    return(
      <span className="col-lg-3 mb-3 p-2" style={this.props.show ? {display:"block"}:{display:"none"}}>
      <span className="bg-dark justify-content-between align-items-center d-flex rounded shadow-sm">
        <span className="text-light p-2">Ticket #{this.props.ticket}</span>
        <span className="text-light p-2 bg-info rounded-right" style={{cursor:"pointer"}} onClick={this.props.finish}>Finish</span>
      </span>
    </span>
    )
  }
}

// Commited section
class CommitedList extends Component {
  render(){
    return(
      <span className="col-lg-3 mb-3 p-2" style={this.props.show ? {display:"block"}:{display:"none"}}>
      <span className="bg-dark justify-content-between align-items-center d-flex rounded shadow-sm">
        <span className="text-light p-2">Ticket #{this.props.ticket}</span>
        <span className="text-light p-2 bg-primary rounded-right" style={{cursor:"pointer"}} onClick={this.props.revert}>Revert</span>
      </span>
    </span>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.inputTicket = React.createRef();
    this.state = {
      ticket : [],
      tempTicket : {},
      showTicket : [],
      commit: [],
      finish: [],
      return: [],
      showOngoing : true,
      showFinish : false,
      showReturn : false,
      showCommit : false
    }
    this.changeTicket = this.changeTicket.bind(this);
    this.setTicket = this.setTicket.bind(this);
    this.clearTicket = this.clearTicket.bind(this);
    this.reload = this.reload.bind(this);
    this.removeTicket = this.removeTicket.bind(this);
    this.returnTicket = this.returnTicket.bind(this);
    this.finishTicket = this.finishTicket.bind(this);
    this.finishToCommit = this.finishToCommit.bind(this);
    this.returnToFinish = this.returnToFinish.bind(this);
    this.commitToRevert = this.commitToRevert.bind(this);
    this.toggleShowOngoing = this.toggleShowOngoing.bind(this);
    this.toggleShowFinish = this.toggleShowFinish.bind(this);
    this.toggleShowReturn = this.toggleShowReturn.bind(this);
    this.toggleShowCommit = this.toggleShowCommit.bind(this);
    this.exportCSV = this.exportCSV.bind(this);
  }
  changeTicket = e => {
    this.setState({
      tempTicket:{fin: 0,return: 0,ticket:e.target.value}
    });
  }

  // Add new ticket
  setTicket = () => {
    if(this.state.tempTicket.ticket){
    let colleTicket = this.state.ticket;
    colleTicket.push(this.state.tempTicket);
      this.setState({
        ticket: colleTicket
      });      
    this.inputTicket.current.value = '';
    this.inputTicket.current.focus();
    this.setState({tempTicket:{}})
    }
  }

  removeTicket = e => {
    let removeTemp = this.state.ticket;
    let commitTemp = this.state.commit;
    commitTemp.push(removeTemp[e].ticket);
    removeTemp.splice(e,1);
    this.setState({
      ticket:removeTemp,
      commit: commitTemp
    });
  }

  // Return ticket
  returnTicket = e => {
    let removeTemp = this.state.ticket;
    let returnTemp = this.state.return;
    returnTemp.push(removeTemp[e].ticket);
    removeTemp.splice(e,1);
    this.setState({
      ticket:removeTemp,
      return: returnTemp
    });
  }

  // Finish ticket
  finishTicket = e => {
    let removeTemp = this.state.ticket;
    let finishTemp = this.state.finish;
    finishTemp.push(removeTemp[e].ticket);
    removeTemp.splice(e,1);
    this.setState({
      ticket:removeTemp,
      finish: finishTemp
    });
  }

  // Finish to commit
  finishToCommit = e => {
    let removeTemp = this.state.finish;
    let commitTemp = this.state.commit;
    commitTemp.push(removeTemp[e]);
    removeTemp.splice(e,1);
    this.setState({
      finish: removeTemp,
      commit: commitTemp
    });
  }

  // Return to finish
  returnToFinish = e => {
    let removeTemp = this.state.return;
    let finishTemp = this.state.finish;
    finishTemp.push(removeTemp[e]);
    removeTemp.splice(e,1);
    this.setState({
      return: removeTemp,
      finish: finishTemp
    });
  }

  // Commit to revert
  commitToRevert = e => {
    let removeTemp = this.state.commit;
    let ticketTemp = this.state.ticket;
    ticketTemp.push({fin:0,return:0,ticket:removeTemp[e]});
    removeTemp.splice(e,1);
    this.setState({
      commit: removeTemp,
      ticket: ticketTemp
    });
  }

  // Toggle ongoing
  toggleShowOngoing = () => {
    this.setState({
      showOngoing: !this.state.showOngoing
    });
  }

  // Toggle finish
  toggleShowFinish = () => {
    this.setState({
      showFinish: !this.state.showFinish
    });
  }

  // Toggle return
  toggleShowReturn = () => {
    this.setState({
      showReturn: !this.state.showReturn
    });
  }

  // Toggle commit
  toggleShowCommit = () => {
    this.setState({
      showCommit: !this.state.showCommit
    });
  }

  // Remove all ticket
  clearTicket = () => {
    this.setState({
      ticket: [],
      tempTicket: {}
    })
  }

  // Reload
  reload = () => {
    this.setState({
      showTicket: this.state.ticket.filter(data => (data.del === 0))
    })
  }

  // Set element when start
  componentDidMount(){
    this.setState({
      ticket: Demo.ticket,
      finish: Demo.finish,
      return: Demo.return,
      commit: Demo.commit
    });
  }

  exportCSV = () => {
    let CSV = '{"ongoing":[';
    this.state.ticket.map(data => (CSV += '"'+data.ticket+'",'));
    CSV = CSV.substring(0,CSV.length - 1);
    CSV += '],"Finish":[';
    this.state.finish.map(data => (CSV += '"'+data+'",'));
    CSV = CSV.substring(0,CSV.length - 1);
    CSV += '],"Return":[';
    this.state.return.map(data => (CSV += '"'+data+'",'));
    CSV = CSV.substring(0,CSV.length - 1);
    CSV += '],"Commit":[';
    this.state.commit.map(data => (CSV += '"'+data+'",'));
    CSV = CSV.substring(0,CSV.length - 1);
    CSV += ']}';
    
    return document.write(CSV);
  }

  render() {
    return (
      <Fragment>
        <nav className="navbar navbar-white bg-white shadow-sm">
          <div className="container-fluid">
            <span className="btn btn-white"><b>HOME</b></span>
          </div>
        </nav>

        <div className="container">
          <div className="row mb-4 p-3">
              <div className="form-inline mt-3 col-sm-12 d-flex justify-content-center">
                <input type='text' maxLength={5} className="form-control col-9 mr-2" placeholder="Ticket NO." ref={this.inputTicket} onChange={this.changeTicket}/>
                <button className="btn btn-primary mr-2" onClick={this.setTicket}>Add</button>
              </div>

              <div className="mt-3 col-sm-12 d-flex justify-content-center">
                <button className="btn btn-info m-1 pl-3 pr-3" onClick={this.exportCSV}>
                  Import
                </button>
                <button className="btn btn-light m-1 pl-3 pr-3" onClick={this.exportCSV}>
                  Export
                </button>
                <button className="btn btn-warning m-1 pl-3 pr-3" onClick={this.exportCSV}>
                  JSON
                </button>
                <button className="btn btn-danger m-1 pl-3 pr-3" onClick={this.exportCSV}>
                  Clear
                </button>
              </div>
          </div>

          <div className="row mb-4 p-3 bg-light shadow-sm rounded" style={{overflow:"hidden"}}>
            <span className="col-12 d-flex justify-content-between">
              <h4>Status</h4>
              <small style={{cursor:"pointer"}}>View All</small>
            </span>

              <span className="col-lg-12 col-sm d-flex justify-content-center">
                Ongoing ({this.state.ticket.length}) : 
                Finished ({this.state.finish.length}) : 
                Return ({this.state.return.length}) : 
                Commited ({this.state.commit.length})
              </span>
          </div>

          <div className="row mb-4 p-3 bg-light shadow-sm rounded" style={{overflow:"hidden"}}>
            <span className="col-12 d-flex justify-content-between">
              <h4>Ongoing ({this.state.ticket.length})</h4>
              <small style={{cursor:"pointer"}} onClick={this.toggleShowOngoing}>{this.state.showOngoing ? "Hide":"Show"}</small>
            </span>

            {this.state.ticket.map((data,key) => 
              <TaskList key={key} progress={data.progress} ticket={data.ticket} 
              remove={this.removeTicket.bind(this,key)}
              return={this.returnTicket.bind(this,key)}
              finish={this.finishTicket.bind(this,key)}
              show={this.state.showOngoing}
              />
            )}
          </div>

          <div className="row mb-4 p-3 bg-light shadow-sm rounded" style={{overflow:"hidden"}}>
            <span className="col-12 d-flex justify-content-between">
              <h4>Finished ({this.state.finish.length})</h4>
              <small style={{cursor:"pointer"}} onClick={this.toggleShowFinish}>{this.state.showFinish ? "Hide":"Show"}</small>
            </span>

            {this.state.finish.map((data,key) => 
              <FinishedList key={key} ticket={data} commit={this.finishToCommit.bind(this,key)} show={this.state.showFinish} />  
            )}
          </div>

          <div className="row mb-4 p-3 bg-light shadow-sm rounded" style={{overflow:"hidden"}}>
            <span className="col-12 d-flex justify-content-between">
              <h4>Return ({this.state.return.length})</h4>
              <small style={{cursor:"pointer"}} onClick={this.toggleShowReturn}>{this.state.showReturn ? "Hide":"Show"}</small>
            </span>

            {this.state.return.map((data,key) => 
              <ReturnList key={key} ticket={data} finish={this.returnToFinish.bind(this,key)} show={this.state.showReturn} />  
            )}
          </div>

          <div className="row mb-4 p-3 bg-light shadow-sm rounded" style={{overflow:"hidden"}}>
            <span className="col-12 d-flex justify-content-between">
              <h4>Commited ({this.state.commit.length})</h4>
              <small style={{cursor:"pointer"}} onClick={this.toggleShowCommit}>{this.state.showCommit ? "Hide":"Show"}</small>
            </span>

            {this.state.commit.map((data,key) => 
              <CommitedList key={key} ticket={data} revert={this.commitToRevert.bind(this,key)} show={this.state.showCommit} />  
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
