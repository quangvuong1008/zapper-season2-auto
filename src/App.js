import puppeteer from "puppeteer";
import * as dappeteer from "@dasanra/dappeteer";

const ACCOUNT_NUMBER = 200;
const PASSWORD = "Vuonghy1999";
const arrPk = [

];
const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
const importWallet = async (metamaskPage, seed, password) => {
  const importLink = await metamaskPage.waitForSelector(
    ".first-time-flow button"
  );
  await importLink.click();
  const metricsOptOut = await metamaskPage.waitForSelector(
    ".metametrics-opt-in button.btn-primary"
  );
  await metricsOptOut.click();
  const seedPhraseInput = await metamaskPage.waitForSelector(
    ".first-time-flow__seedphrase input"
  );
  await seedPhraseInput.type(seed);
  const passwordInput = await metamaskPage.waitForSelector("#password");
  await passwordInput.type(password);
  const passwordConfirmInput = await metamaskPage.waitForSelector(
    "#confirm-password"
  );
  await passwordConfirmInput.type(password);
  const acceptTerms = await metamaskPage.waitForSelector(
    ".first-time-flow__terms"
  );
  await acceptTerms.click();
  const restoreButton = await metamaskPage.waitForSelector(
    ".first-time-flow__button"
  );
  await restoreButton.click();
  const doneButton = await metamaskPage.waitForSelector(".end-of-flow button");
  await doneButton.click();
  const closeSwappingButton = await metamaskPage.waitForSelector(
    ".popover-header__button"
  );
  await closeSwappingButton.click();
  // Ensure popover is closed before continue
  await metamaskPage.waitForFunction(() => {
    return document.querySelector(".popover-header__button") == null;
  });
};

const changeNetWork = async (metamaskPage, name, chainID, url) => {
  await metamaskPage.bringToFront();
  const networkSwitcher = await metamaskPage.waitForSelector(
    ".network-display"
  );
  await networkSwitcher.click();
  await metamaskPage.waitForSelector("li.dropdown-menu-item");
  const networkIndex = await metamaskPage.evaluate((network) => {
    const elements = document.querySelectorAll("li.dropdown-menu-item");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.innerText.toLowerCase().includes(network.toLowerCase())) {
        return i;
      }
    }
    return elements.length - 1;
  }, "Custom RPC");
  const networkButton = (await metamaskPage.$$("li.dropdown-menu-item"))[
    networkIndex
  ];
  await networkButton.click();
  const newRPCName = await metamaskPage.waitForSelector("input#network-name");
  await newRPCName.type(name);
  const newRPCChainID = await metamaskPage.waitForSelector("input#chainId");
  await newRPCChainID.type(chainID);
  const newRPCUrl = await metamaskPage.waitForSelector("input#rpc-url");
  await newRPCUrl.type(url);
  const saveButton = await metamaskPage.waitForSelector(
    ".network-form__footer .button.btn-secondary"
  );
  await saveButton.click();
  const prevButton = await metamaskPage.waitForSelector(
    "img.app-header__metafox-logo"
  );
  await prevButton.click();
  await sleep(200);
};
async function unlock(metamaskPage, password) {
  try {
    await metamaskPage.bringToFront();
    const passwordBox = await metamaskPage.waitForSelector("#password");
    await passwordBox.type(password);
    const login = await metamaskPage.waitForSelector(".unlock-page button");
    await login.click();
    await waitForUnlockedScreen(metamaskPage);
  } catch (e) {}
}

const confirmTransaction = async (metamaskPage, options) => {
  await metamaskPage.bringToFront();
  // if (!signedIn) {
  //     throw new Error("You haven't signed in yet");
  // }
  await metamaskPage.reload();
  if (options === null || options === void 0 ? void 0 : options.gas) {
    const gasSelector = ".advanced-gas-inputs__gas-edit-row:nth-child(1) input";
    const gas = await metamaskPage.waitForSelector(gasSelector);
    await metamaskPage.evaluate(
      () =>
        (document.querySelectorAll(
          ".advanced-gas-inputs__gas-edit-row:nth-child(1) input"
        )[0].value = "")
    );
    await gas.type(options.gas.toString());
  }
  if (options === null || options === void 0 ? void 0 : options.gasLimit) {
    const gasLimitSelector =
      ".advanced-gas-inputs__gas-edit-row:nth-child(2) input";
    const gasLimit = await metamaskPage.waitForSelector(gasLimitSelector);
    await metamaskPage.evaluate(
      () =>
        (document.querySelectorAll(
          ".advanced-gas-inputs__gas-edit-row:nth-child(2) input"
        )[0].value = "")
    );
    await gasLimit.type(options.gasLimit.toString());
  }
  const confirmButtonSelector =
    "#app-content > div > div.main-container-wrapper > div > div > div.page-container__footer > footer > button.button.btn-primary.page-container__footer-button";
  const confirmButton = await metamaskPage.waitForSelector(
    confirmButtonSelector
  );
  await confirmButton.click();
  await waitForUnlockedScreen(metamaskPage);
};
async function createNewAccount(metamaskPage, number) {
  for (let i = 0; i < number; i++) {
    const createBtn = await metamaskPage.waitForSelector(".identicon");
    await createBtn.click();
    await sleep(500);
    const createSecondBtn = await metamaskPage.waitForSelector(
      ".account-menu__item.account-menu__item--clickable"
    );
    await createSecondBtn.click();
    await sleep(200);
    const createThirdBtn = await metamaskPage.waitForSelector(".btn-secondary");
    await createThirdBtn.click();
    await sleep(500);
  }
}
const connectAllAccount = async (metamask) => {
  await confirmTransaction(metamask);
  await sleep(200);
  const clickAll = await metamaskPage.waitForSelector(
    ".check-box.permissions-connect-choose-account__header-check-box.fa.fa-minus-square.check-box__indeterminate"
  );
  await clickAll.click();
  await sleep(200);
  const nextBtn = await metamaskPage.waitForSelector(
    ".permissions-connect-choose-account__bottom-buttons button.btn-primary"
  );
  await nextBtn.click();
  await sleep(200);
  const confirm = await metamaskPage.waitForSelector(
    ".button.btn-primary.page-container__footer-button"
  );
  await confirm.click();
  await sleep(200);
  const metaBtn = await metamaskPage.waitForSelector(
    ".bn-onboard-custom.bn-onboard-icon-button.svelte-1799bj2.bn-onboard-selected-wallet"
  );
  await metaBtn.click();
  await sleep(200);
};

async function sign(metamaskPage) {
  await metamaskPage.bringToFront();
  await metamaskPage.reload();
  const confirmButtonSelector =
    ".request-signature__footer .request-signature__footer__sign-button";
  await sleep(200);
  const button = await metamaskPage.waitForSelector(confirmButtonSelector);
  await button.click();
}
const switchAccount = async (metamaskPage, accountNumber) => {
  await metamaskPage.bringToFront();
  const accountSwitcher = await metamaskPage.waitForSelector(".identicon");
  await accountSwitcher.click();
  const account = await metamaskPage.waitForSelector(
    `.account-menu__accounts > div:nth-child(${accountNumber})`
  );
  await account.click();
};
async function autoClaim(browser, metamaskPage, i) {
  const page = await browser.newPage();
  try {
    await switchAccount(metamaskPage, i);
    await page.goto("https://zapper.fi/quests");

    await page.bringToFront();

    // Close pop up
    await sleep(2000);
    const xBtn = await page.$(".transaction-modal_close-button-container");
    console.log(" await sleep(5000);", xBtn);
    if (xBtn) await xBtn.click();
    // Change account
    await page.evaluate(() => {
      document
        .querySelector(".dropdown.dropdown_account .dropdown_account_header")
        .click();
    });
    // const listBtn = await page.$('.dropdown.dropdown_account .dropdown_account_header');
    // await listBtn.click();
    console.log("sleep");
    await sleep(200);

    const switchBtn = await page.$(".account_link.manage");
    await switchBtn.click();
    await sleep(200);

    const metaBtn = await page.$(
      ".bn-onboard-custom.bn-onboard-icon-button.svelte-1799bj2.bn-onboard-selected-wallet"
    );
    await metaBtn.click();
    await sleep(2000);

    // Check claim
    const isClaimable = await page.evaluate(() => {
      const claimBtn = document.querySelector(
        ".button.button-main.button-full"
      );
      return !claimBtn?.disabled;
    });
    console.log(isClaimable);
    await sleep(200);

    if (isClaimable) {
      console.log("CLAIMING");
      await page.bringToFront();
      const claimBtn = await page.$(".button.button-main.button-full");
      await sleep(200);
      await claimBtn.click();
      await sleep(2000);
      await sign(metamaskPage);
      console.log("DONE SIGN");
      await sleep(200);
      await page.bringToFront();
      console.log("BRING TO FRONT SIGN");
      await sleep(2000);
    }
    // log out
  } catch (e) {
    console.log(e);
    await sleep(3000);
  }
  await page.close();
}
async function init() {
  const browser = await dappeteer.launch(puppeteer, { userDataDir: "./data" });
  const metamask = await dappeteer.getMetamask(browser);
  await sleep(11001010101);
}
async function importPK(metamaskPage, pk) {
  try {
    await metamaskPage.bringToFront();
    const accountSwitcher = await metamaskPage.waitForSelector(".identicon");
    await accountSwitcher.click();
    const addAccount = await metamaskPage.waitForSelector(
      ".account-menu > div:nth-child(7)"
    );
    await addAccount.click();
    const PKInput = await metamaskPage.waitForSelector("input#private-key-box");
    await PKInput.type(pk);
    const importButton = await metamaskPage.waitForSelector(
      "button.btn-secondary"
    );
    await importButton.click();
  } catch (e) {}
}
async function main(type) {
  const browser = await dappeteer.launch(puppeteer, { userDataDir: "./data" });
  const metamask = await dappeteer.getMetamask(browser);

  await unlock(metamask, PASSWORD);
  if (type == 1) {
    await createNewAccount(metamask, ACCOUNT_NUMBER);
    await sleep(200);
    // await changeNetWork(metamask, 'Polygon', '137', 'https://polygon-rpc.com');
    const page = await browser.newPage();
    await page.goto("https://zapper.fi/quests");
    await connectAllAccount(metamask);
  } else if (type == 2) {
    await sleep(200);
    for (let i = 0; i < arrPk.length; i++) {
      await importPK(metamask, arrPk[i]);
    }
    const page = await browser.newPage();
    // await changeNetWork(metamask, 'Polygon', '137', 'https://polygon-rpc.com');
    await page.goto("https://zapper.fi/quests");
    await connectAllAccount(metamask);
  } else {
    for (let i = 1; i <= ACCOUNT_NUMBER; i++) {
      await autoClaim(browser, metamask, i);
    }
  }
}

const type = 3;
// 1 : auto create acc
// 2 : auto import by pk
// 3: run claim
// init();
main(type).catch((e) => {
  console.log(e);
  sleep(20);
});
