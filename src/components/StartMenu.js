import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paper, Button } from 'react-md';

import CreateMenu from './CreateMenu';
import FirstMenu from './FirstMenu';

/*
Menu in UI with interchangeable content.
*/
class StartMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: 'first',
    };

    this.showCreate = this.showCreate.bind(this);
    this.showAbout = this.showAbout.bind(this);
    this.showFirst = this.showFirst.bind(this);
  }

  /*
  Show the menu for creating games.
  */
  showCreate() {
    this.setState({ menu: 'create' });
  }

  /*
  Show the about page.
  */
  showAbout() {
    this.setState({ menu: 'about' });
  }

  /*
  Show the initial menu.
  */
  showFirst() {
    this.setState({ menu: 'first' });
  }

  render() {
    console.log(this.state.menu);
    const menus = {
      first: <FirstMenu showCreate={this.showCreate} showAbout={this.showAbout} />,

      create: (
        <CreateMenu
          onStart={this.props.onGameStart}
          onBack={this.showFirst}
          communication={this.props.communication}
        />
      ),
      about: (
        <div>
          <div className="aboutHeader">About </div>
          <div className="aboutText">
            Detta projekt utfördes som en del av kursen Kandidatprojekt i Programvaruutveckling på
            LiTH våren 2018. Det utförs av en grupp studenter som går civilingenjör i datateknik
            samt civilingenjör i mjukvaruteknik. Vi vill tacka Cybercom Group för möjligheten att
            utföra ett intressant och givande projekt. Projektmedlemmarna har fått ett mycket varmt
            bemötande och är tacksamma för den intressanta insikt vi har fått i organisationen. De
            praktiska möjligheterna i form av arbetsplatser uppskattas även mycket och har på många
            sätt underlättat arbetet.
            <br />
            <br />Ett speciellt tack vill vi rikta till Cybercoms IoT-grupp i Linköping som har
            varit mycket seriösa och hjälpsamma som kunder för projektet. Projektgruppen är mycket
            tacksam för alla de tips och idéer som vi har fått. Att få ta del av erfarenheter inom
            de tekniker som använts i projektet har många gånger sparat oss stora mängder tid och
            frustration.
            <br />
            <br />Tack även till vår handledare Carl Brage för stöd genom hela projektet. Den
            respons vi har fått på dokument och presentationer har givit oss många nyttiga tips som
            vi kan ta med oss även utanför detta projekt. Kvaliteten på denna rapport har uppnåtts
            mycket tack vare all konstruktiv återkoppling från vår handledare.
          </div>
          <Button raised primary onClick={this.showFirst} className="menu-button">
            Back
          </Button>
        </div>
      ),
    };

    return (
      <div className="center-menu">
        <div className="game-title">Ball Game</div>
        <Paper className="menu-button-holder">{menus[this.state.menu]}</Paper>
      </div>
    );
  }
}

StartMenu.propTypes = {
  onGameStart: PropTypes.func.isRequired,
  /* eslint-disable */
  communication: PropTypes.object.isRequired,
  /* eslint-enable */
};

export default StartMenu;
