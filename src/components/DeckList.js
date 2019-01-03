import React, { Component } from 'react'
// import { getDecks } from '../utils/api'
import { receiveDecks } from '../actions'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import '../App.css';
import DB from '../utils/db';
import { black, white,grey, deepBlue,green,GhostWhite } from '../utils/colors'
import { getCardsToReview } from '../utils/helpers';
import NavBar from './NavBar';

const electron = window.require('electron');
const {ipcRenderer} = electron;

class DeckList extends Component {
    state = {
        db: new DB('jonathanrosado'),
    }

    async componentDidMount() {
        let decks = await this.state.db.initializeDB();
        console.log(decks);
        this.props.receiveAllDecks(decks)
        
    }
    
    addCard = () => {
        ipcRenderer.send('toggle-addcard')
    }

    syncData = async () => {
        await this.state.db.sync();
        let decks = await this.state.db.initializeDB();
        console.log(decks);
        this.props.receiveAllDecks(decks)
    }
  render() {
    const { decks } = this.props
    // console.log(decks);

    return (
    <React.Fragment>
    <NavBar />
      <div className="container">
        {Object.keys(decks).map((deck) => {
					const { title, vocab } = decks[deck]
					return (
						<div key={deck} className="deck">
							<p className="deck-title">{title}</p>
							<p className="cards-to-review">{vocab ? getCardsToReview(vocab) : null}</p>

							<Link to={`/decks/${deck}`}> <button className="btn deck-btn">View Deck </button></Link>
						</div>
					)
				})}
            <button className="btn refresh-btn" onClick={() => this.syncData()}> Sync Data </button>        
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

function mapDispatchToProps(dispatch){
	return {
		receiveAllDecks: (decks) => dispatch(receiveDecks(decks))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckList)
