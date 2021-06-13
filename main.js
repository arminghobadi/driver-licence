const puppeteer = require("puppeteer");



(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.on("console.log", co => {
 
    console.log(co.text())})
  
  await retry(page)
  
  await page.goto("https://drivetest.ca/book-a-road-test/");
  await mainScreenHandler(page);
  await infoScreenHandler(page);
  await licenceSelectorHandler(page);
  await locationSelectorHandler(page);
})();

const retry = async (page) => {
  try {
    await page.goto("https://drivetest.ca/book-a-road-test/");
    await mainScreenHandler(page);
    await infoScreenHandler(page);
    await licenceSelectorHandler(page);
    await locationSelectorHandler(page);
  } catch (e) {
    console.log("GOT ERROR:", e, "retrying")
    await retry(page)
  }
}

const locationSelectorHandler = async page => {
  await page.evaluate(async () => {
    const elemById = (id) => {
      return document.getElementById(id)
    }

    const sleep = async (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }

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
  
      if (res.length) {
        console.log("FOUND ON IN ", loc.children[0].innerText)
        // window.alert("found one!!!");
      }
    
    
    
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
          // shouldContinue = false;
          // break;
          console.log("FOUND ONE! in ", loc.children[0].innerText)
        }
    
        // go to next month
        calendarHeader.children[2].click()
        await sleep(1000)
      }
      // if (!shouldContinue) break;
    }
  })
}




const selectOpenSaturdaysHandler = async page => {
  await page.click("#sat-checkbox");
  await page.waitFor(1000);
}


const mainScreenHandler = async (page) => {
  await page.waitForSelector("[title='Book a Road test']", { visible: true });
  await page.evaluate(() => {
    document.querySelector("[title='Book a Road test']").click()
    console.log('aaaa')
  })
  await page.waitForSelector("#emailAddress");
}

const infoScreenHandler = async (page) => {
  await page.evaluate(() => {
    const elemById = (id) => {
      return document.getElementById(id)
    }
    
    const setInputValue = (elemId, value) => {
      const elem = elemById(elemId)
      elem.value = value;
      elem.dispatchEvent(new Event("change"));
    }

    setInputValue("emailAddress", "armin.ghobadi95@gmail.com")
    setInputValue("confirmEmailAddress", "armin.ghobadi95@gmail.com")
    setInputValue("licenceNumber", "G35730600950805")
    setInputValue("licenceExpiryDate", "2022/10/31")
    elemById("regSubmitBtn").click()
  })
  await page.waitForSelector("#G2btn");
}

const licenceSelectorHandler = async (page) => {
  await page.evaluate(() => {
    document.querySelector("#G2btn").click();
    document.querySelector(".booking-submit").click()
  })
  await page.waitForSelector("#sat-checkbox");
}