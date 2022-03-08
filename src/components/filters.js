/**
 * Copyright 2020 OpenStack Foundation
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
import { connect } from "react-redux";
import { AjaxLoader } from 'openstack-uicore-foundation/lib/components';
import { loadSettings, updateFilters } from "../actions";
import FilterGroup from './filter-group';

import styles from "../styles/general.module.scss";
import 'openstack-uicore-foundation/lib/css/components.css';


class Filters extends React.Component {

    componentDidMount() {
        const { loadSettings, updateFilters, ...rest } = this.props;
        loadSettings(rest);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {events: prevEvents} = prevProps;
        const {events, filters, updateFilters} = this.props;
        const prevEventsIds = prevEvents.map(e => e.id);
        const eventsIds = events.map(e => e.id);

        if (prevEventsIds.length !== eventsIds.length || !prevEventsIds.every((v,i) => v === eventsIds[i])) {
            updateFilters(events, filters);
        }
    }

    triggerFilterChange = (type, values) => {
        this.props.triggerAction('UPDATE_FILTER', {type, values});
    };

    getFilterList = () => {
        const { filtersWithOptions, settings } = this.props;

        return Object.entries(filtersWithOptions).map(([type, filter]) => {
            return (
                <FilterGroup key={type} filter={filter} type={type} colorSource={settings.colorSource} expandedFilters={settings.expandedByDefault} changeFilter={this.triggerFilterChange} />
            );
        });
    };

    render() {
        const { settings, widgetLoading, filtersWithOptions } = this.props;

        return (
            <div className={`${styles.outerWrapper} schedule-filter-widget`} data-testid="schedule-filter-wrapper">
                <AjaxLoader show={widgetLoading} size={60} relative />
                {filtersWithOptions && Object.keys(filtersWithOptions).length > 0 &&
                <>
                    <div className={styles.header}>
                        <div className={`${styles.title} widget-title`} data-testid="schedule-filter-title">
                            {settings.title}
                        </div>
                    </div>
                    <div className={`${styles.innerWrapper}`} data-testid="schedule-filter-list">
                        {this.getFilterList()}
                    </div>
                </>
                }
            </div>
        );
    }
}

function mapStateToProps(widgetReducer) {
    return {
        settings: widgetReducer.settings,
        filtersWithOptions: widgetReducer.filtersWithOptions
    }
}

export default connect(mapStateToProps, {
    loadSettings,
    updateFilters
})(Filters)

