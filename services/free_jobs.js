const puppeteer = require('puppeteer');
const {setTimeout} = require("node:timers/promises");
const { url } = require('node:inspector');

async function getFreeJobs(req,res){

const {keywords} = req.body;
    console.log("Going ahead with keywords:",keywords);


    try{
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Update this path
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Construct the LinkedIn job search URL with time constraints (past week) and Easy Apply
    const url = `https://www.linkedin.com/jobs/search/?keywords=${keywords}&location=India&location=India&f_TPR=r86400&f_E=4&f_WT=1&f_JT=F`;
    console.log(url);
    // await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

    await waitForSelectorWithRetry(page, url,".jobs-search__results-list", 10000, 5);
    // await page.waitForSelector('.jobs-search__results-list', { timeout: 60000 });

    // Scroll down to load more jobs if needed
    // await autoScroll(page);

    // Add an additional wait time to ensure all jobs are loaded
    await setTimeout(8000);// Wait for 5 seconds

    // Extract job links and titles
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

    // Print the results
    // console.log(`Found ${jobListings.length} job(s):`, jobListings);

    // Close the browser
    await browser.close();
    return jobListings;
    }
    catch(error){
        console.error("Error occured in free_jobs service \n", error );
        return error;
    }
}

async function waitForSelectorWithRetry(page, url,selector, retryInterval, maxRetries) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            // Try to wait for the selector to appear
            console.log(`${retries}`);
            await page.goto(url);
            await page.waitForSelector(selector, { timeout: 6000 });
            console.log(`Selector found: ${selector}`);
            return; // Exit the function if the selector is found
        } catch (error) {
            console.log(`Selector not found: ${selector}. Retrying in ${retryInterval / 1000} seconds...`);
            retries++;
            console.log(retries);
            if (retries === maxRetries) {
                throw new Error(`Max retries reached. Could not find selector: ${selector}`);
            }
            console.log("Going to call the timeouts");
            await setTimeout(retryInterval);
            // await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

module.exports = {getFreeJobs}