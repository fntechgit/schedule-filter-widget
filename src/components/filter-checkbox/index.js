import React from 'react';

import styles from "./index.module.scss";

const FilterCheckbox = ({ option, applyColors, selected, showCount, onFilterChange }) => {
    const boxColor = (applyColors && option.color) ? option.color : null;
    const wrapperClass = `${styles.checkbox} ${selected ? styles.checked : ''}`;
    const wrapperStyles = { backgroundColor: boxColor || 'white', border: `1px solid ${boxColor || '#d3d3d3'}` };
    const checkStyles = { color: boxColor ? 'white' : 'black' };

    const nameTag = Array.isArray(option.name) ? <><strong>{option.name[0]}</strong>, {option.name[1]}</> : option.name;

    return (
        <div className={styles.checkboxWrapper} onClick={() => onFilterChange(option, !selected)} data-testid="checkbox-wrapper">
            <label>
                <span data-testid="checkbox"></span>
                <input type="Checkbox" checked={selected} style={checkStyles} />
                <span className={styles.title}>{nameTag}</span>
                {showCount && <span className={styles.quantity}>({option.count})</span>}
            </label>
        </div>
    )
};

export default FilterCheckbox;