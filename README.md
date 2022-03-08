# schedule-filter-widget
React component for the schedule filter widget


## Schedule Filter config      

   **title**                = widget title, defaults to "Filter by"
   
   **summit**               = the summit object
   
   **events**               = the FILTERED collection of events currently rendered
   
   **allEvents**            = the COMPLETE collection of events, needed to pull all available options.
   
   **marketingSettings**    = object with the settings from the marketing API
    
   **colorSource**          = source of color, could be one of : event_type, track, track_group 
   
   **filters**              = object with the desired filters to render and its values. 
   
   
   Example:
   ```
   [
     date: {label: "Date", values: [], enabled: true},
     level: {label: "Level", values: ["Beginner", "Intermediate"], enabled: false}
   ]
   ```

   **expandedByDefault**    = boolean to set the filters expanded/collapsed on load
   
   **triggerAction**    = method that will take an ACTION and a payload as params and will return a promise.
   Example: `{action: 'UPDATE_FILTER', payload: {type, values}}`
   
## PUBLISH TO NPM:

1 - yarn build && yarn publish

2 - yarn publish-package

## IMPORT:

import ScheduleFilterWidget from 'schedule-filter-widget/dist';

import 'schedule-filter-widget/dist/index.css';