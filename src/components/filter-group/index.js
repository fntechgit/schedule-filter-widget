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

const FilterGroup = ({ filter: { label, useColors, filterType, options }, filtered, changeFilter }) => {

    const [isOpen, setIsOpen] = useState(true);
    const [ref, { height }] = useMeasure();

    const toggleAnimation = useSpring({
        config: { bounce: 0, ...config.stiff },
        from: { opacity: 0, height: 0 },
        to: {
            opacity: 1,
            height: isOpen ? height : 0,
            marginBottom: isOpen ? (filterType === 'tags' ? 14 : 20) : 0
        }
    });

    const onFilterChange = (option, value) => {
        changeFilter(filterType, option, value);
    }

    const renderGroup = (filterType) => {
        switch (filterType) {
            case 'date': {
                return options.map((option, index) => <FilterCheckbox option={option} filtered={filtered?.options?.some(elem => (elem.value && elem.value === option.value) || (elem.id && elem.id === option.id))} onFilterChange={onFilterChange} key={`date-${index}`} />)
            }
            case 'level': {
                return options.map((option, index) => <FilterCheckbox option={option} filtered={filtered?.options?.some(elem => (elem.value && elem.value === option.value) || (elem.id && elem.id === option.id))} onFilterChange={onFilterChange} key={`level-${index}`} />)
            }
            case 'track': {
                return options.map((option, index) => <FilterCheckbox applyColors={useColors} option={option} filtered={filtered?.options?.some(elem => (elem.value && elem.value === option.value) || (elem.id && elem.id === option.id))} onFilterChange={onFilterChange} key={`track-${index}`} />)
            }
            case 'speakers': {
                return <FilterSpeaker options={options} filtered={filtered?.options} onFilterChange={onFilterChange} />
            }
            case 'venues': {
                return options.map((option, index) => <FilterCheckbox option={option} filtered={filtered?.options?.some(elem => (elem.value && elem.value === option.value) || (elem.id && elem.id === option.id))} onFilterChange={onFilterChange} key={`venues-${index}`} />)
            }
            case 'tags': {
                return options.map((option, index) => <FilterTag option={option} filtered={filtered?.options?.some(elem => (elem.value && elem.value === option.value) || (elem.id && elem.id === option.id))} key={`tags-${index}`} onFilterChange={onFilterChange} />)
            }
            case 'track_groups': {
                return options.map((option, index) => <FilterCheckbox applyColors={useColors} option={option} filtered={filtered?.options?.some(elem => (elem.value && elem.value === option.value) || (elem.id && elem.id === option.id))} onFilterChange={onFilterChange} key={`track_groups-${index}`} />)
            }
            case 'event_types': {
                return options.map((option, index) => <FilterCheckbox applyColors={useColors} option={option} filtered={filtered?.options?.some(elem => (elem.value && elem.value === option.value) || (elem.id && elem.id === option.id))} onFilterChange={onFilterChange} key={`event_types-${index}`} />)
            }
            default:
                return null;
        }
    }

    return (
        <div className={styles.filterGroup} data-testid="filter-group-wrapper">
            <div className={styles.title} onClick={() => setIsOpen(!isOpen)} data-testid="filter-group-title">
                <span>{label}</span>
                <i className={`fa ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
            </div>
            <animated.div style={{ overflow: 'hidden', ...toggleAnimation }} data-testid="filter-group-options">
                <div ref={ref}>
                    {renderGroup(filterType)}
                </div>
            </animated.div>
        </div >
    )
}

export default connect(null, {
    changeFilter
})(FilterGroup)

