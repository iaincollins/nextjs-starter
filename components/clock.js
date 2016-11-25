import React from 'react'
import { connect } from 'react-redux'
import { style, merge } from 'next/css'

export default connect(state => state)(({ lastUpdate, light }) => {
  return (
    <div className={merge(styles, style({ backgroundColor: light ? '#999' : '#000' }))}>
      {format(new Date(lastUpdate))}
    </div>
  )
})

const format = t => `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`

const pad = n => n < 10 ? `0${n}` : n

const styles = style({
  padding: '15px',
  display: 'inline-block',
  color: '#82FA58',
  font: '50px menlo, monaco, monospace'
})