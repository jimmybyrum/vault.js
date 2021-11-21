import { Config } from '../types';

export default function(config: Config = {}) {
  if (!config.expires) {
    config.expires = 'session';
  }
  // looking for something like: "+5 days"
  if (config.expires.match(/^(\+|\-)\d+\s\w+/)) {
    const expires: any = new Date();
    const operator = config.expires.substring(0, 1);
    const parts = config.expires.substring(1).split(' ');
    const num = parseInt(parts[0], 10);
    let time = parts[1];
    switch (time) {
      case 'millisecond':
      case 'milliseconds':
        time = 'Milliseconds';
        break;
      case 'second':
      case 'seconds':
        time = 'Seconds';
        break;
      case 'minute':
      case 'minutes':
        time = 'Minutes';
        break;
      case 'hour':
      case 'hours':
        time = 'Hours';
        break;
      case 'day':
      case 'days':
        time = 'Date';
        break;
      case 'month':
      case 'months':
        time = 'Month';
        break;
      case 'year':
      case 'years':
        time = 'FullYear';
        break;
    }
    if (operator === '-') {
      expires['set' + time](expires['get' + time]() - num);
    } else {
      expires['set' + time](expires['get' + time]() + num);
    }
    return expires;
  }
  return new Date(config.expires);
}
