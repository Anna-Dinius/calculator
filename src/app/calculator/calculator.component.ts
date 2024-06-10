import { Component, OnInit } from '@angular/core';

import { evaluate } from 'mathjs';

@Component({
  selector: 'calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit{
  // declaring variables
  calculatedValue!: string;
  previousButton: string = 'none';
  clickedButton: string | null = null;

  cvHasPeriod!: boolean;
  buttonValIsCharacter!: boolean; 
  buttonValIsNumber!: boolean; 
  buttonValIsOperator!: boolean; 
  prevButtonValIsOperator!: boolean;

  operators: string[] = [ '+', '-', '*', '/' ];
  buttonValues: any[] = [ 
    [7, 8, 9, '/'],
    [4, 5, 6, 'x'],
    [1, 2, 3, '-'],
    ['.', 0, '=', '+']
  ];

  ngOnInit(): void {
    this.handleClear('none');
  }

  // functions
  determineBackgroundColor(value: number | string):string {
    value = value.toString();
    if (this.clickedButton == value) {
      return '#ccc';
    }
    return '';
  }

  determineButtonClass(value: number | string) {
    if (typeof value === 'string') {
      return "calculator-table-operators";
    }
    return "calculator-table-numbers";
  }

  isOperator(value: string): boolean {
    return (this.operators.includes(value));
  }

  cvHasOperator(): boolean {
    for (let  i = 0; i < this.operators.length; i++) {
      if (this.calculatedValue.toString().includes(this.operators[i])) {
        return true;
      }
    }
    return false;
  }

  checkValidity(): boolean {
    let operatorPosition: number = 0;
    let periodPosition: number = 0;
    for (let i = 0; i < this.calculatedValue.length; i++){
      if (this.isOperator(this.calculatedValue.charAt(i)))  {
        operatorPosition = i;
      }
      else if (this.calculatedValue.charAt(i) === '.') {
        periodPosition = i;
      }
    }

    if (operatorPosition > periodPosition) { return true; }
    return false;
  }

  handleClear(buttonValue: string) {
    this.calculatedValue = '0';
    this.previousButton = buttonValue;
  }

  handleBackspace() {
    if (this.calculatedValue.length > 1) {
      this.calculatedValue = this.calculatedValue.substring(0, this.calculatedValue.length - 1);
      this.previousButton = this.calculatedValue.substring(this.calculatedValue.length - 1, this.calculatedValue.length);
    }
    else {
      this.calculatedValue = '0';
    }
  }

  handleClick(buttonValue: number | string) {
    if (buttonValue === 'x') {
      buttonValue = '*';
    }

    //console.log('buttonValue: ' + buttonValue);

    // setting boolean variables
    this.buttonValIsOperator = this.isOperator(buttonValue.toString());
    this.prevButtonValIsOperator = this.isOperator(this.previousButton);
    this.cvHasPeriod = this.calculatedValue.toString().includes('.');
    
    // changing background color of button
    this.clickedButton = buttonValue.toString();
    setTimeout(() => {
      this.clickedButton = null;
    }, 200);

    let buttonValueString: string = buttonValue.toString();

    // setting calculatedValue
    if (this.calculatedValue === 'Error') {
      if (typeof buttonValue === 'number') {
        this.calculatedValue = buttonValueString;
        this.previousButton = buttonValueString;
      }
      else if (buttonValue === '.') {
        this.calculatedValue = '0.';
        this.previousButton = '.';
      }
      else {
        this.calculatedValue = 'Error';
        this.previousButton = 'none';
      }
    }
    else {
      if (typeof buttonValue === 'number') {
        this.buttonValIsNumber = true;
        this.buttonValIsCharacter = false;

        this.handleNumber(buttonValueString);
      }
      else if (typeof buttonValue === 'string') {
        this.buttonValIsNumber = false;
        this.buttonValIsCharacter = true;

        this.handleCharacter(buttonValueString);
      }
      else {
        this.calculatedValue = 'Error';
        this.previousButton = 'none';
        
        //console.log('Error w/o handling buttonValue');
      }
    }
  }

  handleNumber(buttonValue: string) {
    if (buttonValue == '0') {
      if (this.calculatedValue == '0') {
        this.handleClear(buttonValue);
      }
      else {
        this.calculatedValue += '0';
      }
    }
    else if (this.calculatedValue == '0' || this.previousButton === '=') {
      this.calculatedValue = buttonValue;
    }
    else {
      this.calculatedValue += buttonValue;
    }

    this.previousButton = buttonValue;
    //console.log('handleNumber()');
  }

  handleCharacter(buttonValue: string) {
    if (this.calculatedValue == '0' && buttonValue !== '=') {
      this.calculatedValue += buttonValue;
      this.previousButton = buttonValue;
    }
    else {
      if (this.buttonValIsOperator) {
        this.handleOperator(buttonValue);
      }
      else if (buttonValue === '.') {
        this.handlePeriod();
      }
      else if (buttonValue === '=') {
        this.handleEqualSign();
      }
      else {
        this.calculatedValue = 'Error';
      }
    }

    //console.log('handleCharacter()');
  }

  handleOperator(buttonValue: string) {
    if (this.prevButtonValIsOperator) {
      this.calculatedValue = this.calculatedValue.substring(0, this.calculatedValue.length - 1) + buttonValue;
    }
    else {
      this.calculatedValue += buttonValue;
    }

    this.previousButton = buttonValue;
    //console.log('handleOperator()');
  }

  handlePeriod() {
    if (this.prevButtonValIsOperator) {
      this.calculatedValue += '0.';
      this.previousButton = '.';
    }
    else if (this.cvHasPeriod) {
      if (this.cvHasOperator()) {
        let valid = this.checkValidity();
        if (valid) {
          this.calculatedValue += '.';
          this.previousButton = '.';
        }
      }

      //console.log("calculatedValue contains a .");
    }
    else if (!(this.cvHasPeriod)) {
      if (this.calculatedValue.length == 0) {
        this.calculatedValue = '0.';
      }
      else {
        this.calculatedValue += '.';
      }

      this.previousButton = '.';
      //console.log("calculatedValue doesn't contain a .");
    }
    else if (this.previousButton === '.') {
      return;
    }
    else {
      this.calculatedValue = 'Error';
    }

    //console.log('handlePeriod()');
  }

  handleEqualSign() {
    this.previousButton = '=';

    if (this.prevButtonValIsOperator) {
      this.calculatedValue += this.calculatedValue.substring(0, this.calculatedValue.length - 1);
    }
    
    if (isNaN(evaluate(this.calculatedValue.toString()))) {
      this.calculatedValue = 'Undefined';
    }
    else {
      this.calculatedValue = evaluate(this.calculatedValue.toString());
    }

    //console.log('handleEqualSign()');
  }
}
