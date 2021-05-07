import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from "./index.module.scss";

const FilterCheckbox = ({ option, option: { label = '', name = '', color }, applyColors, filtered, onFilterChange }) => {

    const [checked, setChecked] = useState(null);

    useEffect(() => {
        if (checked === null && filtered?.some(elem => (elem.value && elem.value === option.value) || (elem.id && elem.id === option.id))) {
            setChecked(true)
        }
        if (checked !== null) {
            checked ? onFilterChange(option, true) : onFilterChange(option, false);
        }
    }, [checked]);

    return (
        <div className={styles.checkboxWrapper} onClick={() => setChecked(!checked)} data-testid="checkbox-wrapper">
            <div className={`${styles.checkbox} ${checked ? styles.checked : ''}`} style={{ backgroundColor: applyColors && checked && color ? color : '' }} data-testid="checkbox">
                {checked && <i className="fa fa-check" data-testid="checkmark" />}
            </div>
            <span className={styles.title}>{label || name}</span>
        </div>
    )
}

export default FilterCheckbox;