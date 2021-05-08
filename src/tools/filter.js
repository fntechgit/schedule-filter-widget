/**
 * Copyright 2020 OpenStack Foundation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

const EventListFilter = {

    events(filters, events, loggedUser) {
        const { tracks, trackgroups, eventtypes, room, sponsor, speaker, yours } = filters;
        const { schedule_summit_events, favorite_summit_events } = loggedUser || {};

        const unmatchedEvents = events.filter(event => {
            return (
                tracks.length      && !this.matchTracks(event, tracks) ||
                trackgroups.length && !this.matchTrackGroups(event, trackgroups) ||
                eventtypes.length  && !this.matchEventTypes(event, eventtypes)
            )
        });

        return unmatchedEvents.map(event => event.id)
    },

    matchTrackGroups(event, filterValue) {
        if (!event.hasOwnProperty('track')) return false;
        return filterValue.some(groupId => event.track.track_groups.includes(groupId));
    },

    matchEventTypes(event, filterValue) {
        return filterValue.includes(event.type.id);
    },

    matchTracks(event, filterValue) {
        if (!event.hasOwnProperty('track')) return false;
        return filterValue.includes(event.track.id);
    },

    matchLevels(event, filterValue) {
        if (!event.hasOwnProperty('level')) return false;
        return filterValue.includes(event.level.toLowerCase());
    },

    matchTags(event, filterValue) {
        return event.tags.some(tag => filterValue.includes(tag.id));
    },

    matchGoing(event, filterValue, eventsGoing) {
        return eventsGoing ? eventsGoing.find(ev => ev.id === event.id) : false;
    },

    matchFavorites(event, filterValue, eventsFav) {
        return eventsFav ? eventsFav.find(ev => ev.id === event.id) : false;
    },

    matchRecorded(event, filterValue) {
        return event.to_record === true
    },
};

export default EventListFilter
