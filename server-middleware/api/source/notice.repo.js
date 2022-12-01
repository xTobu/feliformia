import { table } from "../lib/airtable";

export const List = async () => {
  console.log(table.notice.select);
  const selector = table.notice.select({
    view: "Grid view",
    filterByFormula: "AND(active!='')",
  });
  const records = await selector.firstPage();
  let list = [];
  records.forEach((record, index, array) => {
    list.push({
      recordId: record.id,
      ...record.fields,
    });
  });
  return list;
};

export const Get = async (recordId) => {
  const record = await table.notice.find(recordId);
  return record.fields;
};
