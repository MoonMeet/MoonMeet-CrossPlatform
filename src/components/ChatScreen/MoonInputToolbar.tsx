import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Keyboard, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Color from './Color'
import { Actions, ActionsProps, Composer, ComposerProps, IMessage, Send, SendProps, StylePropType } from 'react-native-gifted-chat'
import { COLORS } from '../../config/Miscellaneous'

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Color.defaultColor,
    backgroundColor: COLORS.white,
    bottom: 0,
    left: 0,
    right: 0,
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  accessory: {
    height: 44,
  },
})

export interface MoonInputToolbarProps<TMessage extends IMessage> {
  options?: { [key: string]: any }
  optionTintColor?: string
  containerStyle?: StyleProp<ViewStyle>
  primaryStyle?: StyleProp<ViewStyle>
  accessoryStyle?: StyleProp<ViewStyle>
  renderAccessory?(props: MoonInputToolbarProps<TMessage>): React.ReactNode
  renderActions?(props: ActionsProps): React.ReactNode
  renderSend?(props: SendProps<TMessage>): React.ReactNode
  renderComposer?(props: ComposerProps): React.ReactNode
  onPressActionButton?(): void
}

export function MoonInputToolbar<TMessage extends IMessage = IMessage>(
  props: MoonInputToolbarProps<TMessage>,
) {
  const [position, setPosition] = useState('absolute')
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => setPosition('relative'),
    )
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => setPosition('absolute'),
    )
    return () => {
      keyboardWillShowListener?.remove()
      keyboardWillHideListener?.remove()
    }
  }, [])

  const { containerStyle, ...rest } = props
  const {
    renderActions,
    onPressActionButton,
    renderComposer,
    renderSend,
    renderAccessory,
  } = rest

  return (
    <View style={[styles.container, { position }, containerStyle] as ViewStyle}>
      <View style={[styles.primary, props.primaryStyle]}>
        {renderActions?.(rest) ||
          (onPressActionButton && <Actions {...rest} />)}
        {renderComposer?.(props as ComposerProps) || <Composer {...props} />}
        {renderSend?.(props) || <Send {...props} />}
      </View>
      {renderAccessory && (
        <View style={[styles.accessory, props.accessoryStyle]}>
          {renderAccessory(props)}
        </View>
      )}
    </View>
  )
}

MoonInputToolbar.propTypes = {
  renderAccessory: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderComposer: PropTypes.func,
  onPressActionButton: PropTypes.func,
  containerStyle: StylePropType,
  primaryStyle: StylePropType,
  accessoryStyle: StylePropType,
}
