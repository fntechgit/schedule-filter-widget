import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom';

import FilterCheckbox from "..";

const mockOption = {
    value: "testing value",
    name: "testing value",
    color: "red"
}

const mockCallBack = jest.fn();

// Note: running cleanup fterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

it('FilterChecbox triggers onFilterChange function on click', () => {
    const { getByTestId } = render(<FilterCheckbox option={mockOption} onFilterChange={mockCallBack} />);

    const wrapper = getByTestId('checkbox-wrapper');
    fireEvent.click(wrapper);
    expect(mockCallBack.mock.calls.length).toEqual(1);
});

it('FilterChecbox changes checkmark after click', () => {
    const { getByTestId } = render(<FilterCheckbox option={mockOption} onFilterChange={mockCallBack} />);

    const wrapper = getByTestId('checkbox-wrapper');
    fireEvent.click(wrapper);
    const checkmark = screen.queryByTestId('checkmark');
    expect(checkmark).toBeVisible();
    fireEvent.click(wrapper);
    expect(checkmark).not.toBeVisible();

});

it("FilterChecbox has a custom color when the color setting it's passed", () => {
    const { getByTestId } = render(<FilterCheckbox option={mockOption} onFilterChange={mockCallBack} applyColors={true} />);

    const wrapper = getByTestId('checkbox-wrapper');
    fireEvent.click(wrapper);    
    const checkbox = screen.queryByTestId('checkbox');
    expect(checkbox).toHaveStyle(`background-color: ${mockOption.color}`);
});
