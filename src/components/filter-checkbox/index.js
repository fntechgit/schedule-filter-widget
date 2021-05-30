import React from 'react';
import PropTypes from 'prop-types';

import styles from "./index.module.scss";

const FilterCheckbox = ({ option, option: { label = '', name = '', color }, applyColors, filtered, onFilterChange }) => {

    const boxColor = applyColors && filtered && color ? color : '';
    
    return (
        <div className={styles.checkboxWrapper} onClick={() => onFilterChange(option, !filtered)} data-testid="checkbox-wrapper">
            <div className={`${styles.checkbox} ${filtered ? styles.checked : ''}`} style={{ backgroundColor: boxColor, border: boxColor ? `1px solid ${boxColor}` : '' }} data-testid="checkbox">
                {filtered && <i className="fa fa-check" style={{ color: applyColors && filtered ? 'white' : '' }}  data-testid="checkmark" />}
            </div>
            <span className={styles.title}>{label || name}</span>
        </div>
    )
}

export default FilterCheckbox;