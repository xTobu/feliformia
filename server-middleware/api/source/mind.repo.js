import { table } from "../lib/airtable";

export const List = async () => {
  const selector = table.mind.select({
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
  const record = await table.mind.find(recordId);
  return record.fields;
};
