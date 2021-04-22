import React, { useState } from 'react';
import PropTypes from 'prop-types';

import FilterCheckbox from '../filter-checkbox';
import FilterTag from '../filter-tags';
import FilterSpeaker from '../filter-speakers';

import styles from "./index.module.scss";

const FilterGroup = ({ filter: { label, filterType, options } }) => {

    const [isOpen, setIsOpen] = useState(true);

    const onFilterChange = (option) => {
        console.log('changed', option);
    }

    const renderGroup = (filterType) => {
        switch (filterType) {
            case 'date': {
                return options.map((option, index) => <FilterCheckbox option={option} onFilterChange={onFilterChange} key={`date-${index}`} />)
                break;
            }
            case 'level': {
                return options.map((option, index) => <FilterCheckbox option={option} onFilterChange={onFilterChange} key={`level-${index}`} />)
                break;
            }
            case 'track': {
                return options.map((option, index) => <FilterCheckbox option={option} onFilterChange={onFilterChange} key={`track-${index}`} />)
                break;
            }
            case 'speakers': {
                return <FilterSpeaker options={options} />
                break;
            }
            case 'venues': {
                return options.map((option, index) => <FilterCheckbox option={option} onFilterChange={onFilterChange} key={`venues-${index}`} />)
                break;
            }
            case 'tags': {
                return options.map((option, index) => <FilterTag option={option} key={`tags-${index}`} />)
                break;
            }
            case 'track_groups': {
                return options.map((option, index) => <FilterCheckbox option={option} onFilterChange={onFilterChange} key={`track_groups-${index}`} />)
                break;
            }
            case 'event_types': {
                return options.map((option, index) => <FilterCheckbox option={option} onFilterChange={onFilterChange} key={`event_types-${index}`} />)
                break;
            }
            default:
                break;
        }
    }

    return (
        <div style={styles.filterGroup}>
            <div className={styles.title}>
                <span>{label}</span>
                <i className="" />
                <i className={`fa ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} onClick={() => setIsOpen(!isOpen)} />
            </div>
            {isOpen &&
                <div>
                    {renderGroup(filterType)}
                </div>
            }
        </div>
    )
}

export default FilterGroup;