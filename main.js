const puppeteer = require("puppeteer");

// document.querySelectorAll('ul.row')[0].children[3].children[0].click();

let numRetries = 0;

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 800 });
  page.on("console", co => {
    if  (co.type() === "log") console.log(co.text())
  })
  
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
    // await locationSelectorHandler(page);
  } catch (e) {
    console.log("GOT ERROR:", e, "retrying")
    if (numRetries++ > 100) return
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

    for (let i = 0 ; i < 26 ; i++) {
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
        for ( let a = 0 ; a < res.length ; a++) {
          await res[a].children[0].children[0].children[0].children[0].click()
          await document.querySelectorAll(".booking-submit")[1].click()
          await sleep(2000)
          if (document.querySelectorAll('ul.row')[0]) {
            console.log(">>>>>>>>>> FOUND A REAL ONE IN ", loc.children[0].innerText)
            await sleep(10000000)
          }
          else {
            console.log("found fake in ", loc.children[0].innerText)
            await page.screenshot()
          }
        }
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
          for ( let a = 0 ; a < res.length ; a++) {
            await res[a].children[0].children[0].children[0].children[0].click()
            await document.querySelectorAll(".booking-submit")[1].click()
            await sleep(2000)
            if (document.querySelectorAll('ul.row')[0]) {
              console.log(">>>>>>>>>> FOUND A REAL ONE IN ", loc.children[0].innerText)
              await sleep(10000000)
            }
            else {
              console.log("found fake in ", loc.children[0].innerText)
              await page.screenshot()
            }
          }
          
          
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

    setInputValue("emailAddress", "ghazaleh.heravi@gmail.com")
    setInputValue("confirmEmailAddress", "ghazaleh.heravi@gmail.com")
    setInputValue("licenceNumber", "H26512820935304")
    setInputValue("licenceExpiryDate", "2026/01/11") // YYYY/MM/DD
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