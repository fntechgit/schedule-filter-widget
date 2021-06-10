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
import { loadSession } from "../actions";

import styles from "../styles/general.module.scss";
import 'openstack-uicore-foundation/lib/css/components.css';

import FilterGroup from './filter-group';

class Filters extends React.Component {

    componentDidMount() {
        const { loadSession, ...rest } = this.props;

        loadSession(rest);
    }

    triggerFilterChange = (type, value) => {
        this.props.triggerAction('UPDATE_FILTER', {});
    };

    getFilterList = () => {
        const { filtersWithOptions } = this.props;

        return Object.entries(filtersWithOptions).map(([type, filter]) => {
            return (
                <React.Fragment key={type} >
                    <FilterGroup filter={filter} type={type} changeFilter={this.triggerFilterChange} />
                    <hr />
                </React.Fragment>
            )
        });
    };

    render() {
        const { settings, widgetLoading, filtersWithOptions } = this.props;

        return (
            <div className={`${styles.outerWrapper} schedule-filter-widget`} data-testid="schedule-filter-wrapper">
                <AjaxLoader show={widgetLoading} size={60} relative />
                {filtersWithOptions &&
                <>
                    <div className={styles.header}>
                        <div className={styles.titleWrapper}>
                            <div className={`${styles.title} widget-title`} data-testid="schedule-filter-title">
                                {settings.title}
                            </div>
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

function mapStateToProps(scheduleReducer) {
    return {
        title: scheduleReducer.title,
        settings: scheduleReducer.settings,
        filtersWithOptions: scheduleReducer.filtersWithOptions
    }
}

export default connect(mapStateToProps, {
    loadSession,
})(Filters)

