'use client';
import { jsxs, jsx } from 'react/jsx-runtime';
import dayjs from 'dayjs';
import { createVarsResolver, getSize, factory, useProps, useStyles, UnstyledButton, Box, AccordionChevron } from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';
import { toDateString } from '../../utils/to-date-string/to-date-string.mjs';
import '../DatesProvider/DatesProvider.mjs';
import { useDatesContext } from '../DatesProvider/use-dates-context.mjs';
import classes from './MiniCalendar.module.css.mjs';

const defaultProps = {
  size: "sm",
  numberOfDays: 7,
  monthLabelFormat: "MMM"
};
const varsResolver = createVarsResolver((_theme, { size }) => ({
  root: {
    "--mini-calendar-font-size": getSize(size, "mantine-font-size")
  }
}));
const MiniCalendar = factory((_props, ref) => {
  const props = useProps("MiniCalendar", defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    date,
    defaultDate,
    onDateChange,
    value,
    onChange,
    onNext,
    onPrevious,
    getDayProps,
    numberOfDays,
    size,
    minDate,
    maxDate,
    monthLabelFormat,
    nextControlProps,
    previousControlProps,
    locale,
    ...others
  } = props;
  const getStyles = useStyles({
    name: "MiniCalendar",
    classes,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver
  });
  const ctx = useDatesContext();
  const _locale = ctx.getLocale(locale);
  const [_date, setDate] = useUncontrolled({
    value: toDateString(date),
    defaultValue: toDateString(defaultDate),
    finalValue: toDateString(value) || dayjs().format("YYYY-MM-DD"),
    onChange: onDateChange
  });
  const handleNext = () => {
    onNext?.();
    const nextDate = dayjs(_date).add(numberOfDays, "days");
    setDate(toDateString(nextDate));
  };
  const handlePrevious = () => {
    onPrevious?.();
    const previousDate = dayjs(_date).subtract(numberOfDays, "days");
    setDate(toDateString(previousDate));
  };
  const previousDisabled = minDate ? dayjs(_date).subtract(1, "days").isBefore(dayjs(minDate)) : false;
  const nextDisabled = maxDate ? dayjs(_date).add(numberOfDays, "days").isAfter(dayjs(maxDate)) : false;
  const range = Array(numberOfDays).fill(0).map((_, index) => dayjs(_date).add(index, "days")).map((date2) => {
    const disabled = minDate && date2.isBefore(dayjs(minDate), "day") || maxDate && date2.isAfter(dayjs(maxDate), "day") || false;
    const dayProps = getDayProps?.(toDateString(date2));
    return /* @__PURE__ */ jsxs(
      UnstyledButton,
      {
        disabled,
        "aria-label": date2.format("YYYY-MM-DD"),
        "data-disabled": disabled || void 0,
        "data-selected": value && dayjs(date2).isSame(value, "day") ? true : void 0,
        ...dayProps,
        onClick: (event) => {
          dayProps?.onClick?.(event);
          onChange?.(toDateString(date2));
        },
        ...getStyles("day", {
          active: !disabled,
          className: dayProps?.className,
          style: dayProps?.style
        }),
        children: [
          /* @__PURE__ */ jsx("span", { ...getStyles("dayMonth"), children: date2.locale(_locale).format(monthLabelFormat) }),
          /* @__PURE__ */ jsx("span", { ...getStyles("dayNumber"), children: date2.date() })
        ]
      },
      date2.toString()
    );
  });
  return /* @__PURE__ */ jsxs(Box, { ref, size, ...getStyles("root"), ...others, children: [
    /* @__PURE__ */ jsx(
      UnstyledButton,
      {
        size,
        onClick: handlePrevious,
        disabled: previousDisabled,
        "data-disabled": previousDisabled || void 0,
        "data-direction": "previous",
        ...previousControlProps,
        ...getStyles("control", {
          active: !previousDisabled,
          className: previousControlProps?.className,
          style: previousControlProps?.style
        }),
        children: previousControlProps?.children || /* @__PURE__ */ jsx(AccordionChevron, { "data-chevron": true, size })
      }
    ),
    /* @__PURE__ */ jsx("div", { ...getStyles("days"), children: range }),
    /* @__PURE__ */ jsx(
      UnstyledButton,
      {
        size,
        onClick: handleNext,
        disabled: nextDisabled,
        "data-disabled": nextDisabled || void 0,
        "data-direction": "next",
        ...nextControlProps,
        ...getStyles("control", {
          active: !nextDisabled,
          className: nextControlProps?.className,
          style: nextControlProps?.style
        }),
        children: nextControlProps?.children || /* @__PURE__ */ jsx(AccordionChevron, { "data-chevron": true, size })
      }
    )
  ] });
});
MiniCalendar.displayName = "@mantine/dates/MiniCalendar";
MiniCalendar.classes = classes;

export { MiniCalendar };
//# sourceMappingURL=MiniCalendar.mjs.map
