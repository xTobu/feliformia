import { table } from "../lib/airtable";

export const Get = async () => {
  const selector = table.cat.select({
    view: "Grid view",
    maxRecords: 1,
    filterByFormula: "AND(IS_SAME(date,'12/01/2021'),shift='morning')", // 過濾出: 尚未被領養的貓
  });
  const records = await selector.firstPage();
  let cats = [];
  records.forEach((record, index, array) => {
    cats.push(record.fields);
  });
  return cats;
};
