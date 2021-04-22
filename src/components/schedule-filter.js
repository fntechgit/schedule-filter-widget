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
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { AjaxLoader } from 'openstack-uicore-foundation/lib/components';
import { loadSession, setMarketingSettings } from "../actions";

import styles from "../styles/general.module.scss";
import 'openstack-uicore-foundation/lib/css/components.css';

import FilterGroup from './filter-group';

class ScheduleFilter extends React.Component {

    componentDidMount() {
        const { loadSession, setMarketingSettings, filters, ...rest } = this.props;        

        loadSession(rest).then(() => {
            setMarketingSettings();
        });

        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    triggerUpdate = (action, event) => {
        this.props.updateEvent(action, event);
        console.log(`Update triggered from host: ${action} on ${event.id}`);
    };

    getFilterList = () => {
        const { filters } = this.props;

        return filters.map((filter, index) => {
            if (filter.is_enabled && filter.options.length > 0) {
                return (
                    <React.Fragment key={filter.filterType} >
                        <FilterGroup filter={filter} />
                        { index !== filters.length - 1 && <hr />}
                    </React.Fragment>
                )
            }
        })
    }

    render() {
        const { settings, widgetLoading } = this.props;

        return (
            <div className={`${styles.outerWrapper} schedule-widget`} ref={el => this.wrapperElem = el}>
                <AjaxLoader show={widgetLoading} size={60} relative />
                <>
                    <div className={styles.header}>
                        <div className={styles.titleWrapper}>
                            <div className={`${styles.title} widget-subtitle`}>
                                {settings.title}
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.innerWrapper}`}>
                        {this.getFilterList()}
                    </div>

                </>
            </div>
        );
    }
}

function mapStateToProps(scheduleReducer) {
    return {
        ...scheduleReducer
    }
}

export default connect(mapStateToProps, {
    loadSession,
    setMarketingSettings
})(ScheduleFilter)

