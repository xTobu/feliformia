import airtable from "airtable";

const client = new airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
});
const baseCat = client.base("app9wqMBPNfQowcAP");
const table = baseCat("main");
const selector = table.select({ view: "Grid view" });

export const getCats = async () => {
  const records = await selector.firstPage();
  let cats = [];
  records.forEach((record, index, array) => {
    const cat = record.fields;
    if (!cat.adopted) {
      cats.push(cat);
    }
  });
  return cats;
};
