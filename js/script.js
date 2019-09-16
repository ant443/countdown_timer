(function () {
  "use strict";

  const timerButton = document.getElementById("timer-button");

  timerButton.onclick = function countDownTimer(e) {

    function getPositiveIntFromUser(element) {
      const usersNum = element.valueAsNumber;
      return usersNum > 0 ? parseInt(usersNum) : 0;
    }

    function getDuration(nodeList) {
      const days = getPositiveIntFromUser(nodeList[0]);
      const hours = getPositiveIntFromUser(nodeList[1]);
      const minutes = getPositiveIntFromUser(nodeList[2]);
      const seconds = getPositiveIntFromUser(nodeList[3]);
      return {
        "days": days, "hours": hours, "minutes": minutes, "seconds": seconds
      }
    }

    function calcEndDate(totalTime) {
      const today = new Date();
      today.setHours(today.getHours() + totalTime.hours + (totalTime.days * 24));
      today.setMinutes(today.getMinutes() + totalTime.minutes);
      today.setSeconds(today.getSeconds() + totalTime.seconds);
      return today
    }

    function resetTimer() {
      timerText.style.color = "black";
      timerText.textContent = "Countdown Timer";
      timerButton.onclick = countDownTimer;
      timerButton.textContent = "Activate timer";
      resetAudioClip(alarmAudio);
      clearInterval(timer);
      clearInterval(timerNegative);
      durationText.textContent += " stopped";
      if (typeof (millisecondsLeft) !== "undefined") {
        const readableTimeLeft = toReadableTime(toUnits(millisecondsLeft));
        const runTime = toMilliseconds(duration) - millisecondsLeft;
        const readableRunTime = toReadableTime(toUnits(runTime));
        durationText.textContent += ` with ${readableTimeLeft} left. ` +
          `\nTimer ran for ${readableRunTime} total`;
      }
    }

    function toUnits(milliseconds) {
      const floorOrCeil = milliseconds > 0 ? "floor" : "ceil";
      const days = Math[floorOrCeil]((milliseconds / 1000 / 60 / 60 / 24));
      const hours = Math[floorOrCeil]((milliseconds / 1000 / 60 / 60) % 24);
      const minutes = Math[floorOrCeil]((milliseconds / 1000 / 60) % 60);
      const seconds = Math[floorOrCeil]((milliseconds / 1000) % 60);
      return { "days": days, "hours": hours, "minutes": minutes, "seconds": seconds }
    }

    function toMilliseconds(units) {
      const days = units.days * 24 * 60 * 60 * 1000;
      const hours = units.hours * 60 * 60 * 1000;
      const minutes = units.minutes * 60 * 1000;
      const seconds = units.seconds * 1000;
      return days + hours + minutes + seconds;
    }

    function toggleColor(element) {
      element.style.color = element.style.color !== "red" ? "red" : "black";
    }

    function playAudioClip(audioElement) {
      audioElement.currentTime = 0;
      audioElement.play();
    }

    function resetAudioClip(audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }

    function runAlarmSequence(textElement, audioElement, Duration) {
      toggleColor(textElement);
      playAudioClip(audioElement);
      Duration -= 1;
      if (Duration <= 0) {
        resetAudioClip(audioElement);
        clearInterval(timer);
        textElement.style.color = "red";
      }
      return Duration
    }

    function toReadableTime(timeInUnits) {
      let display = "";
      if (timeInUnits.days) { display += timeInUnits.days + "d " }
      if (timeInUnits.hours) { display += timeInUnits.hours + "h " }
      if (timeInUnits.minutes) { display += timeInUnits.minutes + "m " }
      if (timeInUnits.seconds) { display += timeInUnits.seconds + "s"; }
      return display ? display : "0s";
    }

    const timerRoot = document.getElementById("timer");
    const timerText = timerRoot.querySelector(".timer__text");
    const durationText = timerRoot.querySelector(".timer__info");
    const timeInputs = timerRoot.querySelectorAll("input");
    const alarmAudio = timerRoot.querySelector("audio");
    const timerButton = e.target;
    const alarmSeconds = 6;
    let alarmCounter = alarmSeconds;
    let millisecondsLeft;

    const duration = getDuration(timeInputs);
    const endDateTime = calcEndDate(duration)

    timerButton.onclick = function () {
      resetTimer();
    }

    durationText.textContent = ` ${toReadableTime(duration)} timer`;
    timerButton.textContent = "Stop timer";

    const timer = setInterval(function () {
      millisecondsLeft = endDateTime - new Date();
      timerText.textContent = toReadableTime(toUnits(millisecondsLeft));
      if (millisecondsLeft <= 500) {
        alarmCounter = runAlarmSequence(timerText, alarmAudio, alarmCounter);
      }
    }, 1000);

    const timerNegative = setInterval(function () {
      millisecondsLeft = endDateTime - new Date();
      timerText.textContent = toReadableTime(toUnits(millisecondsLeft));
    }, 1000);
  }
})();