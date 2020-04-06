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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';
import { useState } from 'react';
import { Manager, Reference, Popper } from 'react-popper';

/**
 * Internal dependencies
 */
import { prettifyShortcut } from '../keyboard';

const SPACING = 12;
const PADDING = 4;

const Wrapper = styled.div`
  position: relative;
`;

const Tooltip = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.v0};
  color: ${({ theme }) => theme.colors.fg.v1};
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: 12px;
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body1.letterSpacing};
  padding: ${PADDING}px ${PADDING * 2}px;
  border-radius: 6px;
  box-shadow: 0px 6px 10px ${({ theme }) => rgba(theme.colors.bg.v0, 0.1)};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  white-space: nowrap;
  will-change: transform;
  transition: 0.4s opacity;
  opacity: ${({ shown }) => (shown ? 1 : 0)};
  pointer-events: ${({ shown }) => (shown ? 'all' : 'none')};
  z-index: 9999;
  ${({ placement }) => {
    switch (placement) {
      case 'top':
        return `margin-bottom: ${SPACING}px;`;
      case 'bottom':
        return `margin-top: ${SPACING}px;`;
      case 'left':
        return `margin-right: ${SPACING}px;`;
      case 'right':
        return `margin-left: ${SPACING}px;`;
      default:
        return ``;
    }
  }}
`;

const TooltipArrow = styled.div`
  position: absolute;
  box-shadow: 0px 6px 10px ${({ theme }) => rgba(theme.colors.bg.v0, 0.1)};
  ${({ placement, theme }) => {
    switch (placement) {
      case 'top':
        return `
          bottom: -6px;
          border-top: 6px solid ${theme.colors.bg.v0};
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
        `;
      case 'bottom':
        return `
          top: -6px;
          border-bottom: 6px solid ${theme.colors.bg.v0};
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
        `;
      case 'left':
        return `
          right: -6px;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 6px solid ${theme.colors.bg.v0};
        `;
      case 'right':
        return `
          left: -6px;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-right: 6px solid ${theme.colors.bg.v0};
        `;
      default:
        return ``;
    }
  }}
`;

function WithTooltip({
  title,
  shortcut,
  arrow = true,
  placement = 'bottom',
  strategy = 'fixed',
  children,
  onPointerEnter = () => {},
  onPointerLeave = () => {},
  onFocus = () => {},
  onBlur = () => {},
  ...props
}) {
  const [shown, setShown] = useState(false);

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <Wrapper
            onPointerEnter={(e) => {
              setShown(true);
              onPointerEnter(e);
            }}
            onPointerLeave={(e) => {
              setShown(false);
              onPointerLeave(e);
            }}
            onFocus={(e) => {
              setShown(true);
              onFocus(e);
            }}
            onBlur={(e) => {
              setShown(false);
              onBlur(e);
            }}
            ref={ref}
            {...props}
          >
            {children}
          </Wrapper>
        )}
      </Reference>
      <Popper placement={placement} strategy={strategy}>
        {({ ref, style, arrowProps }) => (
          <Tooltip
            arrow={arrow}
            placement={placement}
            shown={shown}
            ref={ref}
            style={style}
          >
            {shortcut ? `${title} (${prettifyShortcut(shortcut)})` : title}
            <TooltipArrow
              placement={placement}
              ref={arrowProps.ref}
              style={arrowProps.style}
            />
          </Tooltip>
        )}
      </Popper>
    </Manager>
  );
}

WithTooltip.propTypes = {
  title: PropTypes.string,
  shortcut: PropTypes.string,
  arrow: PropTypes.bool,
  placement: PropTypes.string,
  strategy: PropTypes.string,
  onPointerEnter: PropTypes.func,
  onPointerLeave: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default WithTooltip;
