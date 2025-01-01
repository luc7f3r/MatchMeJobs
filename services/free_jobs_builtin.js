require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss.l) :label' 
} );
const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const {setTimeout} = require("node:timers/promises");
const { url } = require('node:inspector');
puppeteer.use(require('puppeteer-extra-plugin-stealth')());

async function getFreeJobsBuiltin(category, level){
    const experienceRange = {
        "Intern": "internship",
        "Entry-Level": "entry-level",
        "Associate": "junior",
        "Senior": "mid-level",
        "Director": "senior",
        "Executive": "expert-leader",
      };
    const wordExperienceRange = experienceRange[level];
    console.log(`Builtin : Experience Number :${wordExperienceRange} and Category : ${category}`);
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Update this path
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try{
    const page = await browser.newPage();
    category = category.split(" ").join("+");
    const url = `https://builtin.com/jobs/remote/hybrid/office/${wordExperienceRange}?search=${category}&country=IND`;

    await waitForSelectorWithRetry(page, url,"div#search-results-top", 30000, 5);

    // Add an additional wait time to ensure all jobs are loaded
    await setTimeout(8000);
    const jobListings = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('div#main.row')).map(job => {
            const jobTitleElement = job.querySelector('a.card-alias-after-overlay.hover-underline');
            const jobLinkElement = job.querySelector('a.card-alias-after-overlay.hover-underline');
            const jobCompany = job.querySelector('div.font-barlow.fs-md.fs-xl-xl.d-inline-block.m-0.hover-underline');
            const jobTime = job.querySelector('span.font-barlow.text-gray-03');
            
            return {
                title: jobTitleElement ? jobTitleElement.innerText.trim() : "NA",
                link: jobLinkElement ? jobLinkElement.href : null,
                company: jobCompany ? jobCompany.innerText.trim() : "NA",
                time : jobTime ? jobTime.textContent.trim() : "NA",
            };
        }).filter(job => job.title && job.link && job.company);
    });

    // Close the browser
    await browser.close();
    console.log("Got the jobs of builtin");
    return jobListings;
    }
    catch(error){
        await browser.close();
        console.error("Error occured in free_jobs service \n", error );
        return 0;
    }
}

async function waitForSelectorWithRetry(page, url,selector, retryInterval, maxRetries) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            console.log(`Selector Retries: ${retries}`);
            await page.goto(url,{ waitUntil: 'networkidle2', timeout: 0 });
            await page.waitForSelector(selector, { timeout: 6000 });
            console.log(`Selector found: ${selector}`);
            return; 
        } catch (error) {
            console.log(`Selector not found: ${selector}. Retrying in ${retryInterval / 1000} seconds...`);
            retries++;
            console.log('Came to catch and retries till now :',retries);
            if (retries === maxRetries) {
                throw new Error(`Max retries reached. Could not find selector: ${selector}`);
            }
            await setTimeout(retryInterval);
            // await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

module.exports = {getFreeJobsBuiltin}