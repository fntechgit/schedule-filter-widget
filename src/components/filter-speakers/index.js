import React from 'react';
import PropTypes from 'prop-types';

import styles from "./index.module.scss";

const FilterSpeaker = ({ options }) => {    
    return options.map(speaker => {
        return (
            <div key={speaker.id}>
                <img className={styles.picture} src={speaker.pic} />
                <span className={styles.name}>{speaker.first_name} {speaker.last_name}</span>
            </div>
        )
    }
    )
}

export default FilterSpeaker;