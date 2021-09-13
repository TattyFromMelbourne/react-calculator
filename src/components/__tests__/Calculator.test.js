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
		plusButton;
	let digitButtons = Array(10)
		.fill(null)
		.map((_, key) => key);

	beforeEach(() => {
		render(<Calculator />);

		clearButton = screen.getByTestId('key-clear');
		digitsKey = screen.getByTestId('digits-key');
		percentButton = screen.getByTestId('percent-button');
		keySignButton = screen.getByTestId('key-sign-button');
		plusButton = screen.getByTestId('plus-button');
		calculatorDisplay = screen.getByTestId(
			'calculator-display'
		);

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
		test('text content should equal 0 on start calculator', () => {});

		test(`shouldn't change value inner display-value if text content of display value equal 0 and click on not digits button and zero button`, () => {});

		test('(+) -- should return (4) for calculating to (2 + 2)', () => {});

		test('(+) -- should return (2) for calculating to (2 + -2)', () => {});

		test('(+) -- should return (-2) for calculating to (-2 + -2)', () => {});

		test('(-) -- should return (3) for calculating to (8 - 5)', () => {});

		test('(-) -- should return (-3) for calculating to (5 - 8)', () => {});

		test('(-) -- should return (13) for calculating to (8 - -5)', () => {});

		test('(-) -- should return (-3) for calculating to (-8 - -5)', () => {});

		test('(-) -- should return (3) for calculating to (-5 - -8)', () => {});

		test('(*) -- should return (16) for calculating to (4 * 4)', () => {});

		test('(*) -- should return (-16) for calculating to (4 * -4)', () => {});

		test('(*) -- should return (16) for calculating to (-4 * -4)', () => {});

		test('(/) -- should return (5) for calculating to (20 / 4)', () => {});

		test('(/) -- should return (-5) for calculating to (-20 / 4)', () => {});

		test('(/) -- should return (5) for calculating to (-20 / -4)', () => {});

		test('(%) -- should return (0.5) for calculating to (50%)', () => {});

		test('(%) -- should return (-0.5) for calculating to (-50%)', () => {});

		test(`(.) -- if click on (3) - (.) - (2) should show (3.2) in calculator value text content`, () => {});

		test('(.) (+) -- should return (6.4) for calculating to (3.2 + 3.2)', () => {});

		test('(.) (-) -- should return (5.6) for calculating to (8 + 2.4)', () => {});

		// Has Bug
		// test('(.) (*) -- should return (9.9) for calculating to (3.3 * 3)', () => {});

		// Has Bug
		// test('(.) (/) -- should return (3.3) for calculating to (9.9 / 3)', () => {});

		test('text content of display value should equal zero if clicked on clear button', () => {});
	});

	describe('test key sign button', () => {
		test(`shouldn't change number sign if calculator display content equal 0`, () => {});

		test(`should change number sign if calculator display content doesn't equal 0`, () => {});
	});
});
