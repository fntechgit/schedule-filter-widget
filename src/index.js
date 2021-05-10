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
import ReactDOM from 'react-dom';
import ScheduleFilterWidget from './schedule-filter-widget';

import MarketingData from './marketing-data.json';
import SettingsData from './settings.json';

const filterProps = {
    marketingData: MarketingData.colors,
    filtersData: SettingsData,
    filteredData: [],
    title: 'Filter by',
    onRef: console.log,
    filterCallback: (ev, data) => console.log('filter updated', ev, data),
};


// width 780px or 230px

ReactDOM.render(
    <div style={{ width: '780px', margin: '0 auto' }}>
        <ScheduleFilterWidget {...filterProps} />
    </div>,
    document.querySelector('#root')
);
