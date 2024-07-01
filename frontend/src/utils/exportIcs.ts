import * as ics from 'ics'
import { writeFileSync  } from 'fs'

function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const exportIcs = () => {
  const event = {
    start: [2024, 6, 30, 6, 30],
    duration: { hours: 6, minutes: 30 },
    title: 'EXPORT TEST',
    description: 'Test Export ics',
    location: 'Folsom Field, University of Colorado (finish line)',
    url: 'http://www.bolderboulder.com/',
    geo: { lat: 40.0095, lon: 105.2669 },
    categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
    attendees: [
      { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
      { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
    ]
  }
  ics.createEvent(event, (error, value) => {
    if (error) {
      console.log(error)
      return
    }
  
    download(`event.ics`, value)
    console.log(value)
  })
}

export default exportIcs;