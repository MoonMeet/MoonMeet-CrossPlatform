/*
 * This is the source code of Moon Meet CrossPlatform.
 * It is licensed under GNU GPL v. 3.
 * You should have received a copy of the license in this archive (see LICENSE).
 *
 * Copyright Rayen Sbai, 2021-2024.
 */

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import lodash from 'lodash';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    height: 50,
    width: 50,
    borderBottomWidth: 3,
    margin: 5,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '500',
    color: '#000000',
  },
});

interface OTPTextViewProps {
  defaultValue?: string;
  inputCount?: number;
  tintColor?: string;
  offTintColor?: string;
  inputCellLength?: number;
  handleTextChange?: (value: string) => void;
  containerStyle?: object;
  textInputStyle?: object;
  keyboardType?: KeyboardTypeOptions;
  ref?: React.Ref<OTPTextViewHandle>;
  editable?: boolean;
}

export interface OTPTextViewHandle {
  clear: () => void;
}

/**
 * OTPTextView is a custom component that allows users to input OTP (One-Time-Password) characters.
 * It takes in various props to customize its appearance and behavior.
 *
 * @typedef {Object} OTPTextViewProps
 * @property {string} [defaultValue=''] - The default value for the OTP input.
 * @property {number} [inputCount=4] - The number of input cells for the OTP.
 * @property {string} [tintColor='#3CB371'] - The color of the input cell when focused.
 * @property {string} [offTintColor='#DCDCDC'] - The color of the input cell when not focused.
 * @property {number} [inputCellLength=1] - The maximum length of each input cell.
 * @property {object} [containerStyle={}] - The style object for the container View.
 * @property {object} [textInputStyle={}] - The style object for the TextInput.
 * @property {function} [handleTextChange=() => {}] - The function that handles the text change event.
 * @property {string} [keyboardType='numeric'] - The type of keyboard to be displayed for the TextInput.
 * @property {boolean} [editable=true] - Whether the TextInput is editable or not.
 */
const OTPTextView = forwardRef<OTPTextViewHandle, OTPTextViewProps>(
  (
    {
      defaultValue = '',
      inputCount = 4,
      tintColor = '#3CB371',
      offTintColor = '#DCDCDC',
      inputCellLength = 1,
      containerStyle = {},
      textInputStyle = {},
      handleTextChange = () => {},
      keyboardType = 'numeric',
      editable = true,
    },
    ref,
  ) => {
    const [focusedInput, setFocusedInput] = useState(0);
    const [otpText, setOtpText] = useState<string[]>(
      Array.from({length: inputCount}, (_, i) => defaultValue[i] || ''),
    );

    /**
     * Clears the OTP text by setting it to an array of empty strings.
     *
     * @function
     * @name clear
     */
    const clear = () => {
      setOtpText(new Array(inputCount).fill(''));
    };

    // Expose the clear method to parent components
    useImperativeHandle(ref, () => ({
      clear,
    }));

    const inputsRef = useRef<Array<React.RefObject<TextInput>>>(
      Array.from({length: inputCount}, () => React.createRef()),
    );

    useEffect(() => {
      inputsRef.current[focusedInput].current?.focus();
    }, [focusedInput]);

    /**
     * Debounce handle for text change.
     *
     * @param {Function} handleTextChange - The function to be called on text change.
     * @returns {Function} - The debounced function.
     */
    const debounceHandleTextChange = useMemo(
      () => lodash.debounce(handleTextChange, 175),
      [handleTextChange],
    );

    /**
     * Updates the OTP (One-Time Password) and performs additional actions.
     *
     * @param {string[]} newOtp - The new OTP to be updated.
     *
     * @returns {void}
     */
    const updateOTP = useCallback(
      (newOtp: string[]) => {
        debounceHandleTextChange(newOtp.join(''));
        setOtpText(newOtp);
      },
      [debounceHandleTextChange],
    );

    /**
     * Callback function triggered when the text in an input cell changes.
     * It updates the OTP (One-Time Password) with the new text at the specified position.
     * If the text length is equal to the input cell length, and it's not the last input cell,
     * it sets the focus to the next input cell.
     *
     * @param {string} text - The new text entered the input cell.
     * @param {number} position - The position of the input cell in the OTP.
     * @returns {void}
     */
    const onTextChange = useCallback(
      (text: string, position: number): void => {
        const newOtp = [...otpText];
        newOtp[position] = text;
        if (text.length === inputCellLength && position !== inputCount - 1) {
          setFocusedInput(position + 1);
        }
        updateOTP(newOtp);
      },
      [inputCellLength, inputCount, otpText, updateOTP],
    );

    /**
     * Handles the key press event when the user types in the TextInput.
     *
     * @param {NativeSyntheticEvent<TextInputKeyPressEventData>} event - The event object containing the key press information.
     * @param {number} position - The index position of the key press event in the otpText array.
     *
     * @returns {void}
     */
    const onKeyPress = useCallback(
      (
        event: NativeSyntheticEvent<TextInputKeyPressEventData>,
        position: number,
      ) => {
        const {
          nativeEvent: {key},
        } = event;
        if (key === 'Backspace' && otpText[position] === '' && position > 0) {
          setFocusedInput(position - 1);
        }
      },
      [otpText],
    );

    /**
     * fillInputs is a function that returns an array of JSX elements.
     * Each element in the array represents an input field (TextInput) for entering OTP (One-Time Password).
     * The number of input fields in the array is determined by the value of the inputCount variable.
     * The styling of each input field is determined by the styles.textInput and textInputStyle variables.
     * The borderColor of each input field is determined by the focusedInput, tintColor, and offTintColor variables.
     * The value of each input field is determined by the otpText array, where each element represents the value of the corresponding input field.
     * The maximum length of each input field is determined by the inputCellLength variable.
     * The autoFocus property on the first input field is determined by whether its index is 0.
     * The keyboardType property on each input field is determined by the keyboardType variable.
     * The onFocus event handler on each input field sets the focusedInput to its index.
     * The onChangeText event handler on each input field calls the onTextChange function with the entered text and the index of the input field.
     * The onKeyPress event handler on each input field calls the onKeyPress function with the key event and the index of the input field.
     * The editable property on each input field is determined by the editable variable.
     *
     * @returns {Array<JSX.Element>} - An array of JSX elements representing input fields for entering OTP.
     * @since 1.0.0
     */
    const fillInputs = useCallback(
      () =>
        Array.from({length: inputCount}, (_, i) => {
          const inputStyle = [
            styles.textInput,
            textInputStyle,
            {borderColor: i === focusedInput ? tintColor : offTintColor},
          ];
          return (
            <TextInput
              key={`OTPInput_${i}`}
              ref={inputsRef.current[i]}
              autoFocus={i === 0}
              keyboardType={keyboardType}
              style={inputStyle}
              value={otpText[i] || ''}
              maxLength={inputCellLength}
              onFocus={() => setFocusedInput(i)}
              onChangeText={text => onTextChange(text, i)}
              onKeyPress={event => onKeyPress(event, i)}
              editable={editable}
            />
          );
        }),
      [
        inputCount,
        keyboardType,
        textInputStyle,
        tintColor,
        offTintColor,
        focusedInput,
        otpText,
        inputCellLength,
        editable,
        onTextChange,
        onKeyPress,
      ],
    );

    return (
      <View style={[styles.container, containerStyle]}>{fillInputs()}</View>
    );
  },
);
export default OTPTextView;
