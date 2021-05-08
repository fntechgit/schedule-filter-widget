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

const EventListFixedFilter = {

    events(filters, events, loggedUser) {
        const { roomId, sponsorId, trackId, speakerId, yours } = filters;
        const { schedule_summit_events } = loggedUser || {};

        return events.filter(event => {
            return (
                // (!roomId    || this.matchRoom(event, roomId)) &&
                // (!sponsorId || this.matchSponsor(event, sponsorId)) &&
                // (!speakerId || this.matchSpeaker(event, speakerId)) &&
                // (!trackId   || this.matchTrack(event, trackId)) &&
                (!yours     || this.matchYours(event, schedule_summit_events))
            )
        });
    },

    matchRoom(event, filterValue) {
        if (!event.hasOwnProperty('location')) return false;
        return (filterValue === event.location.id);
    },

    matchSponsor(event, filterValue) {
        if (!event.sponsors || event.sponsors.length === 0) return false;
        return event.sponsors.map(s => s.name).includes(filterValue);
    },

    matchSpeaker(event, filterValue) {
        if (!event.speakers || event.speakers.length === 0) return false;
        return event.speakers.map(s => s.id).includes(filterValue);
    },

    matchTrack(event, filterValue) {
        if (!event.hasOwnProperty('track')) return false;
        return (filterValue === event.track.id);
    },

    matchYours(event, yourScheduleEvents) {
        if (!yourScheduleEvents || yourScheduleEvents.length === 0) return false;
        return yourScheduleEvents.includes(event.id);
    },
};

export default EventListFixedFilter
