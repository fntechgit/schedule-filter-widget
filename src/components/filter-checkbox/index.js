import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from "./index.module.scss";

const FilterCheckbox = ({ option, option: { label, name, color }, applyColors, onFilterChange }) => {

    const [checked, setChecked] = useState(null);

    useEffect(() => {
        if (checked !== null) {
            checked ? onFilterChange(option, true) : onFilterChange(option, false);
        }
    }, [checked]);

    return (
        <div className={styles.checkboxWrapper} onClick={() => setChecked(!checked)} data-testid="checkbox-wrapper">
            <div className={`${styles.checkbox} ${checked ? styles.checked : ''}`} style={{ backgroundColor: applyColors && checked && color ? color : '' }} data-testid="checkbox">
                {checked && <i className="fa fa-check" />}
            </div>
            <span className={styles.title}>{label || name}</span>
        </div>
    )
}

export default FilterCheckbox;