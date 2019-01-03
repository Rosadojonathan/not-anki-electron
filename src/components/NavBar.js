import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import '../App.css';

export default class NavBar extends Component {
  render() {
    return (
      <div className="navbar">
        <Link style={{textDecoration:'none', marginLeft:'22%'}} to="/"> Decks </Link>
        <Link style={{textDecoration:'none'}} to="/addcard-nodeck">Add Card</Link>
        <Link style={{textDecoration:'none'}} to="/adddeck">Add Deck</Link>
      </div>
    )
  }
}
