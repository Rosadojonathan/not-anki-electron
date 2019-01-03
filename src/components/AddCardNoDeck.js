import React, { Component } from 'react'
// import { autoUpdater } from 'electron';
import { Link } from 'react-router-dom'
import '../App.css';
import { TODAY } from '../utils/helpers';
import { connect } from 'react-redux';
import { addCard,receiveDecks } from '../actions';
import DB from '../utils/db';
import NavBar from './NavBar';

const electron = window.require('electron');
const {ipcRenderer} = electron;

export class AddCardNoDeck extends Component {
  state = {
    db: new DB('jonathanrosado'),
    recto: '',
    verso:'',
    deck:'',
  
  }

  updateValue = (e) => {

    this.setState({
        [e.target.name]: e.target.value
    })
  }

  onCancel = () => {
    ipcRenderer.send('hide-addcard');
  }

  handleSave = (e) => {
    e.preventDefault()
    const {recto, verso, deck} = this.state;

    if(recto && verso){
      this.state.db.addCardToDeck(deck,{recto,verso}).then(
        (value) => {
          console.log('card added :');
          console.log(value);
          let dueDate = TODAY;
          let { recto, verso, difficulty, interval, update, id} = value
          this.props.dispatch(addCard({recto, verso, difficulty, interval, update, id, deck,dueDate}));
          this.setState({ recto:'',verso:'', deck:'', cardAdded:true});
          setTimeout(() => this.setState({cardAdded:false}), 1000)
        }
      )
    }
  }

  async componentDidMount() {
    let decks = await this.state.db.initializeDB();
    this.props.dispatch(receiveDecks(decks))
  }

  render() {
    const { decks } = this.props
    const {recto, verso} = this.state;
    return (
        <React.Fragment>
            <NavBar/>
        
    
      <div className="container">
        <form >
            <h3>Deck</h3>
            <select name="deck" id="deckname" className="deckname-selector" onChange={this.updateValue}>
                <option value="">Select a Deck</option>
                {Object.keys(decks).map(deckname => (
                    <option value={deckname}> {deckname} </option>
                ))}
            </select>
            

            <h3>Recto</h3>
            <textarea name="recto" value={recto} type="text" onChange={this.updateValue}/>
            <br/>
            <h3>Verso</h3>
            <textarea name="verso" value={verso} type="text" onChange={this.updateValue}/>

            {this.state.cardAdded ? 
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

export default connect(mapStateToProps)(AddCardNoDeck)
