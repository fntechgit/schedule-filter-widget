import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom';

import FilterTag from "..";

const mockTag = {
    "id": 16,
    "created": 1596837068,
    "last_edited": 1596837068,
    "tag": "sample 1",
    "count": 54
};

const mockCallBack = jest.fn();

// Note: running cleanup fterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

it('FilterTag triggers onFilterChange function on click', () => {
    const { getByTestId } = render(<FilterTag option={mockTag} onFilterChange={mockCallBack} />);

    const button = getByTestId('tag-button');
    fireEvent.click(button);
    expect(mockCallBack.mock.calls.length).toEqual(1);
});

it('FilterTag shows the correct data', () => {
    const { getByTestId } = render(<FilterTag option={mockTag} onFilterChange={mockCallBack} />);

    const button = getByTestId('tag-button');

    expect(button).toContainHTML(`<span class="title" data-testid="tag-title">${mockTag.tag}</span>`);
    expect(button).toContainHTML(`<span class="quantity" data-testid="tag-count">(${mockTag.count})</span>`);

});

it("FilterTag apply a custom class when it's clicked", () => {
    const { getByTestId } = render(<FilterTag option={mockTag} onFilterChange={mockCallBack} applyColors={true} />);

    const button = getByTestId('tag-button');
    fireEvent.click(button);
    expect(button).toHaveClass('tagButtonActive');
    fireEvent.click(button);
    expect(button).not.toHaveClass('tagButtonActive');
});
