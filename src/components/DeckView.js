import React, { Component } from 'react'
import { connect } from 'react-redux';
import {getCardsToReview,displayLearningSessionButton } from '../utils/helpers';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';

const electron = window.require('electron');
const {ipcRenderer} = electron;


export class DeckView extends Component {

  addCard = (deck) => {
    ipcRenderer.send('show-addcard',deck)
  }

  render() {
    const {deck} = this.props.match.params;
    console.log(deck)
    const { decks } = this.props;
    console.log(decks)
    const vocab = decks[deck].vocab


    return (
        <div>
            <NavBar />
            <div className="container">
                <div className="deck view">
                    <p className="deck-title deckview">{decks[deck].title}</p>
                    <p className="cards-to-review">{vocab ? getCardsToReview(vocab) : null}</p>
                    <button className="btn refresh-btn" onClick={ () => this.addCard(deck)}>+ Add Card</button>
                    
                </div>

                {displayLearningSessionButton(vocab) === false  ?
                    <button
                    className="btn no-cards-btn"
                    >No cards left</button>          
                        :
                    <Link  to=""> <button className="btn quiz-btn">Learning Session</button></Link>
                    }
            </div>
      </div>
    )
  }
}


function mapStateToProps(decks) {
    return {
      decks
    }
  }
  
  export default connect(mapStateToProps)(DeckView)
  