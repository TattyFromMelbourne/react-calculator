import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from '../Calculator';
import '@testing-library/jest-dom/extend-expect';

const getDigitButton = (selector, buttonValue) => {
	const buttons = Array.from(selector.children);
	let selectButton;

	for (let button of buttons) {
		if (button.textContent.trim() === buttonValue) {
			selectButton = button;
			break;
		}
	}

	return selectButton;
};

describe('test Calculator component', () => {
	beforeEach(() => {
		render(<Calculator />);
	});

	describe('test clear button', () => {
		test('should show text AC if CalculatorDisplay equal 0 or click on zero and not a number values', () => {
			const clearButton = screen.getByTestId('key-clear');
			const zeroButton = screen.getByTestId('zero-button');
			const plusButton = screen.getByTestId('plus-button');
			const percentButton = screen.getByTestId(
				'percent-button'
			);
			const keySignButton = screen.getByTestId(
				'key-sign-button'
			);

			expect(clearButton).toHaveTextContent('AC');

			userEvent.click(zeroButton);
			userEvent.click(plusButton);
			userEvent.click(percentButton);
			userEvent.click(keySignButton);

			expect(clearButton.textContent).toBe('AC');
		});

		test('should show text C if CalculatorDisplay not equal 0', () => {
			const clearButton = screen.getByTestId('key-clear');
			const digitsKey = screen.getByTestId('digits-key');
			const OneButton = getDigitButton(digitsKey, '1');

			userEvent.click(OneButton);

			expect(clearButton.textContent).toBe('C');
		});
	});
});
