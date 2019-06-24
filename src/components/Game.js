import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RandomNumber from './RandomNumber'
import { StyleSheet,Alert,Button, Text, View} from 'react-native';
import shuffle from 'lodash.shuffle';


export default class Game extends Component{
    static propTypes={
        randomNumberCount : PropTypes.number.isRequired,
        initialSecond : PropTypes.number.isRequired,
        onPlayAgain : PropTypes.func.isRequired,
    }
    state={
        selectedNumbers:[],
        remainingSecond : this.props.initialSecond,
    }
    gameStatus='PLAYING';
    randomNumbers=Array
        .from({length:this.props.randomNumberCount})
        .map(()=>1+Math.floor(10 * Math.random()));
    target=this.randomNumbers
        .slice(0,this.props.randomNumberCount-2)
        .reduce((acc,curr)=> acc + curr,0);
        suffledRandomNumber =shuffle(this.randomNumbers);
    componentDidMount(){
        this.intervalId=setInterval (()=>{
        this.setState((prevState)=>{
            return {remainingSecond:prevState.remainingSecond-1};
        },()=>{
            if(this.state.remainingSecond===0){
                clearInterval(this.intervalId);
            }
        });
        },1000);
    }
    componentWillUnmount(){
        clearInterval(this.intervalId);
    }
        
    isNumberSelected = (numberindex)=>{
            return this.state.selectedNumbers.indexOf(numberindex)>=0;
        }
    selectNumber =(numberIndex)=>{
        this.setState((prevState)=>({
            selectedNumbers:[...prevState.selectedNumbers,numberIndex],
        }));
    };
    componentWillUpdate(nextProps,nextState){
        if(nextState.selectedNumbers != this.state.selectedNumbers || 
        nextState.remainingSecond===0)
        {
            this.gameStatus=this.calcGameStatus(nextState)
            if(this.gameStatus!='PLAYING'){
                clearInterval(this.intervalId);
            }
        }
    }
    calcGameStatus = (nextState) =>{
        const sumSelected = nextState.selectedNumbers.reduce((acc,curr)=>{
            return acc + this.suffledRandomNumber[curr];
        }, 0);
        if(nextState.remainingSecond===0){
            return 'LOST';
        }
        if(sumSelected<this.target){
            return 'PLAYING';
        }
       if(sumSelected===this.target)
        {
            return 'WON';
        }
       if(sumSelected>this.target)
        {
            return 'LOST';
        }
    }
    render() {
        const gameStatus=this.gameStatus;
    return (
      <View style={styles.container}>
      <Text>Remainig Time : {this.state.remainingSecond}</Text>
       <Text style={[styles.target, styles['STATUS_${this.gameStatus}']]}>{this.target}</Text>
       <View style={styles.randomContainer}>
       {this.suffledRandomNumber.map((randomNumber,index)=>
        <RandomNumber 
        id={index}
        key={index} number={randomNumber}
        isSelected={this.isNumberSelected(index) || gameStatus !=='PLAYING'}
        onPress={this.selectNumber}/>
        // <Text style={styles.random} key={index}>{randomNumber} </Text>
    )}
       </View>
       
       {this.gameStatus!=='PLAYING' && (
           Alert.alert(
            'You',
            this.gameStatus,
            [
            {text: 'OK', onPress: () => console.log("ok clicked") },
            ],
             { cancelable: false }
        )
       
       )}
        {this.gameStatus!=='PLAYING' && (
              <Button title="PLAY AGAIN" onPress={this.props.onPlayAgain}/>
        )}
       
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:40,
    paddingBottom:20,
    backgroundColor: '#F5FCFF',
  },
  target:{
    fontSize:40,
    backgroundColor:'#aaa',
    margin:50,
    textAlign:'center',
  },
  randomContainer:{
    flex:1,
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-around',

  },

  STATUS_PLAYING:{
    backgroundColor:'#aaa',
  },
  STATUS_WON:{
    backgroundColor:'green',
  },
  STATUS_LOST:{
    backgroundColor:'red',
  },

});