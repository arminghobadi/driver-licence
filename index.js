// go to website: https://drivetest.ca/book-a-road-test/booking.html#/validate-driver-email
try {

  const elemById = (id) => {
    return document.getElementById(id)
  }
  
  const setInputValue = (elemId, value) => {
    const elem = elemById(elemId)
    elem.value = value;
    elem.dispatchEvent(new Event("change"));
  }
  
  const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  
  // find input type email id emailAddress
  
  setInputValue("emailAddress", "armin.ghobadi95@gmail.com")
  
  // find input type email id confirmEmailAddress
  
  setInputValue("confirmEmailAddress", "armin.ghobadi95@gmail.com")
  
  // find Driver licens number input type text id licenceNumber
  
  setInputValue("licenceNumber", "G35730600950805")
  
  // find expiry (yyyy/mm/dd) id licenceExpiryDate
  
  setInputValue("licenceExpiryDate", "2022/10/31")
  
  // click submit id regSubmitBtn
  
  elemById("regSubmitBtn").click()
  
  while (window.location.href !== "https://drivetest.ca/book-a-road-test/booking.html#/licence") {
    await sleep(100)
  }
  
  await sleep(3000)
  
  
  
  // next page (https://drivetest.ca/book-a-road-test/booking.html#/licence)
  
  // click on G2 id G2btn
  elemById("G2btn").click();
  
  // click on continue
  Array.from(document.getElementsByTagName("button")).filter(i => Array.from(i.classList).includes("booking-submit"))[0].click()
  
  while (window.location.href !== "https://drivetest.ca/book-a-road-test/booking.html#/location") {
    await sleep(100)
  }
  
  await sleep(3000)
  // next page (https://drivetest.ca/book-a-road-test/booking.html#/location)
  
  
  // iterate over all locations
  
  for (let i = 0 ; i < 25 ; i++) {
    // click on open saturdays id sat-checkbox
    const checkbox = elemById("sat-checkbox");
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change"));
  
    await sleep(3000)
    const locationListUL = document.getElementById("9555").parentElement
    const allLocations = Array.from(locationListUL.children).map(i => i.children[0]).filter(i => !Array.from(i.parentElement.classList).find(i => i === "ng-hide"))
  
  
    let loc = allLocations[i];
    // bring location into view
    loc.scrollIntoView();
    window.scrollTo(0, 500);
    // select the location
    loc.click()
    console.log("checking ", loc.children[0].innerText)
    await sleep(3000)
    // click on continue
    Array.from(document.getElementsByTagName("button")).find(i => Array.from(i.classList).includes("booking-submit")).click()
    // wait for some time
    await sleep(2000)
  
  
    const armin = Array.from(document.getElementsByTagName("td"))
    const res = armin.filter(cell => !Array.from(cell.children[0].children[0].children[0].classList).includes("disabled") &&  !Array.from(cell.children[0].children[0].children[0].classList).includes("blank-cell"))

    // just for me to see it! DELETE ME
    await sleep(2000)

    if (res.length) window.alert("found one!!!");
  
  
  
    const calendarHeader = Array.from(document.getElementsByTagName("a")).filter(i => i.title === "next month")[0].parentElement
    const maxMonth = "AUGUST"
    let shouldContinue = true;
    while(!calendarHeader.children[1].innerText.includes(maxMonth)) {
      // see available spots for the month
  
      const armin = Array.from(document.getElementsByTagName("td"))
      const res = armin.filter(cell => !Array.from(cell.children[0].children[0].children[0].classList).includes("disabled") &&  !Array.from(cell.children[0].children[0].children[0].classList).includes("blank-cell"))
  
      // just for me to see it! DELETE ME
      await sleep(1000)
      
      if (res.length) {
        // window.alert("found one!!!");
        shouldContinue = false;
        break;
      }
  
      // go to next month
      calendarHeader.children[2].click()
      await sleep(1000)
    }
    if (!shouldContinue) break;
  }
  
} catch (e) {
  debugger
}