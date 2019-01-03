import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import App from './App';
import DeckList from './components/DeckList';
import DeckView from './components/DeckView';
import AddCard from './components/AddCard';
import AddCardNoDeck from './components/AddCardNoDeck';
import AddDeck from './components/AddDeck';

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={DeckList}/>
            <Route path='/addcard' component={AddCard}/>
            <Route path='/addcard-nodeck' component={AddCardNoDeck}/>
            <Route path='/adddeck' component={AddDeck}/>
            
            <Route path='/decks/:deck' component={DeckView}/>
            
        </Switch>   
    </BrowserRouter>
)

export default Router;