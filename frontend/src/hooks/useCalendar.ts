import { useState } from 'react';
import { isEqual, } from 'date-fns';
import { DateRange, type ActiveModifiers } from 'react-day-picker';
//DEPRECATED
export const useCalendar = () => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>()
  const [isUserSelectingRange, setUserSelectingRange] = useState<boolean>(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>();

  const handleDayClick = (selectedDayFromCalendar: Date) => {
    if (!isUserSelectingRange) {
      setSelectedRange(undefined)
      if (selectedDay != undefined && isEqual(selectedDayFromCalendar, selectedDay)) {
        setSelectedDay(undefined)
      } else {

        setSelectedDay(selectedDayFromCalendar);
      }
    }
  };

  const handleDayClickKeyUp = (selectedDay: Date, _a: ActiveModifiers, e: React.KeyboardEvent) => {
    if (e.key == 'Shift' && isUserSelectingRange && selectedRange?.from !== undefined) {
      setSelectedRange({ from: selectedRange.from, to: selectedDay })
      setUserSelectingRange(false)
      if (isEqual(selectedRange?.from, selectedDay)) {
        setSelectedRange(undefined)
      }
      setSelectedDay(undefined)
    }
  };

  const handleDayClickKeyDown = (selectedDay: Date, _activeModifiers: ActiveModifiers, e: React.KeyboardEvent) => {
    if (e.key == 'Shift') {
      if (selectedRange?.from === undefined) {
        //TODO:Maybe just create a temp var and onKeyUp update the state 
        setSelectedRange({ from: selectedDay, to: undefined });
        setUserSelectingRange(true)
      }
      if (selectedRange?.from !== undefined && selectedRange?.to !== undefined) {
        setSelectedRange(undefined)
      }
    }
  }
  const resetSelection = () => {
    setSelectedDay(undefined);
    setSelectedRange(undefined);
  };

  return {
    selectedDay,
    handleDayClick,
    handleDayClickKeyUp,
    handleDayClickKeyDown,
    selectedRange,
    setSelectedRange,
    setSelectedDay,
    resetSelection
  };
};
