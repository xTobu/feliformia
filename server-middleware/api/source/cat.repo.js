import { table } from "../lib/airtable";

export const List = async () => {
  const selector = table.cat.select({
    view: "Grid view",
    filterByFormula: "AND(adopted='')", // 過濾出: 尚未被領養的貓
  });
  const records = await selector.firstPage();
  let cats = [];
  records.forEach((record, index, array) => {
    cats.push(record.fields);
  });
  return cats;
};

export const Get = async (recordId) => {
  const record = await table.cat.find(recordId);
  return record.fields;
};
