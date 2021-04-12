# schedule-filter-widget
React component for the schedule filter widget


## Schedule Filter config

   ** onFilterApply(event)  = method called upon set a filter click   
       
   ** onTrackClick(trackId)  = method called upon track click 
   
   ** onCompanyClick(companyId)  = method called upon sponsor click 
   
   ** onRoomClick(roomId)  = method called upon room click 
   
   ** onSpeakerClick(speakerId)  = method called upon speaker click 
   
   onAuthError(err, res)  = method called upon api 401 or 403 error 

   title            = widget title

   eventCount       = # of events to show - defaults to 3
   
   slotCount        = min # of slots to show - defaults to 3 (used for placeholders)
   
   landscape        = shows events on a single row, default is portrait view (single column).
   
   yourSchedule     = shows upcoming events from YourSchedule - bool
   
   sponsorId        = shows upcoming events from a specific Sponsor - value sponsorId
   
   roomId           = shows upcoming events from a specific Room - value roomId
   
   speakerId        = shows upcoming events from a specific Speaker - value speakerId
   
   trackId          = shows upcoming events from a specific Track - value trackId
   
   showFilters      = display Filters - defaults to false
   
   showNav          = display Nav, if false we show all events from the show - defaults to true
   
   showAllEvents    = shows passed events when current date matches the selected date - defaults to false
   
   showDetails      = shows events details when click on event row - defaults to false
   
   hideAdd          = bool to disable "add to schedule" action - defaults to false
   
   showUTC          = bool to show UTC time next to event dates - defaults to false
   
   defaultImage     = url for image to show when no eventImage and no stream thumbnail available/set
   
   onRef            = method to retrieve schedule component ref. Usage -> {ref => (this.child = ref)}
   
   updateCallback   = method passed that will be called by component on update. args -> {action: 'ADD_TO_SCHEDULE', event}
   
   triggerUpdate    = this method is not passed, but exists in the component and can be called when update needed

   eventsData       = array of all events from the summit

   summitData       = object with the data from the summit

   marketingData    = object with the settings from the marketing API

   userProfile      = object with the data from the user profile
   
   eventCallback    = method that will return a promise with the result of add or remove an event for the user schedule.

   
## PUBLISH TO NPM:

1 - npm version patch / npm version minor / npm version major

2 - npm run publish-package

## IMPORT:

import ScheduleLite from 'schedule-lite';

import 'schedule-lite/index.css';

## DEBUG:
You can pass this hash on url to override current time, time must be in this format and on summit timezone

\#now=2020-06-03,10:59:50