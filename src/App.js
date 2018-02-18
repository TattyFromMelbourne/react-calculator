import React, { Component } from 'react';
import math from 'mathjs';
import './App.css';

/* Global constants */
const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const operators =['/', '*','-','+','='];

/* Only 6 characters can be displayed at the optimal full size.
If the character string is longer, we need to scale the display down */
const maxCharsAtFullSize = 6;
const scaleFactor = 'scale(0.32)';

const maxInputNumber = 999999999999999.9;
const minInputNumber = 0.000000000000001;
const usePrecision = 16;

/* Components */
class CalculatorDisplay extends Component {
      render() {
      /* If more characters cannot be displayed in given area, make the
      displayed characters smaller */
      const { value } = this.props;
      const scaleDown = (`${value}`.length) > maxCharsAtFullSize ? scaleFactor:'scale(1)';
      var formattedValue = parseFloat(value).toLocaleString({maximumSignificantDigits: usePrecision});

        return (
          <div className="calculator-display">
            <div className="auto-scaling-text" style={{transform: scaleDown}}>
              {value}
            </div>
          </div>
        );
    }
}

class Calculator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayValue: '0',
      operator: null,
      waitingForOperand: false,
      firstOperand: '0'
    }
  }

  processDigit(newKeyValue) {
    const oldDisplayValue = `${(this.state.displayValue)}`;
    const waitingForOperand = this.state.waitingForOperand;

    if (waitingForOperand) {
      this.setState({
        displayValue: newKeyValue,
        waitingForOperand: false
      })
    } else {
      var newDisplayValue = (oldDisplayValue === '0') ? `${newKeyValue}` : `${(this.state.displayValue)}${newKeyValue}`; //no leading zero

      if ( parseFloat(newDisplayValue) < maxInputNumber && parseFloat(newDisplayValue).toPrecision(usePrecision) > minInputNumber )  //make sure input within accepatble range
        this.setState({
          displayValue: newDisplayValue,
          waitingForOperand: false
        })
      }
    }

  processOperator(newKeyValue) {
    console.log("state coming  into processOperator method:", JSON.stringify(this.state));

    const oldDisplayValue = this.state.displayValue;
    const oldOperator = this.state.operator;
    const oldWaitingForOperand = this.state.waitingForOperand;
    const oldFirstOperand = this.state.firstOperand;

    var newDisplayValue = this.state.displayValue;
    var newOperator = this.state.operator;
    /*
    var newWaitingForOperand = this.state.waitingForOperand;
    var newFirstOperand = this.state.firstOperand;
    */

    console.log("oldDisplayValue:", oldDisplayValue);
    console.log("oldOperator:", oldOperator);
    console.log("oldWaitingForOperand:", oldWaitingForOperand);
    console.log("oldFirstOperand:", oldFirstOperand);
    console.log("newKeyValue", newKeyValue);

    var stringToEvaluate;
    var evaluatedValue;

    if (oldFirstOperand === '0' || oldOperator == null || oldWaitingForOperand ) {  // if not ready to do calculation
      this.setState({
        displayValue: oldDisplayValue,
        waitingForOperand: true,
        firstOperand: oldDisplayValue,
        operator: newKeyValue
      })

      console.log("displayValue:", oldDisplayValue);
      console.log("waitingForOperand:", true);
      console.log("firstOperand:", oldDisplayValue);
      console.log("operator:", newKeyValue);
      console.log("cannot make calculation yet!");
    } else {

      stringToEvaluate = oldFirstOperand + oldOperator + oldDisplayValue;
      console.log("stringToEvaluate:", stringToEvaluate);

      try {
        evaluatedValue = math.eval(stringToEvaluate);
        newDisplayValue = evaluatedValue.toString();
      } catch(e) {
        newDisplayValue = 'Error';
      }

      if (newDisplayValue === "Infinity") evaluatedValue = '0'; //math.js evaluates division by 0 to be "Infinity"
      if (newDisplayValue === "Infinity") newDisplayValue = 'Error';

      console.log("evaluatedValue:", evaluatedValue);

      newOperator = (newKeyValue === "=")? null: newKeyValue;

      this.setState({
        displayValue: newDisplayValue,
        waitingForOperand: true,
        firstOperand: newDisplayValue,
        operator: newOperator
      })

      console.log("displayValue:", newDisplayValue);
      console.log("waitingForOperand:", true);
      console.log("firstOperand:", evaluatedValue);
      console.log("operator:", newOperator);

    }
  }

  processDot(newKeyValue) {
    const oldDisplayValue = this.state.displayValue;
    const oldOperator = this.state.operator;
    const oldWaitingForOperand = this.state.waitingForOperand;
    const oldFirstOperand = this.state.firstOperand;

    const needDot= `${oldDisplayValue}`.indexOf('.');

    console.log('---- processDot ---');
    console.log("oldDisplayValue:", oldDisplayValue);
    console.log("oldOperator:", oldOperator);
    console.log("oldWaitingForOperand:", oldWaitingForOperand);
    console.log("oldFirstOperand:", oldFirstOperand);
    console.log("newKeyValue", newKeyValue);


    if (oldWaitingForOperand) {
      this.setState({
        displayValue: '0.',
        waitingForOperand: false
      })
    } else {
      if ( needDot === -1 ) { //only allow point if it's not already present or we are starting on a new operand
        var newDisplayValue = `${oldDisplayValue}${newKeyValue}`;
        this.setState({
          displayValue: newDisplayValue,
          waitingForOperand: false
        })
      }
    }

    /*

    console.log('needDot', needDot);
    if ( needDot === -1 ) { //only allow point if it's not already present or we are starting on a new operand
      var newDisplayValue = `${(this.state.displayValue)}${newKeyValue}`;
      this.setState({
        displayValue: newDisplayValue,
        waitingForOperand: false
      })
    }
    */
  }

  processPercentage(newKeyValue) {
    const oldDisplayValue = `${(this.state.displayValue)}`;
    const newDisplayValue = parseFloat(oldDisplayValue).toPrecision(usePrecision) / 100
    this.setState({
      displayValue: newDisplayValue,
      waitingForOperand: false
    })
  }

  processPlusMinusToggle(newKeyValue) {
    const oldDisplayValue = `${(this.state.displayValue)}`;
    const newDisplayValue = parseFloat(oldDisplayValue).toPrecision(usePrecision) * -1
    this.setState({
      displayValue: newDisplayValue,
      waitingForOperand: false
    })
  }

  processClear() {
    this.setState({
        displayValue: '0',
        firstOperand: '0',
        operator: null,
        waitingForOperand: false
    })
  }

  processFunctionKey(newKeyValue) {
    switch(newKeyValue) {
        case "C":
          this.processClear(newKeyValue);
        break;
        case "±":
          this.processPlusMinusToggle(newKeyValue);
        break;
        case ".":
          this.processDot(newKeyValue);
        break;
        case "%":
          this.processPercentage(newKeyValue);
        break;
        default:
          this.processUnknownKey(newKeyValue);
    }
  }

  processUnknownKey(newKeyValue){
    /* don't do anything, just write the error to the console log */
    console.log('Unexpected input: ', newKeyValue);
  }

  handleClick = (e) => {
    const newKeyValue = `${e.target.value}`;
    const isDigit = digits.includes(newKeyValue);

    if (isDigit) {
      this.processDigit(newKeyValue);
    } else {
      var isOperator = operators.includes(newKeyValue);
      if (isOperator) {
          this.processOperator(newKeyValue);
      } else {
          this.processFunctionKey(newKeyValue)
      }
    }
  }

  render() {
      return (
          <div className="calculator">
            <CalculatorDisplay value={this.state.displayValue}/>

            <div className="calculator-keypad">
              <div className="input-keys">
                <div className="function-keys">
                  <button id="key-clear" value="C" className="calculator-key key-clear" onClick={this.handleClick}>AC</button>
                  <button id="key-sign" value="±" className="calculator-key key-sign" onClick={this.handleClick}>&plusmn;</button>
                  <button id="key-percent" value="%" className="calculator-key key-percent" onClick={this.handleClick}>%</button>
                </div>

                  <div className="digit-keys">
                    <button id="key-0" value="0" className="calculator-key key-0" onClick={this.handleClick}>0</button>
                    <button id="key-dot" value="." className="calculator-key key-dot" onClick={this.handleClick}>&middot;</button>
                    <button id="key-1" value="1" className="calculator-key key-1" onClick={this.handleClick}>1</button>
                    <button id="key-2" value="2" className="calculator-key key-2" onClick={this.handleClick}>2</button>
                    <button id="key-3" value="3" className="calculator-key key-3" onClick={this.handleClick}>3</button>
                    <button id="key-4" value="4" className="calculator-key key-4" onClick={this.handleClick}>4</button>
                    <button id="key-5" value="5" className="calculator-key key-5" onClick={this.handleClick}>5</button>
                    <button id="key-6" value="6" className="calculator-key key-6" onClick={this.handleClick}>6</button>
                    <button id="key-7" value="7" className="calculator-key key-7" onClick={this.handleClick}>7</button>
                    <button id="key-8" value="8" className="calculator-key key-8" onClick={this.handleClick}>8</button>
                    <button id="key-9" value="9" className="calculator-key key-9" onClick={this.handleClick}>9</button>
                  </div>
              </div>

              <div className="operator-keys">
                <button id="key-divide" value="/" className="calculator-key key-divide" onClick={this.handleClick}>&divide;</button>
                <button id="key-multiply" value="*" className="calculator-key key-multiply" onClick={this.handleClick}>&times;</button>
                <button id="key-subtract" value="-" className="calculator-key key-subtract" onClick={this.handleClick}>&ndash;</button>
                <button id="key-add" value="+" className="calculator-key key-add" onClick={this.handleClick}>+</button>
                <button id="key-equals" value="=" className="calculator-key key-equals" onClick={this.handleClick}>=</button>
              </div>
            </div>
          </div>
    )
  }
}

class AboutTheApp extends Component {
  render() {
    return (
       <header className="App-header">
         <h1 className="App-title">React Calculator</h1>
         <div className="App-intro">
           Calculator built with React.js v16, see the <a href="https://github.com/TattyFromMelbourne/visualization-exercise" target="_new">GitHub repo</a>.
         </div>
       </header>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <AboutTheApp/>
       <div id="wrapper">
        <div id ="calculator-wrapper">
          <Calculator/>
        </div>
       </div>
      </div>
    );
  }
}

export default App;
