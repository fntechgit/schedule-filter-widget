import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from "./index.module.scss";

import { useDebounce } from 'use-debounce';

const FilterSpeaker = ({ options, onFilterChange, filtered }) => {

    const [selectedSpeakers, setSelectedSpeakers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debounceSearchTerm] = useDebounce(searchTerm, 500);
    const [searching, setSearching] = useState(false);
    const [filteredSpeakers, setFilteredSpeakers] = useState(options.sort((a, b) => a.last_name.localeCompare(b.last_name)));

    useEffect(() => {
        searchSpeakers();
    }, [debounceSearchTerm]);

    const searchSpeakers = () => {
        if (debounceSearchTerm.length > 2) {
            const filtered = options.filter((speaker) => {
                return speaker.first_name.toLowerCase().includes(debounceSearchTerm.toLowerCase()) ||
                    speaker.last_name.toLowerCase().includes(debounceSearchTerm.toLowerCase());
            })
            setFilteredSpeakers(filtered);
        } else {
            const filteredOptions = filtered[0]?.options || [];
            filteredOptions.length > 0 ? setFilteredSpeakers(options.filter(speaker => !filteredOptions.includes(speaker))) : setFilteredSpeakers(options);
            setSelectedSpeakers([...selectedSpeakers, ...filteredOptions]);
        }
    }

    const selectSpeaker = (speaker) => {
        setSelectedSpeakers([...selectedSpeakers, speaker]);
        setFilteredSpeakers(filteredSpeakers.filter(s => s.id !== speaker.id));
        onFilterChange(speaker, true);
        setSearching(false);
    }

    const removeSpeaker = (speaker) => {
        setSelectedSpeakers(selectedSpeakers.filter(s => s.id !== speaker.id));
        setFilteredSpeakers([...filteredSpeakers, speaker].sort((a, b) => a.last_name.localeCompare(b.last_name)));
        onFilterChange(speaker, false);
    }

    return (
        <div className={styles.speakersWrapper}>
            <div className={styles.speakersInput}>
                <input
                    onChange={(ev) => setSearchTerm(ev.target.value)}
                    onFocus={() => setSearching(true)}
                    onBlur={() => {
                        setTimeout(() => {
                            setSearching(false);
                        }, 400)
                    }}
                    placeholder="Search Speakers" />
                <i className="fa fa-search" />
            </div>
            {searching &&
                <div className={styles.speakersDropdown}>
                    {filteredSpeakers.length > 0
                        ?
                        filteredSpeakers.map(speaker => {
                            return (
                                <div key={speaker.id} className={styles.speaker} onClick={() => selectSpeaker(speaker)}>
                                    <img className={styles.picture} src={speaker.pic} />
                                    <span className={styles.name}>{speaker.first_name} {speaker.last_name}</span>
                                </div>
                            )
                        })
                        :
                        <div className={styles.noResult}>
                            <span>There is no results for the search</span>
                        </div>
                    }
                </div>
            }
            {selectedSpeakers.length > 0 &&
                <div className={styles.selectedSpeakers}>
                    {selectedSpeakers.map(speaker => {
                        return (
                            <div key={speaker.id} onClick={() => removeSpeaker(speaker)}>
                                <img className={styles.picture} src={speaker.pic} />
                                <span className={styles.name}>{speaker.first_name} {speaker.last_name}</span>
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