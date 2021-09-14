import React from 'react';
import {
	render,
	screen,
	within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from '../Calculator';
import '@testing-library/jest-dom/extend-expect';

describe('test Calculator component', () => {
	let clearButton,
		digitsKey,
		percentButton,
		keySignButton,
		calculatorDisplay,
		equalButton,
		subtractButton,
		multiplyButton,
		divideButton,
		dotButton,
		plusButton;
	let digitButtons = Array(10)
		.fill(null)
		.map((_, key) => key);

	function calculatingHandler(actualItems, expected) {
		actualItems.forEach((actual) => {
			if (Array.isArray(actual.toString().match(/[0-9]/))) {
				userEvent.click(digitButtons[actual]);
				return;
			}

			switch (actual) {
				case '+':
					userEvent.click(plusButton);
					break;

				case '-':
					userEvent.click(subtractButton);
					break;

				case '*':
					userEvent.click(multiplyButton);
					break;

				case '/':
					userEvent.click(divideButton);
					break;

				case '%':
					userEvent.click(percentButton);
					break;

				case '-+':
				case '+-':
					userEvent.click(keySignButton);
					break;

				case '.':
					userEvent.click(dotButton);
					break;

				default:
					break;
			}
		});

		userEvent.click(equalButton);

		expect(calculatorDisplay).toHaveTextContent(
			expected.toString()
		);
	}

	beforeEach(() => {
		render(<Calculator />);
		clearButton = screen.getByTestId('key-clear');
		digitsKey = screen.getByTestId('digits-key');
		percentButton = screen.getByTestId('percent-button');
		keySignButton = screen.getByTestId('key-sign-button');
		plusButton = screen.getByTestId('plus-button');
		subtractButton = screen.getByTestId('subtract-button');
		multiplyButton = screen.getByTestId('multiply-button');
		divideButton = screen.getByTestId('divide-button');
		calculatorDisplay = screen.getByTestId(
			'calculator-display'
		);
		equalButton = screen.getByTestId('equal-button');
		dotButton = screen.getByTestId('dot-button');

		const digitsKeyWrapper = within(digitsKey);

		digitButtons = digitButtons.map((item, key) => {
			const buttonItem = digitsKeyWrapper.queryByText(item);

			return buttonItem;
		});
	});

	afterEach(() => {
		digitButtons = Array(10)
			.fill(null)
			.map((_, key) => key);
	});

	describe('test clear button', () => {
		test('should show text AC if CalculatorDisplay equal 0 or click on zero and not a number values', () => {
			expect(clearButton).toHaveTextContent('AC');

			userEvent.click(digitButtons[0]);
			userEvent.click(plusButton);
			userEvent.click(percentButton);
			userEvent.click(keySignButton);

			expect(clearButton.textContent).toBe('AC');
		});

		test('should show text C if CalculatorDisplay not equal 0', () => {
			userEvent.click(digitButtons[1]);

			expect(clearButton.textContent).toBe('C');
		});
	});

	describe('test display of calculator', () => {
		test('text content should equal 0 on start calculator', () => {
			expect(calculatorDisplay).toHaveTextContent('0');
		});

		test(`shouldn't change value inner display-value if text content of display value equal 0 and click on not digits button and zero button`, () => {
			userEvent.click(clearButton);
			userEvent.click(digitButtons[0]);
			userEvent.click(keySignButton);
			userEvent.click(percentButton);
			userEvent.click(divideButton);
			userEvent.click(multiplyButton);
			userEvent.click(subtractButton);
			userEvent.click(plusButton);
			userEvent.click(dotButton);

			expect(calculatorDisplay).toHaveTextContent('0');
		});

		test('(+) -- should return (4) for calculating to (2 + 2)', () => {
			calculatingHandler([2, '+', 2], 4);
		});

		test('(+) -- should return (2) for calculating to (4 + -2)', () => {
			calculatingHandler([4, '+', 2, '+-'], 2);
		});

		test('(+) -- should return (-4) for calculating to (-2 + -2)', () => {
			calculatingHandler([2, '+-', '+', 2, '+-'], -4);
		});

		test('(-) -- should return (3) for calculating to (8 - 5)', () => {
			calculatingHandler([8, '-', 5], 3);
		});

		test('(-) -- should return (-3) for calculating to (5 - 8)', () => {
			calculatingHandler([5, '-', 8], -3);
		});

		test('(-) -- should return (13) for calculating to (8 - -5)', () => {
			calculatingHandler([5, '-', 8, '+-'], 13);
		});

		test('(-) -- should return (-3) for calculating to (-8 - -5)', () => {
			calculatingHandler([8, '+-', '-', 5, '+-'], -3);
		});

		test('(-) -- should return (3) for calculating to (-5 - -8)', () => {
			calculatingHandler([5, '+-', '-', 8, '+-'], 3);
		});

		test('(*) -- should return (16) for calculating to (4 * 4)', () => {
			calculatingHandler([4, '*', 4], 16);
		});

		test('(*) -- should return (-16) for calculating to (4 * -4)', () => {
			calculatingHandler([4, '*', 4, '+-'], -16);
		});

		test('(*) -- should return (16) for calculating to (-4 * -4)', () => {
			calculatingHandler([4, '+-', '*', 4, '+-'], 16);
		});

		test('(/) -- should return (5) for calculating to (20 / 4)', () => {
			calculatingHandler([2, 0, '/', 4], 5);
		});

		test('(/) -- should return (-5) for calculating to (-20 / 4)', () => {
			calculatingHandler([2, 0, '+-', '/', 4], -5);
		});

		test('(/) -- should return (5) for calculating to (-20 / -4)', () => {
			calculatingHandler([2, 0, '+-', '/', 4, '+-'], 5);
		});

		test('(%) -- should return (0.5) for calculating to (50%)', () => {
			calculatingHandler([5, 0, '%'], 0.5);
		});

		test('(%) -- should return (-0.5) for calculating to (-50%)', () => {
			calculatingHandler([5, '+-', 0, '%'], -0.5);
		});

		test(`(.) -- if click on (3) - (.) - (2) should show (3.2) in calculator value text content`, () => {
			calculatingHandler([3, '.', 2], 3.2);
		});

		test('(.) (+) -- should return (6.4) for calculating to (3.2 + 3.2)', () => {
			calculatingHandler([3, '.', 2, '+', 3, '.', 2], 6.4);
		});

		test('(.) (-) -- should return (5.6) for calculating to (8 + 2.4)', () => {
			calculatingHandler([8, '-', 2, '.', 4], 5.6);
		});

		// Has Bug
		// test('(.) (*) -- should return (9.9) for calculating to (3.3 * 3)', () => {});

		// Has Bug
		// test('(.) (/) -- should return (3.3) for calculating to (9.9 / 3)', () => {});

		test('text content of display value should equal zero if clicked on clear button', () => {
			userEvent.click(clearButton);

			expect(calculatorDisplay).toHaveTextContent('0');

			userEvent.click(clearButton);
			userEvent.click(clearButton);
			userEvent.click(clearButton);

			expect(calculatorDisplay).toHaveTextContent('0');
		});
	});

	describe('test key sign button', () => {
		test(`shouldn't change number sign if calculator display content equal 0`, () => {
			userEvent.click(keySignButton);

			expect(calculatorDisplay).toHaveTextContent('0');
		});

		test(`should change number sign if calculator display content doesn't equal 0`, () => {
			calculatingHandler([2, 5, '+-'], -25);
		});

		test(`if click on number sign button should be change to negative number`, () => {
			calculatingHandler([2, 5, '+-'], -25);
		});

		test(`if double click on number sign button should be remove sign`, () => {
			calculatingHandler([2, 5, '+-', '+-'], 25);
		});
	});
});
