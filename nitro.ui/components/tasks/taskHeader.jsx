import React from 'react'
import PropTypes from 'prop-types'
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { headerMenu } from './taskMenu.js'
import { vars } from '../../styles.js'

import moreIcon from '../../../assets/icons/material/task-more.svg'

export class TaskHeader extends React.PureComponent {
  static propTypes = {
    taskId: PropTypes.string
  }
  constructor(props) {
    super(props)
    const newState = this.generateState(this.props)
    newState.textInputFocus = false
    this.state = newState
  }
  generateState(props) {
    const task = NitroSdk.getTask(props.taskId)
    return {
      name: task.name
    }
  }
  triggerFocus = () => {
    this.setState({
      textInputFocus: true
    })
  }
  triggerChange = e => {
    this.setState({
      name: e.currentTarget.value
    })
  }
  triggerBlur = () => {
    const name = this.state.name.trim()
    if (name === '') {
      const state = this.generateState(this.props)
      state.textInputFocus = false
      this.setState(state)
    } else {
      if (NitroSdk.getTask(this.props.taskId).name !== this.state.name) {
        NitroSdk.updateTask(this.props.taskId, {
          name: this.state.name
        })
      }
      this.setState({
        textInputFocus: false
      })
    }
  }
  triggerKeyUp = e => {
    // ESC
    if (e.keyCode === 27) {
      this.setState(this.generateState(this.props))
      e.currentTarget.blur()
      // ENTER
    } else if (e.keyCode === 13) {
      e.currentTarget.blur()
    }
  }
  triggerMore = e => {
    const x = e.nativeEvent.pageX
    const y = e.nativeEvent.pageY - window.scrollY
    headerMenu(this.props.taskId, x, y, 'top', 'right')
  }
  render() {
    const wrapperStyles = this.state.textInputFocus ?
      [styles.wrapper, styles.wrapperFocus] :
      styles.wrapper
    return (
      <View style={wrapperStyles}>
        <TextInput
          style={styles.text}
          value={this.state.name}
          onChange={this.triggerChange}
          onFocus={this.triggerFocus}
          onBlur={this.triggerBlur} 
          onKeyUp={this.triggerKeyUp}
        />
        <TouchableOpacity
          style={styles.moreIcon}
          onPress={this.triggerMore}
        >
          <Image
            accessibilityLabel="Choose Deadline"
            source={moreIcon}
            resizeMode="contain"
            style={styles.barIcon}
          />
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    marginTop: vars.padding,
    marginBottom: vars.padding / 2,
    marginLeft: vars.padding / 2,
    marginRight: vars.padding / 2,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  wrapperFocus: {
    borderBottomColor: vars.accentColorMuted
  },
  text: {
    fontSize: vars.taskHeaderFontSize,
    lineHeight: vars.taskHeaderFontSize,
    fontFamily: vars.fontFamily,
    paddingTop: vars.padding / 2, 
    paddingBottom: vars.padding / 2,
    fontWeight: 'bold',
    outline: '0',
    flex: 1
  },
  moreIcon: {
    paddingTop: vars.padding / 2,
    paddingBottom: vars.padding / 2,
    paddingLeft: vars.padding / 2
  },
  barIcon: {
    opacity: 0.5,
    height: 24,
    width: 24
  }
})