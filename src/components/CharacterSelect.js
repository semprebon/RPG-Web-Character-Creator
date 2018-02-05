import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeData, addCharacter, changeCharacter, deleteCharacter} from '../actions';
import popup from 'react-popup';
import {Archetype, Career} from './index';

class CharacterSelect extends React.Component {
    state = {name: this.props.description.name, playerName: this.props.description.playerName, character: ''};

    componentWillReceiveProps(nextProps) {
        if (this.props.character !== nextProps.character) this.setState({character: nextProps.character});
        if (this.props.description.playerName !== nextProps.description.playerName) this.setState({playerName: nextProps.description.playerName});
        if (this.props.description.name !== nextProps.description.name) this.setState({name: nextProps.description.name});
    }

    handleClick = (type) => {
        let content = <div/>;
        if (type === 'archetype') content = <Archetype/>;
        if (type === 'career') content = <Career/>;
        popup.create({
            title: `Select ${type}`,
            className: 'alert',
            content: (content),
        })
    };

    handleNewCharacter = () => {
        this.props.addCharacter();
    };

    handleDeleteCharacter = () => {
        this.props.deleteCharacter();
    };

    handleSelect = (event) => {
        const {changeCharacter} = this.props;
        changeCharacter(event.target.value);
        event.preventDefault();
    };

    handleChange = (type, event) => {
        this.setState({[type]: event.target.value});
        event.preventDefault();
    };

    handleBlur = (type, event) => {
        const {changeData, description} = this.props;
        let newObj = {...description};
        newObj[type] = this.state[type];
        changeData(newObj, 'description');
        event.preventDefault();
    };

    render() {
        const {archetype, archetypes, careers, career, characterList} = this.props;
        const {name, playerName, character} = this.state;
        return (
            <div className='inlineblock' style={{width: '60%'}}>
                <div className='module-header'>CHARACTER</div>
                <hr />
                <select value={character ? character : ''} onChange={this.handleSelect}>
                    {Object.keys(characterList).map((key)=>
                        <option value={key} key={key}>{characterList[key].description ? characterList[key].description.name : key}</option>
                    )}
                </select>
                <button onClick={this.handleNewCharacter}>New Character</button>
                <button onClick={this.handleDeleteCharacter}>Delete Character</button>
                <div className='fieldLabel'>CHARACTER NAME:
                    <input type='text' value={name} maxLength='25' onChange={this.handleChange.bind(this, 'name')} onBlur={this.handleBlur.bind(this, 'name')}/>
                </div>
                <hr />
                <div className='fieldLabel' onClick={this.handleClick.bind(this, 'archetype')}>ARCHETYPE: <div className='fieldData'>{archetype===null ? '' : archetypes[archetype].name}</div>
                </div>
                <hr />
                <div className='fieldLabel'onClick={this.handleClick.bind(this, 'career')}>CAREER: <div className='fieldData'>{career===null ? '' : careers[career].name}</div>
                </div>
                <hr />
                <div className='fieldLabel'>PLAYER NAME:
                    <input type='text' value={playerName} maxLength='25' onChange={this.handleChange.bind(this, 'playerName')} onBlur={this.handleBlur.bind(this, 'playerName')}/>
                </div>
                <hr />
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {
        archetype: state.archetype,
        archetypes: state.archetypes,
        career: state.career,
        careers: state.careers,
        description: state.description,
        user: state.user,
        characterList: state.characterList,
        character: state.character,
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({changeData, addCharacter, changeCharacter, deleteCharacter}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(CharacterSelect);