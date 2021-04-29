import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import { useSpring, config, animated } from "react-spring";
import { useMeasure } from "react-use";

import FilterCheckbox from '../filter-checkbox';
import FilterTag from '../filter-tags';
import FilterSpeaker from '../filter-speakers';

import { changeFilter } from '../../actions';

import styles from "./index.module.scss";

const FilterGroup = ({ filter: { label, useColors, filterType, options }, changeFilter }) => {

    const [isOpen, setIsOpen] = useState(true);
    const [ref, { height }] = useMeasure();    

    const toggleAnimation = useSpring({
        config: { ...config.stiff },
        from: { opacity: 0, height: 0 },
        to: {
            opacity: 1,
            height: isOpen ? height : 0
        }
    });

    const onFilterChange = (option, value) => {
        changeFilter(filterType, option, value);
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
                return options.map((option, index) => <FilterCheckbox applyColors={useColors} option={option} onFilterChange={onFilterChange} key={`track-${index}`} />)
                break;
            }
            case 'speakers': {
                return <FilterSpeaker options={options} onFilterChange={onFilterChange} />
                break;
            }
            case 'venues': {
                return options.map((option, index) => <FilterCheckbox option={option} onFilterChange={onFilterChange} key={`venues-${index}`} />)
                break;
            }
            case 'tags': {
                return options.map((option, index) => <FilterTag option={option} key={`tags-${index}`} onFilterChange={onFilterChange} />)
                break;
            }
            case 'track_groups': {
                return options.map((option, index) => <FilterCheckbox applyColors={useColors} option={option} onFilterChange={onFilterChange} key={`track_groups-${index}`} />)
                break;
            }
            case 'event_types': {
                return options.map((option, index) => <FilterCheckbox applyColors={useColors} option={option} onFilterChange={onFilterChange} key={`event_types-${index}`} />)
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
            <animated.div style={{ overflow: 'hidden', ...toggleAnimation }}>
                <div ref={ref}>
                    {renderGroup(filterType)}
                </div>
            </animated.div>
        </div >
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

