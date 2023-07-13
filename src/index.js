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

import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import ScheduleFilter from './schedule-filter';

import summit from './dummy_data/summit.json';
import events from './dummy_data/events.json';
import marketing from './dummy_data/marketing-data.json';
import filters from './dummy_data/filters.json';


const filterProps = {
    title: 'Filter by',
    summit: summit.summit,
    events: events,
    allEvents: events,
    filters: filters,
    expandedByDefault: false,
    colorSource: 'track',
    marketingSettings: marketing.colors,
};



const ComponentWrapper = () => {
    const [filters, setFilters] = useState(filterProps.filters);
    
    const triggerAction = (action, {type, values}) => {
        console.log(`${action}: ${type} - ${values}`);
        setFilters({...filters, [type]: {...filters[type], values}});
    }
    
    return (
      <ScheduleFilter {...filterProps} filters={filters} triggerAction={triggerAction} />
    )
}


ReactDOM.render(
    <div style={{ margin: '20px' }}>
        <ComponentWrapper />
    </div>,
    document.querySelector('#root')
);
