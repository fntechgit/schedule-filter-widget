/**
 * Copyright 2017 OpenStack Foundation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import React from 'react';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import WidgetReducer from './reducer'
import ScheduleFilter from "./components/schedule-filter";

class ScheduleFilterWidget extends React.PureComponent {

    constructor(props) {
        super(props);

        const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
        this.store = createStore(WidgetReducer, composeEnhancers(applyMiddleware(thunk)));

        // this.store = createStore(WidgetReducer, applyMiddleware(thunk));
    }

    render() {
        return (
            <Provider store={this.store}>
                <ScheduleFilter {...this.props} />
            </Provider>
        );
    }
}

export default ScheduleFilterWidget;
