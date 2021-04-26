import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from "./index.module.scss";

const FilterCheckbox = ({ option, option: { label, name, color }, onFilterChange, filtered }) => {

    const [checked, setChecked] = useState(null);

    useEffect(() => {
        if (checked === null && filtered[0]?.options.find(f => f === option)) {
            setChecked(true);
        } else if (checked !== null) {
            checked ? onFilterChange(option, true) : onFilterChange(option, false);
        }
    }, [checked]);

    return (
        <div className={styles.checkboxWrapper} onClick={() => setChecked(!checked)}>
            <div className={`${styles.checkbox} ${checked ? styles.checked : ''}`} style={{ backgroundColor: checked && color ? color : '' }}>
                {checked && <i className="fa fa-check" />}
            </div>
            <span className={styles.title}>{label || name}</span>
        </div>
    )
}

export default FilterCheckbox;