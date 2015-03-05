'use strict';

/**
 * Metro
 * An entry barrier opens only if the ticket meets all of the following criteria:
 *
 * 1. it is valid for travel from that station;
 * 2. it has not expired;
 * 3. it has not already been used for the maximum number of journeys allowed.
 */

require('es6-promise').polyfill();
var Spec = require('./../lib/bspec').PromiseSpec;


var TODAY = new Date(2015, 2, 1);

var isTicketExpired = function isTicketExpired(ticket, cb) {
  return Promise.resolve(TODAY > ticket.expiresAt);
};

var isMaxJourneys = function isMaxJourneys(ticket, cb) {
  return Promise.resolve(ticket.cur_journeys >= ticket.max_journeys);
};

var isValidFromStation = function isValidFromStation(name, ticket, cb) {
  return Promise.resolve(ticket.stations.indexOf(name) !== -1);
};


var lowangenBarrier =
  Spec(isValidFromStation.bind(null, 'Lowangen'))
    .and(Spec(isTicketExpired).not())
    .and(Spec(isMaxJourneys).not());

var rivaBarrier =
  Spec(isValidFromStation.bind(null, 'Riva'))
    .and(Spec(isTicketExpired).not())
    .and(Spec(isMaxJourneys).not());


var ticket = {
  stations: [ 'Lowangen' ],
  expiresAt: new Date(2015, 2, 6),
  max_journeys: 30,
  cur_journeys: 11
};

lowangenBarrier.isSatisfiedBy(ticket)
  .then(function(result) {
    console.log('The ticket can be used to enter the Lowangen station:', result);
  })
  .catch(function(err) {
    throw err;
  });

rivaBarrier.isSatisfiedBy(ticket)
  .then(function(result) {
    console.log('The ticket can be used to enter the Riva station:', result);
  })
  .catch(function(err) {
    throw err;
  });
