import React from 'react';
import PropTypes from 'prop-types';

import styles from "./index.module.scss";

const FilterCheckbox = ({ option, option: { label = '', name = '', color }, applyColors, filtered, onFilterChange }) => {

    return (
        <div className={styles.checkboxWrapper} onClick={() => onFilterChange(option, !filtered)} data-testid="checkbox-wrapper">
            <div className={`${styles.checkbox} ${filtered ? styles.checked : ''}`} style={{ backgroundColor: applyColors && filtered && color ? color : '' }} data-testid="checkbox">
                {filtered && <i className="fa fa-check" data-testid="checkmark" />}
            </div>
            <span className={styles.title}>{label || name}</span>
        </div>
    )
}

export default FilterCheckbox;