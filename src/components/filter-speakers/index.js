import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

import styles from "./index.module.scss";


const FilterSpeaker = ({ options, values, onFilterChange }) => {
    const [selectedSpeakers, setSelectedSpeakers] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debounceSearchTerm] = useDebounce(searchTerm, 500);
    const [searching, setSearching] = useState(false);
    const [filteredSpeakers, setFilteredSpeakers] = useState(options.sort((a, b) => a.name.localeCompare(b.name)));

    useEffect(() => {
        if (selectedSpeakers === null) {
            const filteredOptions = values || [];
            if (filteredOptions.length > 0) setFilteredSpeakers(options.filter(speaker => !filteredOptions.some(s => s.id === speaker.id)));
            setSelectedSpeakers([...filteredOptions]);
        } else {
            searchSpeakers();
        }
    }, [debounceSearchTerm]);



    const searchSpeakers = () => {
        const filtered = options.filter(s => {
            const isMatch = !debounceSearchTerm || s.name.toLowerCase().includes(debounceSearchTerm.toLowerCase());
            const alreadySelected = values.includes(s.id);
            return isMatch && !alreadySelected;
        });

        setFilteredSpeakers(filtered);
    };

    const selectSpeaker = (speakerId) => {
        setSelectedSpeakers([...selectedSpeakers, speakerId]);
        onFilterChange(speakerId, true);
        setSearching(false);
        setSearchTerm('');
    };

    const removeSpeaker = (speakerId) => {
        setSelectedSpeakers(selectedSpeakers.filter(s => s.id !== speakerId));
        onFilterChange(speakerId, false);
    };

    return (
        <div className={styles.speakersWrapper} data-testid="speakers-wrapper">
            <div className={styles.speakersInput}>
                <input
                    value={searchTerm}
                    onChange={(ev) => setSearchTerm(ev.target.value)}
                    onFocus={() => {setSearching(true);}}
                    onBlur={() => {setTimeout(() => {setSearching(false);}, 200);}}
                    placeholder="Search Speakers"
                    data-testid="speakers-input"
                />
                <i className={`fa fa-search ${styles.focus}`} onClick={() => setSearching(true)} />
            </div>
            {searching &&
                <div className={styles.speakersDropdown} data-testid="speakers-dropdown">
                    {filteredSpeakers.map(speaker => {
                        return (
                            <div key={speaker.id} className={styles.speaker} onClick={() => selectSpeaker(speaker.id)}>
                                <img className={styles.picture} src={speaker.pic} />
                                <span className={styles.name}>{speaker.name}</span>
                            </div>
                        )
                    })}

                    {filteredSpeakers.length === 0 &&
                    <div className={styles.noResult}>
                        <span>There is no results for the search</span>
                    </div>
                    }
                </div>
            }
            {selectedSpeakers?.length > 0 &&
                <div className={styles.selectedSpeakers} data-testid="speakers-selected">
                    {options.filter(op => selectedSpeakers.includes(op.id)).map(speaker => {
                        return (
                            <div key={speaker.id} onClick={() => removeSpeaker(speaker.id)} data-testid="speakers-selected-button">
                                <img className={styles.picture} src={speaker.pic} />
                                <span className={styles.name}>{speaker.name}</span>
                                <i className="fa fa-close" />
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}

export default FilterSpeaker;