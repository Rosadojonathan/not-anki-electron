import React, { Component } from 'react'
// import { autoUpdater } from 'electron';
import { Link } from 'react-router-dom'
import '../App.css';
import { TODAY } from '../utils/helpers';
import { connect } from 'react-redux';
import { addCard,receiveDecks } from '../actions';
import DB from '../utils/db';

const electron = window.require('electron');
const {ipcRenderer} = electron;

export class AddCard extends Component {
  state = {
    db: new DB('jonathanrosado'),
    recto: '',
    verso:''
  
  }

  updateValue = (e) => {

    this.setState({
        [e.target.name]: e.target.value
    })
  }

  onCancel = () => {
    ipcRenderer.send('hide-addcard');
  }

  handleSave = async (e) => {
    e.preventDefault()
    const {recto, verso, deck} = this.state;
    let decks = await this.state.db.initializeDB();
    console.log(decks);
    this.props.dispatch(receiveDecks(decks))

    if(recto && verso){
      this.state.db.addCardToDeck(deck,{recto,verso}).then(
        (value) => {  
          console.log('card added :');
          console.log(value);
          let dueDate = TODAY;
          let { recto, verso, difficulty, interval, update, id} = value
          this.props.dispatch(addCard({recto, verso, difficulty, interval, update, id, deck,dueDate}));
          this.setState({ recto:'',verso:'', cardAdded:true});
          setTimeout(() => this.setState({cardAdded:false}), 1000)
        }
      )
    }
  }

  async componentDidMount() {
    let decks = await this.state.db.initializeDB();
    console.log(decks);
    this.props.dispatch(receiveDecks(decks))

    ipcRenderer.on('deck',(event,arg) => {
      this.setState({
        deck: arg
      })
    })    
  }


  render() {
    const {deck} = this.state
    console.log(deck)
    const {decks} = this.props;
    console.log(decks);


    const {recto, verso} = this.state;

    return (
      <div className="container">
        <form >
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
    )
  }
}
function mapStateToProps(decks){
	return {
		decks
	}
}


export default connect(mapStateToProps)(AddCard)
