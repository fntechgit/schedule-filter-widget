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
import { AjaxLoader, FreeTextSearch } from 'openstack-uicore-foundation/lib/components';
import { loadSession, changeView, getEvents, getSummitById, setMarketingSettings, updateEventList, updateEvent, setSearch } from "../actions";

import styles from "../styles/general.module.scss";
import 'openstack-uicore-foundation/lib/css/components.css';
import FilterCheckbox from './filter-checkbox';
import FilterTag from './filter-tags';

class ScheduleFilter extends React.Component {

    componentDidMount() {
        const { updateEventList, loadSession, getSummitById, setMarketingSettings, getEvents, changeView, ...rest } = this.props;

        loadSession(rest).then(() => {
            getSummitById();
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
        const { events, settings, filtered, summit, loggedUser } = this.props;

        return (
            <>
            <span>Filters</span>
            </>
        );
    }    

    render() {
        const { summit, view, changeView, settings, widgetLoading, now, firstLoad, showFilters, searchTerm } = this.props;

        return (
            <div className={`${styles.outerWrapper} schedule-widget`} ref={el => this.wrapperElem = el}>
                <AjaxLoader show={widgetLoading} size={60} relative />
                {summit && firstLoad &&
                    <>
                        <div className={styles.header}>
                            <div className={styles.titleWrapper}>
                                <div className={`${styles.title} widget-subtitle`}>
                                    {settings.title}
                                </div>
                            </div>
                        </div>

                        <FilterCheckbox title="Test"/>

                        <FilterTag />

                        <div className={`${styles.innerWrapper}`}>
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
        ...scheduleReducer
    }
}

export default connect(mapStateToProps, {
    loadSession,
    getSummitById,
    setMarketingSettings,
    getEvents,
    changeView,
    updateEventList,
    updateEvent,
    setSearch
})(ScheduleFilter)

