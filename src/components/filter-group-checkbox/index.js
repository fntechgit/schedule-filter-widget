import React, { useState } from 'react';

import { useSpring, config, animated } from "react-spring";
import { useMeasure } from "react-use";

import FilterCheckbox from '../filter-checkbox';

import styles from "./index.module.scss";
import { FilterTypes } from '../../constants';

const FilterGroupCheckbox = ({option, applyColors, values, onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [ref, { height }] = useMeasure();
    const groupSelected = values?.find(v => v === option.value);
    const partiallySelected = option.childs.some(ch => values.includes(ch.value));
    const boxColor = (applyColors && option.color) ? option.color : null;
    const wrapperClass = `${styles.checkbox} ${groupSelected ? styles.checked : ''}`;
    const wrapperStyles = { backgroundColor: boxColor || 'white', border: `1px solid ${boxColor || '#d3d3d3'}` };
    const checkStyles = { color: boxColor ? 'white' : 'black' };
    
    if (!groupSelected && partiallySelected) {
        wrapperStyles.backgroundColor = 'white';
        checkStyles.color = boxColor || "white";
    }

    const toggleAnimation = useSpring({
        config: { bounce: 0, ...config.stiff },
        from: { opacity: 0, height: 0 },
        to: {
            opacity: 1,
            height: isOpen ? height : 0,
            marginBottom: isOpen ? 20 : 0
        }
    });
    
    const onGroupClick = () => {
        onFilterChange(option, !groupSelected);
        
        // if selecting group, open childs
        if (!groupSelected) {
            setIsOpen(true);
        }
    }
    
    const getGroupCheckmark = () => {
        if (groupSelected) {
            return (<i className="fa fa-check" style={checkStyles}  data-testid="checkmark" />);
        } else if (partiallySelected) {
            return (<i className="fa fa-circle-o-notch" style={checkStyles}  data-testid="checkmark" />);
        }
        
        return null;
    }
    
    return (
        <div className={styles.wrapper} data-testid="filter-group-wrapper">
            <div className={styles.title} data-testid="filter-group-title">
                <div className={wrapperClass} style={wrapperStyles} data-testid="checkbox" onClick={onGroupClick}>
                    {getGroupCheckmark()}
                </div>
                <span>{option.name}</span>
                <i onClick={() => setIsOpen(!isOpen)} className={`fa ${isOpen ? 'fa-angle-up' : 'fa-angle-down'}`} />
            </div>
            <animated.div style={{ overflow: 'hidden', ...toggleAnimation }} data-testid="filter-group-options">
                <div ref={ref} className={styles.childrenWrapper}>
                    {option.childs.map(
                      (op, index) =>
                        <FilterCheckbox
                          key={`op-${op.id}-${index}`}
                          option={op}
                          selected={values?.find(v => v === op.value)}
                          applyColors={applyColors}
                          onFilterChange={onFilterChange}
                        />
                    )}
                </div>
            </animated.div>
        </div>
    );
};

export default FilterGroupCheckbox;