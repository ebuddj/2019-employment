import React, {Component} from 'react'
import style from './../styles/styles.less';

import CountUpElement from './CountUpElement.jsx';

// https://alligator.io/react/axios-react/
import axios from 'axios';

// https://github.com/joshwcomeau/react-flip-move
import FlipMove from 'react-flip-move';

// https://underscorejs.org/
import _ from 'underscore';

let country_prev_data = {};
let interval;
class App extends Component {
  constructor() {
    super();
    this.state = {
      date:0,
      data:false
    }
  }
  componentDidMount() {
    let self = this;
    axios.get('./data/data.json', {
    })
    .then(function (response) {
      self.setState((state, props) => ({
        data:response.data
      }));
      interval = setInterval(function() {
        if (self.state.date >= (_.keys(response.data['Finland']).length - 1)) {
          clearInterval(interval);
        }
        else {
          self.setState((state, props) => ({
            date:state.date + 1
          }));
        }
      }, 800);
    })
    .catch(function (error) {
    })
    .then(function () {
    });
  }
  componentWillUnMount() {
    clearInterval(interval);
  }
  render() {
    let countries  = [];
    let html = [];
    let dates = _.keys(this.state.data['Finland']);
    let items = [];
    _.each(this.state.data, (data, country) => {
      let bar_style;
      if (data[dates[this.state.date]] > 0) {
        items.push({
          bar_style:{width:data[dates[this.state.date]] + '%'},
          country:country,
          end:data[dates[this.state.date]],
          img_src:'./img/' + country + '.png',
          start:country_prev_data[country]
        });
        country_prev_data[country] = data[dates[this.state.date]];
      }
      else if (country_prev_data[country]) {
        items.push({
          bar_style:{width:data[dates[this.state.date]] + '%'},
          country:country,
          end:country_prev_data[country],
          img_src:'./img/' + country + '.png',
          start:country_prev_data[country]
        });
      }
    });
    items = _.sortBy(items, (item) => { return -item.end; });
    return (
      <div className={style.app}>
        <h3>Employment rate per country {dates[this.state.date]}</h3>
        <FlipMove typeName="ul">
          {items.map(item => (
            <li key={item.country} className={style.bar_container}><span className={style.bar} style={item.bar_style}><span className={style.value}><CountUpElement start={item.start} end={item.end} /></span></span><span className={style.country_name}><img src={item.img_src} alt="" /> {item.country}</span></li>
          ))}
        </FlipMove>
      </div>
    );
  }
}
export default App;