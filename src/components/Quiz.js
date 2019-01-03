import React, { Component } from 'react'
// import { autoUpdater } from 'electron';
import { Link } from 'react-router-dom'
import '../App.css';
import { TODAY } from '../utils/helpers';
import { connect } from 'react-redux';
import { scheduleSetter, receiveDecks} from "../actions/index.js";
import DB from '../utils/db';
import NavBar from './NavBar';

const electron = window.require('electron');
const {ipcRenderer} = electron;

export class Quiz extends Component {
  state = {
    db: new DB('jonathanrosado'),
    questionNumber:0,
    questionState:0,
    showRecto:false,
    easy:0,
    hard:0,
  }

  showVerso = () => (
    !this.state.showRecto ? this.setState({showRecto:true})
    : this.setState({ showRecto:false})
  )

  submitAnswer = (answer,id, multiplier) => {
    const { questionNumber } = this.state;
    const {deck} = this.props.match.params;
    const {decks } = this.props;
    const deckToReviewToday = decks[deck].vocab.filter(word => word.dueDate <= TODAY)

    // const easy = decks[deck].vocab[questionNumber].easyAnswer.toLowerCase()
    this.state.db.nextScheduleSetter(deck,id,multiplier)
    this.props.dispatch(scheduleSetter(decks[deck],deck,deckToReviewToday[this.state.questionState],multiplier))
    if(answer == 'easy' || answer == "very easy"){
      this.setState({
        easy: this.state.easy + 1,
      })
      this.setState({ 
        questionNumber: this.state.questionNumber + 1, 
        showRecto: false,
         questionState: this.state.questionState === 0 ? this.state.questionState : this.state.questionState - 1,
        })

    } else{
      this.setState({ hard: this.state.hard + 1, 
        questionState: this.state.questionState + 1 > deckToReviewToday.length -1 && this.state.questionState -1 < 0 ? this.state.questionState : this.state.questionState + 1 > deckToReviewToday.length - 1 ? this.state.questionState - 1 : this.state.questionState + 1
      })
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
    const {deck} = this.props.match.params;

    const deckToReviewToday = decks[deck].vocab.filter(word => word.dueDate <= TODAY)
    this.setState({
      decksToReview: deckToReviewToday.length
    })
  }


  render() {
   const { decks } = this.props;
    const {decksToReview} = this.state;
    const {deck} = this.props.match.params;
    const number = this.state.questionNumber + 1;
    const { questionNumber, questionState } = this.state;
    const deckToReviewToday = decks[deck].vocab.filter(word => word.dueDate <= TODAY)

    const {recto, verso} = this.state;

    if(questionNumber === decksToReview){
        return (
            <React.Fragment>
            <NavBar/>
                <div className="container">
                    <h4>You got  {this.state.easy} vocab out of {decksToReview} vocab!</h4>
                    {this.state.easy > this.state.hard ? <p className="emoji">:D</p>
                    : <p className="emoji"> :'( </p>}
                </div>
          </React.Fragment>
        )
      }

    return (
        <React.Fragment>
        <NavBar/>
      <div className="container">
        <div className="card view"> 
            <p>{number} / {decksToReview}</p>
            {!this.state.showRecto ?   <p className="card-text" >{deckToReviewToday[questionState].recto}</p>
            :<p className="card-text">{deckToReviewToday[questionState].verso}</p> }

            {!this.state.showRecto ? <button className="btn recto-verso"  onClick={this.showVerso}> Show Verso</button>
            :  <button className="btn recto-verso" onClick={this.showVerso}>Show Recto</button>}
        </div>
        <div className="answers">
        <button className="btn wrong"   onClick={() => this.submitAnswer('hard',deckToReviewToday[questionState].id,0)} > Hard </button>
          <button className="btn easy"  onClick={() => this.submitAnswer('easy',deckToReviewToday[questionState].id,2)}> Easy </button>
          <button className="btn very-easy"  onClick={() => this.submitAnswer('very easy',deckToReviewToday[questionState].id,3)}> Very Easy</button>
        </div>
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


export default connect(mapStateToProps)(Quiz)
