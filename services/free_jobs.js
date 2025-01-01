require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss.l) :label' 
} );
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const {setTimeout} = require("node:timers/promises");
const { url } = require('node:inspector');
puppeteer.use(StealthPlugin());

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

    await waitForSelectorWithRetry(page, url,".jobs-search__results-list", 60000, 5);

    await autoScroll(page);
    // Add an additional wait time to ensure all jobs are loaded
    await setTimeout(8000);
    // const jobListings = await page.evaluate(() => {
        
    //     return Array.from(document.querySelectorAll('.base-search-card')).map(job => {
    //         const jobTitleElement = job.querySelector('h3.base-search-card__title');
    //         const jobLinkElement = job.querySelector('a.base-card__full-link');
    //         const jobCompany = job.querySelector('h4.base-search-card__subtitle');
    //         const jobTime = job.querySelector('time');
            
    //         return {
    //             title: jobTitleElement ? jobTitleElement.innerText.trim() : "NA",
    //             link: jobLinkElement ? jobLinkElement.href : null,
    //             company: jobCompany ? jobCompany.innerText.trim() : "NA",
    //             time : jobTime ? jobTime.textContent.trim() : "NA",
    //         };
    //     }).filter(job => job.title && job.link && job.company);
    // });

    const jobListings = await page.evaluate(() => {

        const extractFromLink = (link) => {
            const match = link.match(/jobs\/view\/([^\/]+)-at-([^\/]+)-/);
            if (match) {
                return {
                    title: match[1].replace(/-/g, ' '),
                    company: match[2].replace(/-/g, ' ')
                };
            }
            return { title: "NA", company: "NA" };
        };

        return Array.from(document.querySelectorAll('.base-search-card')).map(job => {
            const jobTitleElement = job.querySelector('h3.base-search-card__title');
            const jobLinkElement = job.querySelector('a.base-card__full-link');
            const jobCompany = job.querySelector('h4.base-search-card__subtitle');
            const jobTime = job.querySelector('time');
            const jobLink = jobLinkElement ? jobLinkElement.href : null;
            let title = jobTitleElement ? jobTitleElement.innerText.trim() : "NA";
            let company = jobCompany ? jobCompany.innerText.trim() : "NA";
            if (title.includes('*') || company.includes('*')) {
                const extracted = jobLink ? extractFromLink(jobLink) : { title: "NA", company: "NA" };
                title = extracted.title;
                company = extracted.company;
            }
            return {
                title,
                link: jobLink,
                company,
                time : jobTime ? jobTime.textContent.trim() : "NA",
            };
        }).filter(job => job.title && job.link && job.company && job.time);
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

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 200;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                // Stop when we've scrolled to the bottom
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

module.exports = {getFreeJobs}