import React, {Component} from 'react';
import math from 'mathjs';

/* Constants */
const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const operators = ['/', '*', '-', '+', '='];

/* Only 6 characters can be displayed at the optimal full size.
If the character string is longer, we need to scale the display down */
const maxCharsAtFullSize = 6;
const scaleFactor = 'scale(0.36)';

/* Allow maximum of 16 digits afterthe decimal point */
const maxPrecision = 16;

/* Components */
class CalculatorDisplay extends Component {
  render() {
    const {value} = this.props;
    var formattedValue = (value === 'Error')?value:parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxPrecision,
      minimumSignificantDigits: 1,
      maximumSignificantDigits: maxPrecision});
    var decimalValue;
    var precisionWithFraction;
    var dotAt = `${value}`.indexOf('.');

    if (dotAt > -1) {
       decimalValue = value.substring(dotAt, math.eval(value.length));
       precisionWithFraction = math.eval(decimalValue.length - 1); // (1 character is taken up with "."
       if (precisionWithFraction > maxPrecision ) precisionWithFraction = maxPrecision;

       if ( precisionWithFraction > 0 ) {
         formattedValue = parseFloat(value).toLocaleString(undefined, {
           minimumFractionDigits: precisionWithFraction});
      }
    }

    /* if number is too large, output it in scientific notation */
    if (formattedValue.length > (maxPrecision - 1)) {
      formattedValue = parseFloat(value).toExponential(maxPrecision - 4); // Allow at least 4 characters (for scientific notation e.g. e+14) in the output string
    }

    /* If more characters cannot be displayed in given area, make the displayed characters smaller */
    const scaleDown = (`${formattedValue}`.length) > maxCharsAtFullSize ? scaleFactor : 'scale(1)';

    return (<div className="calculator-display">
      <div className="auto-scaling-text" style={{transform: scaleDown}}>
        {formattedValue}
      </div>
    </div>);
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
    const oldDisplayValue = `${ (this.state.displayValue)}`;
    const oldWaitingForOperand = this.state.waitingForOperand;

    if (oldWaitingForOperand) {
      this.setState({displayValue: newKeyValue, waitingForOperand: false})
    } else {
      var newDisplayValue = (oldDisplayValue === '0')?`${newKeyValue}`:`${ (this.state.displayValue)}${newKeyValue}`; //no leading zero
      this.setState({displayValue: `${newDisplayValue}`, waitingForOperand: false})

    }
  }

  processOperator(newKeyValue) {
    const oldDisplayValue = this.state.displayValue;
    const oldOperator = this.state.operator;
    const oldWaitingForOperand = this.state.waitingForOperand;
    const oldFirstOperand = this.state.firstOperand;

    var newDisplayValue = this.state.displayValue;
    var newOperator = this.state.operator;
    var stringToEvaluate;
    var evaluatedValue;

    if (oldFirstOperand === '0' || oldOperator == null || oldWaitingForOperand) { // if not ready to do calculation
      this.setState({displayValue: oldDisplayValue, waitingForOperand: true, firstOperand: oldDisplayValue, operator: newKeyValue})
    } else {
      stringToEvaluate = oldFirstOperand + oldOperator + oldDisplayValue;
      try {
        evaluatedValue = math.eval(stringToEvaluate);
        newDisplayValue = evaluatedValue.toString();
      } catch (e) {
        newDisplayValue = 'Error';
      }

      if (newDisplayValue === "Infinity")
        evaluatedValue = '0'; //math.js evaluates division by 0 to be "Infinity"
      if (newDisplayValue === "Infinity")
        newDisplayValue = 'Error';

      newOperator = (newKeyValue === "=")? null: newKeyValue;

      this.setState({displayValue: `${newDisplayValue}`, waitingForOperand: true, firstOperand: newDisplayValue, operator: newOperator})
    }
  }

  processDot(newKeyValue) {
    const oldDisplayValue = this.state.displayValue;
    const oldWaitingForOperand = this.state.waitingForOperand;
    const needDot = `${oldDisplayValue}`.indexOf('.');

    if (oldWaitingForOperand) {
      this.setState({displayValue: '0.', waitingForOperand: false})
    } else {
      if (needDot === -1) { //only allow point if it's not already present or we are starting on a new operand
        var newDisplayValue = `${oldDisplayValue}${newKeyValue}`;
        this.setState({displayValue: `${newDisplayValue}`, waitingForOperand: false})
      }
    }
  }

  processPercentage(newKeyValue) {
    const oldDisplayValue = `${ (this.state.displayValue)}`;
    const newDisplayValue = parseFloat(oldDisplayValue).toPrecision(maxPrecision) / 100
    this.setState({displayValue: `${newDisplayValue}`, waitingForOperand: false})
  }

  processPlusMinusToggle(newKeyValue) {
    const oldDisplayValue = `${ (this.state.displayValue)}`;
    const newDisplayValue = parseFloat(oldDisplayValue).toPrecision(maxPrecision) * -1
    this.setState({displayValue: `${newDisplayValue}`, waitingForOperand: false})
  }

  processClear() {
    this.setState({displayValue: '0', firstOperand: '0', operator: null, waitingForOperand: false})
  }

  processFunctionKey(newKeyValue) {
    switch (newKeyValue) {
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

  processUnknownKey(newKeyValue) {
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
    return (<div className="calculator">
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
    </div>)
  }
}

export default Calculator;
