import React, { useState } from 'react';
import PropTypes from 'prop-types';

import styles from "./index.module.scss";

const FilterCheckbox = ({ option, option: { label, name, color }, onFilterChange }) => {

    const [checked, setChecked] = useState(false);

    const toggleFilter = () => {
        setChecked(!checked);
        onFilterChange(option);
    }

    return (
        <div className={styles.checkboxWrapper} onClick={() => toggleFilter()}>
            <div className={`${styles.checkbox} ${checked ? styles.checked : ''}`}>
                {checked && <i className="fa fa-check" />}
            </div>
            <span className={styles.title}>{label || name}</span>
        </div>
    )
}

export default FilterCheckbox;