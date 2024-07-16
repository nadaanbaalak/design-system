import * as React from 'react';
import classNames from 'classnames';
import Icon from '@/components/atoms/icon';
import Text from '@/components/atoms/text';
import { Name } from '../chip/Chip';
import { BaseProps, extractBaseProps } from '@/utils/types';
import { IconProps, TextProps } from '@/index.type';
import { Tooltip } from '@/index';
import { IconType } from '@/common.type';

export interface GenericChipProps extends BaseProps {
  label: string | React.ReactElement;
  labelPrefix?: string;
  icon?: string;
  clearButton?: boolean;
  disabled?: boolean;
  selected?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  iconType?: IconType;
  name: Name;
  maxWidth: string | number;
}

export const GenericChip = (props: GenericChipProps) => {
  const { label, icon, clearButton, disabled, className, selected, onClose, onClick, labelPrefix, iconType, maxWidth } =
    props;
  const wrapperStyle = { maxWidth: maxWidth };
  const [isTextTruncated, setIsTextTruncated] = React.useState(false);
  const { detectTruncation } = Tooltip.useAutoTooltip();
  const contentRef = React.createRef<HTMLDivElement>();

  React.useEffect(() => {
    const isTruncated = detectTruncation(contentRef);
    setIsTextTruncated(isTruncated);
  }, [contentRef]);

  const baseProps = extractBaseProps(props);

  const iconClass = (align: string) =>
    classNames({
      ['Chip-icon']: true,
      [`Chip-icon--${align}`]: align,
      [`Chip-icon-disabled--right`]: align === 'right' && disabled,
      ['cursor-pointer']: align === 'right' && !disabled,
      ['Chip-icon--selected']: align === 'right' && selected,
    });

  const onCloseHandler = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (onClose) onClose();
  };

  const onClickHandler = () => {
    if (onClick) onClick();
  };

  const onKeyDownHandler = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onCloseHandler(event);
    }
  };

  const onChipKeyDownHandler = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onClickHandler();
    }
  };

  const iconAppearance = (align: string) =>
    classNames({
      ['primary_dark']: selected,
      ['subtle']: !selected && align === 'right',
      ['inverse']: !selected && align === 'left',
    }) as IconProps['appearance'];

  const textColor = classNames({
    ['primary-dark']: selected,
    ['inverse']: !disabled && !selected,
  }) as TextProps['color'];

  const renderLabel = () => {
    if (typeof label === 'string') {
      return (
        <div className="Chip-text--truncate" ref={contentRef}>
          {labelPrefix && (
            <Text
              data-test="DesignSystem-GenericChip--LabelPrefix"
              weight="medium"
              color={textColor}
              className="Chip-text mr-3"
            >
              {labelPrefix}
            </Text>
          )}
          <Text data-test="DesignSystem-GenericChip--Text" color={textColor} className="Chip-text">
            {label}
          </Text>
        </div>
      );
    }
    return label;
  };

  const getTooltipText = () => {
    const labelText = typeof label === 'string' ? label : '';

    if (labelPrefix) {
      return `${labelPrefix} ${labelText}`;
    }
    return labelText;
  };

  return (
    <div className="d-inline-flex">
      <Tooltip showTooltip={isTextTruncated} data-test="DesignSystem-GenericChip--Tooltip" tooltip={getTooltipText()}>
        <div
          tabIndex={disabled ? -1 : 0}
          style={wrapperStyle}
          data-test="DesignSystem-GenericChip--Wrapper"
          role="button"
          onKeyDown={onChipKeyDownHandler}
          {...baseProps}
          className={`Chip-wrapper ${className}`}
          onClick={onClickHandler}
        >
          {icon && (
            <Icon
              data-test="DesignSystem-GenericChip--Icon"
              name={icon}
              type={iconType}
              appearance={iconAppearance('left')}
              className={iconClass('left')}
            />
          )}
          {renderLabel()}
          {clearButton && (
            <div
              role="button"
              onClick={onCloseHandler}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={onKeyDownHandler}
              className={iconClass('right')}
              data-test="DesignSystem-GenericChip--clearButton"
            >
              <Icon name="clear" appearance={iconAppearance('right')} className="p-2" />
            </div>
          )}
        </div>
      </Tooltip>
    </div>
  );
};

GenericChip.displayName = 'GenericChip';
GenericChip.defaultProps = {
  maxWidth: 'var(--spacing-9)',
};

export default GenericChip;
