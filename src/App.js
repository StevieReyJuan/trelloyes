import React, { Component } from 'react';
import List from './List';
import './App.css';
import STORE from './store';

const newRandomCard = () => {
  const id = Math.random().toString(36).substring(2, 4)
    + Math.random().toString(36).substring(2, 4);
  return {
    id,
    title: `Random Card ${id}`,
    content: 'lorem ipsum',
  }
}

function omit(obj, keyToOmit) {
  // Object.entries returns array consisting of kvp
  // [[key, value], [key, value]...]
  return Object.entries(obj).reduce(
    //accumulator, current item/value
    (newObj, [key, value]) =>
        key === keyToOmit ? newObj : {...newObj, [key]: value},
    {} // initial accumulator value
  );
}

class App extends Component {

  state = {
    store: STORE
  }

  handleDeleteCard = (cardId) => {
    const { lists, allCards } = this.state.store;
    // create a new array consisting of an object for each object
    // in 'lists' array. Returned objects consist of {{object @ [i]}, cardIds: any cardId that DOES NOT
    // match passed in cardId
    const newLists = lists.map(list => ({
      //destructure/spread obj into parent obj
      //id:
      //header:
      //cardIds:
      ...list,
      //and then cardIds overwritten by assigning value below
      cardIds: list.cardIds.filter(id => id !== cardId)
    }));

    const newCards = omit(allCards, cardId);

    this.setState({
      store: {
        lists: newLists,
        allCards: newCards
      }
    })
  };

  handleAddCard = (listId) => {
    const newCard = newRandomCard();

    const newLists = this.state.store.lists.map(list => {
      if (list.id === listId) {
      return {
        ...list,
        cardIds: [...list.cardIds, newCard.id]
        };
      }
      return list;
    })

    this.setState({
      store: {
        lists: newLists,
        allCards: {
          ...this.state.store.allCards,
          [newCard.id]: newCard        
        }
      }
    })
  };

  render() {
    const { store } = this.state

    return (
      <main className='App'>
        <header className='App-header'>
          <h1>Trelloyes</h1>
        </header>
        <div className='App-list'>
          {store.lists.map(list => (
            <List
              key={list.id}
              id={list.id}
              header={list.header}
              cards={list.cardIds.map(id => store.allCards[id])}
              onClickDelete={this.handleDeleteCard}
              onClickAdd={this.handleAddCard}
            />
          ))}
        </div>
      </main>
    );
  }
}

export default App;
