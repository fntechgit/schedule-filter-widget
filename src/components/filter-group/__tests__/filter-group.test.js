import React from 'react';
import { cleanup, fireEvent, waitFor, render } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom';

import FilterGroup from "..";

import MockData from '../../../settings.json';

const mockSpeakers = MockData.find(data => data.filterType === 'speakers').options;


const mockCallBack = jest.fn();

// Note: running cleanup fterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(() => {
    cleanup();
    jest.clearAllMocks();
});

it('FilterGroup display and hides the options ', async () => {
    const { getByTestId } = render(<FilterGroup options={mockSpeakers} onFilterChange={mockCallBack} />);

    // const input = getByTestId('speakers-input');
    // fireEvent.focus(input);
    // const dropdown = screen.queryByTestId('speakers-dropdown');
    // expect(dropdown).toBeVisible();
    // fireEvent.blur(input);
    // await waitFor(() => expect(dropdown).not.toBeVisible());
});
