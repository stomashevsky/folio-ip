import { connect, waitForPageLoad } from "@/client.js";

async function main() {
  const client = await connect();
  const page = await client.page("openai", { viewport: { width: 1440, height: 900 } });

  await page.goto("https://platform.openai.com/audio/realtime/edit");
  await waitForPageLoad(page);
  await page.waitForTimeout(4000);

  console.log({ title: await page.title(), url: page.url() });
  await page.screenshot({ path: "tmp/openai-page.png" });

  await client.disconnect();
}

main();
