import React, { useState } from 'react';

import { useSpring, config, animated } from "react-spring";
import { useMeasure } from "react-use";

import FilterCheckbox from '../filter-checkbox';
import FilterTag from '../filter-tags';
import FilterAutocomplete from '../filter-autocomplete';
import FilterText from '../filter-text';

import styles from "./index.module.scss";

export default ({ filter: { label, options, values, freeText, enabled }, colorSource, type, changeFilter }) => {

    const [isOpen, setIsOpen] = useState(true);
    const [ref, { height }] = useMeasure();

    const toggleAnimation = useSpring({
        config: { bounce: 0, ...config.stiff },
        from: { opacity: 0, height: 0 },
        to: {
            opacity: 1,
            height: isOpen ? height : 0,
            marginBottom: isOpen ? (type === 'tags' ? 14 : 20) : 0
        }
    });

    const onFilterChange = (option, value) => {
        const newValues = value ? [...values, option.value] : values.filter(val => val !== option.value);
        changeFilter(type, newValues);
    };

    const onTextFilterChange = (value) => {
        if (value !== values) changeFilter(type, value);
    }

    const shouldSort = (type) => {
        return !!(type === 'track' || type === 'venues');
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
            case 'date':
            case 'level':
            case 'track':
            case 'venues':
            case 'track_groups':
            case 'event_types': {
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
            case 'speakers': {
                return <FilterAutocomplete options={options} values={values} onFilterChange={onFilterChange} placeholder="Search Speakers" />
            }
            case 'tags': {
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
            case 'company': {
                return <FilterAutocomplete options={options} values={values} onFilterChange={onFilterChange} placeholder="Search for Company" />
            }
            case 'title': {
                return <FilterText value={values} placeholder="Search Title" onFilterChange={onTextFilterChange} />
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

