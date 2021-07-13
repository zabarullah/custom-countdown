const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const countdownEl = document.getElementById('countdown');
const second = 1000; // 1 second is 1000 miliseconds
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;


// Set Date Input minimum with todays date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// Populate Countdown / Complete UI
function updateDOM() {
countdownActive = setInterval(() => { // setInterval method is designed to work every defined intervals within a function see: https://www.w3schools.com/js/js_timing.asp  Since time moves forward so the countdown naturally will update every seconds as  per the 1000 miliseconds setting selected using second at the end of method.
    const now = new Date().getTime(); //gets the time now in miliseconds
    const distance = countdownValue - now; // provides countdown time distance (or duration rather) in miliseconds
 // console.log('distance:', distance);
    const days = Math.floor(distance / day); // Math.floor returns whole numbers only
    const hours = Math.floor((distance % day) / hour); // the % will return remainder value that would not have been in above line then divide by hours to give time in hours
    const minutes = Math.floor((distance % hour) / minute); // similar as above line
    const seconds = Math.floor((distance % minute) / second); // "                "
 // console.log(days, hours, minutes, seconds);
    
    // Hide Input container 
    inputContainer.hidden = true; 

    // if the countdown has ended, show complete
    if(distance < 0) {
        countdownEl.hidden = true;
        clearInterval(countdownActive);
        completeElInfo.textContent = `${countdownTitle} finnished on ${countdownDate}`;
        completeEl.hidden = false;
    } else {
        // else show the countdown in progress
        countdownElTitle.textContent = `${countdownTitle}`;
        timeElements[0].textContent = `${days}`;
        timeElements[1].textContent = `${hours}`;
        timeElements[2].textContent = `${minutes}`;
        timeElements[3].textContent = `${seconds}`; 
           // Hide Complete container 
        completeEl.hidden = true;
            // Show Countdown
        countdownEl.hidden = false;
    }

}, second);
    
}

// Take values from form Input
function updateCountdown(e) {
    e.preventDefault(); // prevents the form from refreshing the page which gets rid of the data, since usually it would be sent to a db.
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = { // object created to save date and title to the cache.
        title: countdownTitle,
        date: countdownDate,
    };
// console.log(savedCountdown);
    localStorage.setItem('countdown', JSON.stringify(savedCountdown)); // saves the object data to local storage. we must pass javascript objects with JSON.strigify to convert to string to it shows in console application tap within storage. All servers store objects in string form thus the ue of JSON.stringify method. Opposite of this is the JSON.parse method to reverse this process. Note the Key countdown will be used to parse this later in the function restorePreviousCountdown()
//  console.log(countdownTitle, countdownDate);
    // check for valid date - if date is missed or not when submitting form
    if (countdownDate === '') {
        alert('Please select a date for the countdown.') // if no date is inputted then the alert will execute and updateDom function will not run 
    } else {
            // Get number version of current Date, updateDOM
    countdownValue = new Date(countdownDate).getTime();
    //  console.log('Countdown value:', countdownValue);
        updateDOM();
    }
}

//Reset all values
function reset() {
  // Hide Countdowns/complete, show Input
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;

  // stop the coundown
  clearInterval(countdownActive);
  //Reset the values for the countdowntitle
  countdownTitle = ''; // empty i.e. reset
  countdownDate = ''; // empty
  localStorage.removeItem('countdown');

}

function restorePreviousCountdown () {
    // get dont down from local storage if available
    if (localStorage.getItem('countdown')) { // if there is key countdown then run the following
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown')); // must used JSON.parse() method to unstrigify the data from server and return it  
        countdownTitle = savedCountdown.title; // assigning or restoring title and in the next line the date from local storage
        countdownDate = savedCountdown.date;
        // Get number version of current Date, updateDOM
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();

    }
}
// Event Listener
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// on load, check local storage first
restorePreviousCountdown();