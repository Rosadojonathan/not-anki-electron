import React, { Component } from 'react'
// import { autoUpdater } from 'electron';
import { Link } from 'react-router-dom'
import '../App.css';
import { TODAY } from '../utils/helpers';
import { connect } from 'react-redux';
import { addCard,receiveDecks } from '../actions';
import DB from '../utils/db';
import NavBar from './NavBar';
import { addDeck } from "../actions";

const electron = window.require('electron');
const {ipcRenderer} = electron;

export class AddCard extends Component {
  state = {
    db: new DB('jonathanrosado'),
    deckname:"",
    deckAdded:false
  
  }

  updateValue = (e) => {

    this.setState({
        [e.target.name]: e.target.value
    })
  }

  onCancel = () => {
    // ipcRenderer.send('hide-addcard');
  }

  handleSave = (e) => {
    e.preventDefault()
    const {deckname} = this.state;

    if(deckname){
      this.state.db.saveDeck(deckname);
      this.props.dispatch(addDeck(deckname));
      this.setState({text:'',deckAdded:true})
      setTimeout(() => this.setState({deckAdded:false}), 1000)
    }
  }

  async componentDidMount() {
    let decks = await this.state.db.initializeDB();
    this.props.dispatch(receiveDecks(decks))
  }

  render() {
    const { decks } = this.props;
    const {recto, verso} = this.state;
    return (
        <React.Fragment>
            <NavBar/>
        
    
      <div className="container">
        <form >
            

            <h3>New Deck name</h3>
            <input className="new-deck" name="deckname" value={recto} type="text" onChange={this.updateValue}/>
            <br/>
            
            {this.state.deckAdded ? 
            <p className="btn add-card-success">Successfully Added card</p>
             :
            <React.Fragment>
              <button className="btn refresh-btn" onClick={(e) => this.handleSave(e)}>Save</button>
              <button className="btn cancel-btn" onClick={() => this.onCancel()}>Cancel</button>
            </React.Fragment> }
            

          
        </form>
      </div>
      </React.Fragment>
    )
  }
}
function mapStateToProps(decks){
	return {
		decks
	}
}

export default connect(mapStateToProps)(AddCard)
