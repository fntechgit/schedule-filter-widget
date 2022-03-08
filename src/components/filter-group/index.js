import React, { useState } from 'react';

import { useSpring, config, animated } from "react-spring";
import { useMeasure } from "react-use";

import FilterCheckbox from '../filter-checkbox';
import FilterTag from '../filter-tags';
import FilterAutocomplete from '../filter-autocomplete';
import FilterText from '../filter-text';

import styles from "./index.module.scss";
import { FilterTypes } from '../../constants';

export default ({ filter: { label, options, values, freeText, enabled }, colorSource, type, changeFilter, expandedFilters }) => {

    const [isOpen, setIsOpen] = useState(expandedFilters === undefined ? true : expandedFilters);
    const [ref, { height }] = useMeasure();

    const toggleAnimation = useSpring({
        config: { bounce: 0, ...config.stiff },
        from: { opacity: 0, height: 0 },
        to: {
            opacity: 1,
            height: isOpen ? height : 0,
            marginBottom: isOpen ? (type === FilterTypes.Tags ? 14 : 20) : 0
        }
    });

    const onFilterChange = (option, value) => {
        const newValues = value ? [...values, option.value] : values.filter(val => val !== option.value);
        changeFilter(type, newValues);
    };

    const onTextFilterChange = (value) => {
        if (value !== values || value === '') changeFilter(type, value);
    }

    const shouldSort = (type) => {
        return !!(type === FilterTypes.Track || type === FilterTypes.Venues);
    };

    const sortOptions = (options) => {
        return options.sort((a, b) => {
            const first = Array.isArray(a.name) ? a.name.join() : a.name;
            const second = Array.isArray(b.name) ? b.name.join() : b.name;
            return first.localeCompare(second);
        });
    }

    const renderGroup = () => {
        switch (type) {
            case FilterTypes.Date:
            case FilterTypes.Level:
            case FilterTypes.Track:
            case FilterTypes.Venues:
            case FilterTypes.TrackGroups:
            case FilterTypes.EventTypes: {
                if (shouldSort(type)) options = sortOptions(options);
                return options.map(
                    (op, index) =>
                        <FilterCheckbox
                            key={`op-${type}-${index}`}
                            option={op}
                            selected={values?.find(v => v === op.value)}
                            applyColors={type === colorSource}
                            onFilterChange={onFilterChange}
                        />
                );
            }
            case FilterTypes.Speakers: {
                return <FilterAutocomplete options={options} values={values} onFilterChange={onFilterChange} placeholder={`Search ${label}`} />
            }
            case FilterTypes.Tags: {
                return options.map(
                    (op, index) =>
                        <FilterTag
                            key={`op-tags-${index}`}
                            option={op}
                            selected={values?.find(v => v === op.value)}
                            onFilterChange={onFilterChange}
                        />
                );
            }
            case FilterTypes.Company: {
                return <FilterAutocomplete options={options} values={values} onFilterChange={onFilterChange} placeholder={`Search ${label}`} />
            }
            case FilterTypes.Title: {
                return <FilterText value={values} placeholder={`Search ${label}`} onFilterChange={onTextFilterChange} />
            }
            case FilterTypes.CustomOrder: {
                return <FilterText isNumeric={true} value={values} placeholder={`Search ${label}`} onFilterChange={onTextFilterChange} />
            }
            case FilterTypes.Abstract: {
                return <FilterText value={values} placeholder={`Search ${label}`} onFilterChange={onTextFilterChange} />
            }
            default:
                return null;
        }
    };

    if (!enabled || ((!options || options.length < 2) && !freeText)) return null;

    return (
        <div className={styles.wrapper} data-testid="filter-group-wrapper">
            <div className={styles.title} onClick={() => setIsOpen(!isOpen)} data-testid="filter-group-title">
                <span>{label}</span>
                <i className={`fa ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
            </div>
            <animated.div style={{ overflow: 'hidden', ...toggleAnimation }} data-testid="filter-group-options">
                <div ref={ref}>
                    {renderGroup()}
                </div>
            </animated.div>
        </div>
    );
};

