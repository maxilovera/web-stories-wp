/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useDebouncedCallback } from 'use-debounce';
import { ReactComponent as DropDownIcon } from '../../icons/dropdown.svg';
import Popup from '../popup';
import FontPickerContainer from './pickerContainer';

const DEFAULT_WIDTH = 240;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  color: ${({ theme }) => theme.colors.fg.v0};
  font-family: ${({ theme }) => theme.fonts.body1.font};
`;

const FontPickerSelect = styled.div.attrs({ role: 'button', tabIndex: '0' })`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  background-color: ${({ theme, lightMode }) =>
    lightMode ? rgba(theme.colors.fg.v1, 0.1) : rgba(theme.colors.bg.v0, 0.3)};
  border-radius: 4px;
  padding: 2px 0 2px 6px;
  cursor: pointer;

  ${({ disabled }) =>
    disabled &&
    `
      pointer-events: none;
      opacity: 0.3;
    `}

  svg {
    width: 28px;
    height: 28px;
    color: ${({ theme, lightMode }) =>
      lightMode ? theme.colors.fg.v1 : rgba(theme.colors.fg.v1, 0.3)};
  }
`;

const FontPickerTitle = styled.span`
  user-select: none;
  color: ${({ theme }) => theme.colors.fg.v1};
  font-family: ${({ theme }) => theme.fonts.label.family};
  font-size: ${({ theme }) => theme.fonts.label.size};
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.label.weight};
  letter-spacing: ${({ theme }) => theme.fonts.label.letterSpacing};
`;

function FontPicker({ onChange, lightMode = false, placeholder, value }) {
  const selectRef = useRef();

  const [isOpen, setIsOpen] = useState(false);

  // Make some delay, since when click the dropdown again to close it, this function called before by useFocusOut
  // Causing reopen
  const [closeFontPicker] = useDebouncedCallback(() => {
    setIsOpen(false);
  }, 100);

  const handleCurrentValue = useCallback(
    (option) => {
      if (onChange) {
        onChange(option);
      }
      setIsOpen(false);
      selectRef.current.focus();
    },
    [onChange]
  );

  const handleSelectClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <Container>
      <FontPickerSelect
        onClick={handleSelectClick}
        aria-pressed={isOpen}
        aria-haspopup={true}
        aria-expanded={isOpen}
        ref={selectRef}
        lightMode={lightMode}
      >
        <FontPickerTitle>{value || placeholder}</FontPickerTitle>
        <DropDownIcon />
      </FontPickerSelect>
      <Popup anchor={selectRef} isOpen={isOpen} width={DEFAULT_WIDTH}>
        <FontPickerContainer
          handleCurrentValue={handleCurrentValue}
          onClose={closeFontPicker}
        />
      </Popup>
    </Container>
  );
}

FontPicker.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  lightMode: PropTypes.bool,
  placeholder: PropTypes.string,
};

FontPicker.defaultProps = {
  value: '',
  onChange: () => {},
  lightMode: false,
  placeholder: __('Select an Option', 'web-stories'),
};

export default FontPicker;