import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import * as actions from '../actions';
import { Provider } from 'react-redux';

import ScheduleFilterWidget from '../schedule-filter-widget';
import MockData from '../settings.json';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({})

const mockCallBack = jest.fn();

// Note: running cleanup fterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

// it('ScheduleFilter render the correct title', () => {
//     const { getByTestId } = render(
//         <Provider store={store}>
//             <ScheduleFilterWidget filters={MockData} settings={{ title: "Test title" }} updateEvent={mockCallBack} />
//         </Provider>
//     );

//     const title = getByTestId('schedule-filter-title');
//     expect(title.innerText).toEqual("Test title");
// });