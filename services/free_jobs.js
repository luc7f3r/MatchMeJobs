require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss.l) :label' 
} );
const puppeteer = require('puppeteer');
const {setTimeout} = require("node:timers/promises");
const { url } = require('node:inspector');


async function getFreeJobs(category, level){
    const experienceRange = {
        "Intern": "1",
        "Entry-Level": "2",
        "Associate": "3",
        "Senior": "4",
        "Director": "5",
        "Executive": "6",
      };
    const numericExperienceRange = experienceRange[level];
    console.log(`Experience Number :${numericExperienceRange} and Category : ${category}`);
    const browser = await puppeteer.launch({
        headless: true,
        // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Update this path
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try{
    const page = await browser.newPage();

    const url = `https://www.linkedin.com/jobs/search/?keywords=${category}&location=India&f_TPR=r86400&f_WT=1%2C2%2C3&f_E=${numericExperienceRange}&f_JT=F`;

    await waitForSelectorWithRetry(page, url,".jobs-search__results-list", 10000, 5);

    // Add an additional wait time to ensure all jobs are loaded
    await setTimeout(8000);
    const jobListings = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.base-search-card')).map(job => {
            const jobTitleElement = job.querySelector('h3.base-search-card__title');
            const jobLinkElement = job.querySelector('a.base-card__full-link');
            const jobCompany = job.querySelector('h4.base-search-card__subtitle');
            const jobTime = job.querySelector('time');
            
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
            await page.goto(url);
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

module.exports = {getFreeJobs}