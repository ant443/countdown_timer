(function countdownTimer(){
  "use strict";

  const timerButton = document.getElementById("timerButton");

  timerButton.onclick = function countDownTimer() {

    function getPositiveNumFromUser(text) {
      let usersNum = Number(prompt(text));
      return usersNum > 0 ? usersNum : 0;
    }

    function calcCountdownEndDate(hours, mins) {
      let today = new Date();
      today.setHours(today.getHours()+hours);
      today.setMinutes(today.getMinutes()+mins);
      return today
    }

    function getDurationAndCalcEndDate() {
      const hours = getPositiveNumFromUser("enter hours");
      const mins = getPositiveNumFromUser("enter minutes");
      if (hours + mins === 0) {return 0};
      return calcCountdownEndDate(hours, mins)
    }

    function reset() {
      timerText.style.color = "black";
      timerText.textContent = "Countdown Timer";
      timerButton.onclick = countDownTimer;
      timerButton.textContent = "Activate timer";
      endAudio.pause(); 
      clearInterval(timer);
    }

    let endDateTime = getDurationAndCalcEndDate()
    if (!endDateTime) {return}
    const timerText = document.getElementById("timerText");
    const endAudio = document.querySelector("audio");
    let alarmSeconds = 5;

    timerButton.onclick = function() {
      reset();
    }

    timerButton.textContent = "Stop timer";

    const timer = setInterval(function() {

      function convertToLargerUnits(miliseconds) {
        const days = Math.floor((miliseconds / 1000 / 60 / 60 / 24));
        const hours = Math.floor((miliseconds / 1000 / 60 / 60) % 24);
        const minutes = Math.floor((miliseconds / 1000 / 60) % 60);
        const seconds = Math.floor((miliseconds / 1000) % 60);
        return [days, hours, minutes, seconds]
      }

      function alternateElementColor(element) {
        element.style.color = element.style.color !== "red" ? "red" : "black";
      }

      function resetAndPlayAudioClip(audioElement) {
        audioElement.currentTime = 0;
        audioElement.play();
      }

      function runAlarmSequenceThenReset(textElement, audioElement, Duration) {
        alternateElementColor(textElement);
        resetAndPlayAudioClip(audioElement);
        Duration -= 1;
        if (Duration <= 0) {
          reset()
        }
        return Duration
      }

      function updateDisplayedTime(daysHoursMinsSecsArray) {
        let days, hours, minutes, seconds
        [days, hours, minutes, seconds] = daysHoursMinsSecsArray
        return days + "d " + hours + "h " + minutes + "m " + seconds + "s";
      }

      let timeLeft = endDateTime - new Date();
      if (timeLeft < 0) {
        alarmSeconds = runAlarmSequenceThenReset(timerText, endAudio, 
                                                 alarmSeconds);
      } else {
        timerText.textContent = updateDisplayedTime(
                               convertToLargerUnits(timeLeft));
      }

    }, 1000);
  }

})();

// TODO:
// pause function
// better user input functionality(e.g. two text input forms)