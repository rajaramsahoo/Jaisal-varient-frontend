import React, { Fragment } from "react";
import Countdown from "react-countdown";

const CountdownComponent = ({ time }) => {
  const Completionist = () => <span>You are good to go!</span>;

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <div className="timer-box">
          <div className="timer">
            <div className="timer-p" id="demo">
              <span>
                {days}
                <span className="padding-l">:</span>
                <span className="timer-cal">Day</span>
              </span>
              <span>
                {hours}
                <span className="padding-l">:</span>
                <span className="timer-cal">Hrs</span>
              </span>
              <span>
                {minutes}
                <span className="padding-l">:</span>
                <span className="timer-cal">Min</span>
              </span>
              <span>
                {seconds}
                <span className="timer-cal">Sec</span>
              </span>
            </div>
          </div>
        </div>
      );
    }
  };

  // Parse the time prop to a Date object
  const countdownDate = new Date(time).getTime();

  return (
    <Fragment>
      <Countdown date={countdownDate} renderer={renderer} />
    </Fragment>
  );
};

export default CountdownComponent;
