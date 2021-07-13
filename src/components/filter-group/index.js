import React, { useState } from 'react';

import { useSpring, config, animated } from "react-spring";
import { useMeasure } from "react-use";

import FilterCheckbox from '../filter-checkbox';
import FilterTag from '../filter-tags';
import FilterSpeaker from '../filter-speakers';

import styles from "./index.module.scss";

export default ({ filter: { label, options, values }, colorSource, type, changeFilter }) => {

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

    const renderGroup = () => {
        switch (type) {
            case 'date':
            case 'level':
            case 'track':
            case 'venues':
            case 'track_groups':
            case 'event_types': {
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
                return <FilterSpeaker options={options} values={values} onFilterChange={onFilterChange} />
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
            default:
                return null;
        }
    };

    if (!options || options.length < 2) return null;

    return (
        <>
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
            </div >
            <hr />
        </>
    )
};

