import React, {useState} from 'react';

import styles from "./index.module.scss";

const FilterText = ({ value, placeholder, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState(value);

    const onSearch = term => {
      setSearchTerm(term);
      onFilterChange(term);
    };

    const onKeyPress = (ev) => {
        if (ev.charCode === 13) {
            onSearch(searchTerm);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.searchInput}>
                <input
                    value={searchTerm}
                    onChange={(ev) => setSearchTerm(ev.target.value)}
                    placeholder={placeholder}
                    data-testid="autocomplete-input"
                    onKeyPress={onKeyPress}
                />
                <i className={`fa fa-search ${styles.focus}`} onClick={() => onSearch(searchTerm)} />
                {searchTerm && <i className={`fa fa-times ${styles.focus}`} onClick={() => onSearch('')} />}
            </div>
        </div>
    );
};

export default FilterText;