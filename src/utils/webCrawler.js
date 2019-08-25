import puppeteer from "puppeteer";
import { Product } from "../resources/products/product.model";
import { connect } from "./db";

const searchTerms = ["coffee grinders"];

export const scrapeIt = async () => {
	try {
		console.log("Scrape initiated...");
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.goto("https://www.amazon.com", {
			waitUntil: "networkidle2"
		});

		console.log("Main Amazon page loaded...");

		await page.focus("#twotabsearchtextbox");
		await page.keyboard.type(searchTerms[0]);
		await page.click(".nav-input");
		await page.waitForNavigation({ waitUntil: "load" });

		console.log("Search for term completed...");

		let productUrls = [];

		let pageNumber = 1;
		while (pageNumber <= 3) {
			console.log(
				`scrape of search results for urls started, page: ${pageNumber}...`
			);

			let temp = await page.$$eval("div.s-result-item", elements => {
				return Array.from(elements).map(element => {
					if (element.dataset.asin) {
						let url = element.querySelector(
							"div.a-section.a-spacing-none a.a-link-normal"
						).href;
						return url;
					}
				});
			});
			productUrls.push(temp);

			pageNumber++;
			await page.click("ul.a-pagination")[pageNumber];
			await page.waitForNavigation({ waitUntil: "load" });
		}

		productUrls = productUrls.flat();
		console.log("Number of urls scraped: ", productUrls.length);
		let results = [];

		async function getProductDetails(url) {
			try {
				await page.goto(url, {
					timeout: 60000,
					waitUntil: "networkidle2"
				});

				const titleElement = await page.$("#productTitle");
				const priceElement = await page.$("#priceblock_ourprice");
				const reviewElement = await page.$("#acrCustomerReviewText");
				const averageElement = await page.$("#acrPopover");
				const detailsElement = await page.$(
					"#productDetails_detailBullets_sections1"
				);

				if (
					!titleElement ||
					!priceElement ||
					!reviewElement ||
					!averageElement ||
					!detailsElement
				) {
					return {};
				}
				const title = await page.$eval("#productTitle", el => el.textContent);
				console.log("Gathering information for", title.trim());
				const price = await page.$eval(
					"#priceblock_ourprice",
					el => el.textContent
				);
				const numberOfReviews = await page.$eval(
					"#acrCustomerReviewText",
					el => el.textContent
				);
				const averageRating = await page.$eval(
					"#acrPopover",
					el => el.textContent
				);
				const dateFirstListed = await page.$eval(
					"#productDetails_detailBullets_sections1 tbody",
					el => el.children[el.children.length - 1].children[1].textContent
				);

				return {
					title: title.trim(),
					price: Number(price.match(/\d+[.]\d+/g)[0]),
					numberOfReviews: Number(numberOfReviews.match(/\d+/g)[0]),
					averageRating: Number(averageRating.split(" ")[0]),
					dateFirstListed: dateFirstListed.trim()
				};
			} catch (err) {
				console.error("THAT IS AN ERROR: ", err.toString());
				debugger;
				page.close();
				browser.close();
				return err.toString();
			}
		}

		for (let i = 0; i < productUrls.length; i++) {
			let url = productUrls[i];
			let prod = null;
			if (url) {
				prod = await getProductDetails(url);
				results.push(prod);
			}
		}

		console.log(
			"Results have been gathered, number of results: ",
			results.length
		);

		await connect();
		const persisted = await Product.create(results.flat());
		console.log(`Scrape completed, ${persisted.length} items saved to db.`);

		await browser.close();
	} catch (err) {
		console.error(err.toString());
	}
};

scrapeIt();
