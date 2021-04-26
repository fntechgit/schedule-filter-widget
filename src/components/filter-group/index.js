import React, { useState } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import FilterCheckbox from '../filter-checkbox';
import FilterTag from '../filter-tags';
import FilterSpeaker from '../filter-speakers';

import { changeFilter, setMarketingSettings } from '../../actions';

import styles from "./index.module.scss";

const FilterGroup = ({ filter: { label, filterType, options }, changeFilter, filtered }) => {

    const [isOpen, setIsOpen] = useState(true);

    const onFilterChange = (option, value) => {
        changeFilter(filterType, option, value);
    }

    const renderGroup = (filterType) => {
        switch (filterType) {
            case 'date': {
                return options.map((option, index) => <FilterCheckbox option={option} filtered={filtered.filter(f => f.filterType === filterType)} onFilterChange={onFilterChange} key={`date-${index}`} />)
                break;
            }
            case 'level': {
                return options.map((option, index) => <FilterCheckbox option={option} filtered={filtered.filter(f => f.filterType === filterType)} onFilterChange={onFilterChange} key={`level-${index}`} />)
                break;
            }
            case 'track': {
                return options.map((option, index) => <FilterCheckbox option={option} filtered={filtered.filter(f => f.filterType === filterType)} onFilterChange={onFilterChange} key={`track-${index}`} />)
                break;
            }
            case 'speakers': {
                return <FilterSpeaker options={options} filtered={filtered.filter(f => f.filterType === filterType)} onFilterChange={onFilterChange} />
                break;
            }
            case 'venues': {
                return options.map((option, index) => <FilterCheckbox option={option} filtered={filtered.filter(f => f.filterType === filterType)} onFilterChange={onFilterChange} key={`venues-${index}`} />)
                break;
            }
            case 'tags': {
                return options.map((option, index) => <FilterTag option={option} key={`tags-${index}`} filtered={filtered.filter(f => f.filterType === filterType)} onFilterChange={onFilterChange} />)
                break;
            }
            case 'track_groups': {
                return options.map((option, index) => <FilterCheckbox option={option} filtered={filtered.filter(f => f.filterType === filterType)} onFilterChange={onFilterChange} key={`track_groups-${index}`} />)
                break;
            }
            case 'event_types': {
                return options.map((option, index) => <FilterCheckbox option={option} filtered={filtered.filter(f => f.filterType === filterType)} onFilterChange={onFilterChange} key={`event_types-${index}`} />)
                break;
            }
            default:
                break;
        }
    }

    return (
        <div className={styles.filterGroup}>
            <div className={styles.title} onClick={() => setIsOpen(!isOpen)}>
                <span>{label}</span>
                <i className="" />
                <i className={`fa ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
            </div>
            {isOpen &&
                <div>
                    {renderGroup(filterType)}
                </div>
            }
        </div>
    )
}

function mapStateToProps(scheduleReducer) {
    return {
        ...scheduleReducer
    }
}

export default connect(mapStateToProps, {
    changeFilter
})(FilterGroup)

