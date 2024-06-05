import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit{
  calculatedValue!: string;
  previousButton: string = 'none';
  operators: string[] = [ '+', '-', '*', '/']
  clickedButton: string | null = null;
  buttonValIsCharacter!: boolean; 
  buttonValIsNumber!: boolean; 
  buttonValIsOperator!: boolean; 
  prevButtonValIsOperator!: boolean; 
  buttonValues: any[] = [ 
    [7, 8, 9, '/'],
    [4, 5, 6, 'x'],
    [1, 2, 3, '-'],
    ['.', 0, '=', '+']
  ];

  ngOnInit(): void {
    this.handleClear();
  }

  determineBackgroundColor(value: number | string):string {
    value = value.toString();
    if (this.clickedButton === value) {
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

  handleClear() {
    this.calculatedValue = '0';
    this.previousButton = 'none';
  }

  handleBackspace() {
    if (this.previousButton !== '=') {
      this.calculatedValue = this.calculatedValue.substring(0, this.calculatedValue.length - 1);
      if (this.calculatedValue === '') {
        this.handleClear();
      }
    }
  }

  handleClick(buttonValue: number | string) {
    if (typeof buttonValue === 'number') {
      buttonValue = buttonValue.toString();
    }
    console.log('buttonValue: ' + buttonValue);

    this.clickedButton = buttonValue;
    setTimeout(() => {
      this.clickedButton = null;
    }, 200);

    if (buttonValue === 'x') {
      buttonValue = '*';
    }

    this.buttonValIsCharacter = isNaN(parseInt(buttonValue));
    this.buttonValIsNumber = !this.buttonValIsCharacter;
    this.buttonValIsOperator = this.isOperator(buttonValue);
    this.prevButtonValIsOperator = this.isOperator(this.previousButton);
    
    if ((this.previousButton === '=' && this.buttonValIsNumber) || this.calculatedValue === 'Error') {
      this.calculatedValue = buttonValue;
    }
    else if ((this.prevButtonValIsOperator && this.buttonValIsOperator)) {
      this.calculatedValue = this.calculatedValue.substring(0, this.calculatedValue.length - 1) + buttonValue;
    }
    else if (buttonValue === '.') {
      if (this.prevButtonValIsOperator) {
        this.calculatedValue += '0.';
      }
      else if (!(this.calculatedValue.toString().includes('.'))) {
        if (this.calculatedValue.length === 0) {
          this.calculatedValue = '0.';
        }
        else {
          this.calculatedValue += buttonValue;
        }
        console.log("calculatedValue doesn't contain a .");
      }
      else if (this.previousButton === '.') { return; }
      else { return; }
    }
    else if (buttonValue === '=') {
      this.calculatedValue = eval(this.calculatedValue);
    }
    else if (this.calculatedValue === '0') {
      if (buttonValue === '0') {
        this.handleClear();
      }
      else if (this.buttonValIsNumber) {
        this.calculatedValue = buttonValue;
      }
      else if (this.buttonValIsCharacter) {
        this.calculatedValue += buttonValue;
      }
    }
    else if (this.buttonValIsNumber || this.buttonValIsOperator) {
      console.log("line 118");
      this.calculatedValue += buttonValue;
    }
    else {
      this.calculatedValue = 'Error';
    }
    
    this.previousButton = buttonValue;
  }
}
