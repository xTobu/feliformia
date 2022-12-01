import { table } from "../lib/airtable";
import { ShiftMap } from "../helper/constant";
import repoLine from "./line.repo";
import dayjs from "dayjs";

export const ListNotice = async (body) => {
  const { shift } = body;
  const selector = table.medicine.notice.select({
    view: "Grid view",
    filterByFormula: `OR(shift='both',shift='${shift}')`,
  });
  const records = await selector.firstPage();
  let result = [];
  records.forEach((record, index, array) => {
    result.push({
      ...record.fields,
    });
  });
  return result;
};

export const Get = async (body) => {
  const { date, shift } = body;

  const selector = table.medicine.main.select({
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

export const Between = async (body) => {
  const { dateStart, dateEnd } = body;
  const selector = table.medicine.main.select({
    view: "Grid view",
    maxRecords: 100,
    sort: [
      { field: "date", direction: "asc" },
      { field: "shift", direction: "asc" },
    ],
    filterByFormula: `AND(IS_AFTER(date,DATEADD('${dateStart}', -1, "days")),IS_BEFORE(date,DATEADD('${dateEnd}', 1, "days")))`,
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
  let list = [];
  const notices = await ListNotice(body);
  notices.forEach((notice, index, array) => {
    list.push({
      ...notice,
      done: false,
    });
  });

  const { date, shift } = body;
  const records = await table.medicine.main.create([
    {
      fields: {
        date,
        shift,
        cats: JSON.stringify(list),
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
    const oldData = await Get({
      date: dayjs(date).format("MM/DD/YYYY"),
      shift,
    });
    const { note: oldNote } = oldData[0];

    const updates = await table.medicine.main.update([
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

    const {
      fields: { note: newNote },
    } = updates[0];

    if (newNote != oldNote) {
      const textDate = dayjs(date).format("YYYY/MM/DD");
      const textShift = ShiftMap(shift);
      const textPush = `餵藥及特殊飲食紀錄\n---------------\n日期： ${textDate}\n班別： ${textShift}\n志工： ${
        member || ""
      }\n回報：\n${note || ""}`;
      const textSite =
        process.env.DEPLOY_SITE == "feliformia"
          ? ""
          : `[${process.env.DEPLOY_SITE}]\n`;
      await repoLine.Push({ text: textSite + textPush });
    }
  } catch (error) {
    throw error;
  }

  return "";
};
