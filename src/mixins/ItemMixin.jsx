'use strict';

var React = require('react')
var {Link} = require('react-router')
var TimeAgo = require('react-timeago')

var SettingsStore = require('../stores/SettingsStore')
var pluralise = require('../utils/pluralise')

var parseHost = (function() {
  var a = document.createElement('a')
  return function(url) {
    a.href = url
    var parts = a.hostname.split('.').slice(-3)
    if (parts[0] === 'www') {
      parts.shift()
    }
    return parts.join('.')
  }
})()

/**
 * Reusable logic for displaying an item.
 */
var ItemMixin = {
  /**
   * Render an item's metadata bar.
   */
  renderItemMeta(item, extraContent) {
    var itemDate = new Date(item.time * 1000)

    if (item.type == 'job') {
      return <div className="Item__meta">
        <TimeAgo date={itemDate} className="Item__time"/>
      </div>
    }

    return <div className="Item__meta">
      <span className="Item__score">
        {item.score} point{pluralise(item.score)}
      </span>{' '}
      <span className="Item__by">
        by <Link to="user" params={{id: item.by}}>{item.by}</Link>
      </span>{' '}
      <TimeAgo date={itemDate} className="Item__time"/>
      {' | '}
      <Link to={item.type} params={{id: item.id}}>
        {item.descendants > 0 ? item.descendants + ' comment' + pluralise(item.descendants) : 'discuss'}
      </Link>
      {extraContent}
    </div>
  },

  /**
   * Render an item's title bar.
   */
  renderItemTitle(item) {
    var hasURL = !!item.url
    var title
    if (item.dead) {
      title = '[dead] ' + item.title
    }
    else {
      title = (hasURL ? <a href={item.url}>{item.title}</a>
                      : <Link to={item.type} params={{id: item.id}}>{item.title}</Link>)
    }
    return <div className="Item__title" style={{fontSize: SettingsStore.titleFontSize}}>
      {title}
      {hasURL && ' '}
      {hasURL && <span className="Item__host">({parseHost(item.url)})</span>}
    </div>
  }
}

module.exports = ItemMixin
