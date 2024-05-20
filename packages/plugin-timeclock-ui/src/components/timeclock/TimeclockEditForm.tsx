import { ControlLabel, FormControl } from "@erxes/ui/src/components/form";
import {
  CustomRangeContainer,
  FlexCenter,
  FlexColumn,
  FlexRow,
  FlexRowEven,
} from "../../styles";
import React, { useState } from "react";

import { Alert } from "@erxes/ui/src/utils";
import Button from "@erxes/ui/src/components/Button";
import DateControl from "@erxes/ui/src/components/form/DateControl";
import Dialog from "@erxes/ui/src/components/Dialog";

type Props = {
  timeclock: any;
  timeclockEdit: (values: any) => void;
  setShowModal: (value: boolean) => void;
  showModal: boolean;
};

const TimeclockEditForm = ({
  timeclock,
  timeclockEdit,
  showModal,
  setShowModal,
}: Props) => {
  const [show, setShow] = useState(showModal);

  const [shiftStartInsert, setShiftStartInsert] = useState(
    timeclock.shiftStart
  );

  const [shiftEndInsert, setShiftEndInsert] = useState(
    timeclock.shiftEnd || timeclock.shiftStart
  );

  const [shiftEnded, setShiftEnded] = useState(!timeclock.shiftActive);

  const onShiftStartInsertChange = (date) => {
    setShiftStartInsert(date);
  };

  const onShiftEndInsertChange = (date) => {
    setShiftEndInsert(date);
  };

  const toggleShiftActive = (e) => {
    setShiftEnded(e.target.checked);
  };

  const editTimeClock = () => {
    const values = generateDoc();

    if (checkInput()) {
      timeclockEdit(values);
      setShow(false);
    }
  };

  const generateDoc = () => {
    checkInput();

    let outDeviceType;
    let inDeviceType;

    if (shiftStartInsert !== timeclock.shiftStart) {
      inDeviceType = "edit";
    }

    if (!shiftEnded) {
      return {
        _id: timeclock._id,
        shiftStart: shiftStartInsert,
        shiftActive: true,
        inDeviceType,
      };
    }

    if (shiftEndInsert !== timeclock.shiftEnd) {
      outDeviceType = "edit";
    }

    return {
      _id: timeclock._id,
      shiftStart: shiftStartInsert,
      shiftEnd: shiftEndInsert,
      shiftActive: false,
      inDeviceType,
      outDeviceType,
    };
  };

  const checkInput = () => {
    if (
      shiftEnded &&
      shiftStartInsert &&
      shiftEndInsert &&
      new Date(shiftEndInsert).getTime() < new Date(shiftStartInsert).getTime()
    ) {
      Alert.error("Shift end can not be sooner than shift start");
      return false;
    }

    return true;
  };

  return (
    <Dialog
      show={show}
      closeModal={() => setShowModal(false)}
      title="Edit Timeclock"
    >
      <FlexColumn $marginNum={20}>
        <FlexRow>
          <ControlLabel>In Device</ControlLabel>
          <ControlLabel>Location</ControlLabel>
        </FlexRow>
        <FlexRow>
          <div>{timeclock.inDeviceType}</div>
          <div>{timeclock.inDevice}</div>
        </FlexRow>

        <FlexRow>
          <ControlLabel>Out Device</ControlLabel>
          <ControlLabel>Location</ControlLabel>
        </FlexRow>
        <FlexRow>
          <div>{timeclock.outDeviceType}</div>
          <div>{timeclock.outDevice}</div>
        </FlexRow>

        <FlexRow>
          <ControlLabel>Shift Ended</ControlLabel>
          <FlexRowEven>
            <FormControl
              name="shiftActive"
              defaultChecked={shiftEnded}
              componentclass="checkbox"
              onChange={toggleShiftActive}
            />
            <div>Ended</div>
          </FlexRowEven>
        </FlexRow>
        <CustomRangeContainer>
          <DateControl
            value={shiftStartInsert}
            name="startDate"
            placeholder={"Starting date"}
            dateFormat={"YYYY-MM-DD"}
            timeFormat={"HH:mm"}
            onChange={onShiftStartInsertChange}
          />
        </CustomRangeContainer>

        {shiftEnded && (
          <>
            <ControlLabel>Shift End</ControlLabel>

            <CustomRangeContainer>
              <DateControl
                value={shiftEndInsert}
                name="startDate"
                placeholder={"Starting date"}
                dateFormat={"YYYY-MM-DD"}
                timeFormat={"HH:mm"}
                onChange={onShiftEndInsertChange}
              />
            </CustomRangeContainer>
          </>
        )}
        <FlexCenter>
          <Button btnStyle="primary" onClick={editTimeClock}>
            Save
          </Button>
        </FlexCenter>
      </FlexColumn>
    </Dialog>
  );
};

export default TimeclockEditForm;
