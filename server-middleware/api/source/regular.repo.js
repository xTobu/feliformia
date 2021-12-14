import { table } from "../lib/airtable";
import repoCat from "./cat.repo";
import dayjs from "dayjs";

export const Get = async (body) => {
  const { date, shift } = body;

  const selector = table.regular.select({
    view: "Grid view",
    maxRecords: 1,
    filterByFormula: `AND(IS_SAME(date,'${date}'),shift='${shift}')`,
  });

  const records = await selector.firstPage();
  return records.map((record) => {
    return {
      ...record.fields,
      recordId: record.id,
      cats: JSON.parse(record.fields.cats),
    };
  });
};

// 建立一筆初始化用的記錄
export const Create = async (body) => {
  const { date, shift } = body;

  let prevShift = shift == "morning" ? "night" : "morning";
  let prevDate = dayjs(date, "MM/DD/YYYY");
  if (shift == "morning") {
    prevDate = prevDate.subtract(1, "day");
  }

  const prevRegular = await Get({
    date: prevDate.format("MM/DD/YYYY"),
    shift: prevShift,
  });

  let list = [];
  const cats = await repoCat.List();
  cats.forEach((cat, index, array) => {
    list.push({
      cat: cat,
      name: cat.name,
      feed: true,
      feed_detail: 0,
      can: false,
      can_detail: 0,
      feces: false,
      feces_warning: null,
      urine: false,
    });
  });

  const records = await table.regular.create([
    {
      fields: {
        shift,
        date,
        cats: JSON.stringify(list),
        remark: (prevRegular[0] && prevRegular[0].note) || "",
      },
    },
  ]);

  return {
    ...records[0].fields,
    recordId: records[0].id,
    cats: JSON.parse(records[0].fields.cats),
  };
};

//
export const Update = async (body) => {
  const { recordId, date, shift, cats, note, member } = body;
  try {
    await table.regular.update([
      {
        id: recordId,
        fields: {
          shift: shift,
          date: date,
          cats: JSON.stringify(cats),
          note: note,
          member: member,
        },
      },
    ]);
  } catch (error) {
    throw error;
  }

  return "";
};
