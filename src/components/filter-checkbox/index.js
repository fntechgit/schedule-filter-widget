import React from 'react';
import PropTypes from 'prop-types';

import styles from "./index.module.scss";

const FilterCheckbox = ({ title, color }) => {
    return (
        <div className={styles.checkbox}>            
            <input type="checkbox"/>
            <span className={styles.title}>{title}</span>
        </div>
    )
}

export default FilterCheckbox;