import React from 'react';
import PropTypes from 'prop-types';

import styles from "./index.module.scss";

const FilterCheckbox = ({ option, option: { label, name, color }, onFilterChange }) => {
    return (
        <div className={styles.checkbox}>
            <input type="checkbox" onChange={() => onFilterChange(option)} />
            <span className={styles.title}>{label || name}</span>
        </div>
    )
}

export default FilterCheckbox;