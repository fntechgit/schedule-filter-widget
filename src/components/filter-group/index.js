import React from 'react';
import PropTypes from 'prop-types';

import styles from "./index.module.scss";

const FilterGroup = ({ title,type }) => {
    return (
        <div>
            <span className={styles.title}>{title}</span>
        </div>
    )
}

export default FilterGroup;