import React from 'react';

import styles from "./index.module.scss";

const FilterCheckbox = ({ option, applyColors, selected, showCount, onFilterChange }) => {

    const boxColor = applyColors && option.color ? option.color : '';
    const wrapperClass = `${styles.checkbox} ${selected ? styles.checked : ''}`;
    const wrapperStyles = { backgroundColor: boxColor, border: boxColor ? `1px solid ${boxColor}` : '' };
    const checkStyles = { color: boxColor ? 'white' : 'black' };

    const nameTag = Array.isArray(option.name) ? <><strong>{option.name[0]}</strong>, {option.name[1]}</> : option.name;

    return (
        <div className={styles.checkboxWrapper} onClick={() => onFilterChange(option, !selected)} data-testid="checkbox-wrapper">
            <div className={wrapperClass} style={wrapperStyles} data-testid="checkbox">
                {selected && <i className="fa fa-check" style={checkStyles}  data-testid="checkmark" />}
            </div>
            <span className={styles.title}>{nameTag}</span>
            {showCount && <span className={styles.quantity}>({option.count})</span>}
        </div>
    )
};

export default FilterCheckbox;