import { supabase } from "../lib/supabase";
import { ShiftMap } from "../helper/constant";
import repoLine from "./line.repo";
import dayjs from "dayjs";

const TABLE_NOTICE = "notices";
const TABLE_MEDICINE = "medicines";

export const ListNotice = async (body) => {
  const { shift } = body;

  const { data, error } = await supabase
    .from(TABLE_NOTICE)
    .select()
    .or(`shift.eq.both,shift.eq.${shift}`);
  if (error) {
    throw new Error(`HTTP error! status: ${error.status}`);
  }

  return data.map(({ id, ...rest }) => rest);
};

export const Get = async (body) => {
  const { date, shift } = body;

  const { data, error } = await supabase
    .from(TABLE_MEDICINE)
    .select()
    .eq("date", date)
    .eq("shift", shift);
  if (error) {
    throw new Error(`HTTP error! status: ${error.status}`);
  }

  return data.map(({ id, ...rest }) => {
    return {
      ...rest,
      recordId: id,
      cats: JSON.parse(rest.cats),
    };
  });
};

export const Between = async (body) => {
  const { dateStart, dateEnd } = body;

  const { data, error } = await supabase
    .from(TABLE_MEDICINE)
    .select()
    .gte("date", dateStart)
    .lte("date", dateEnd)
    .limit(100)
    .order("date", { ascending: true })
    .order("shift", { ascending: true });

  if (error) {
    throw new Error(`HTTP error! status: ${error.status}`);
  }

  return data.map(({ id, ...rest }) => {
    return {
      ...rest,
      recordId: id,
      cats: JSON.parse(rest.cats),
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
  const { data, error } = await supabase
    .from(TABLE_MEDICINE)
    .insert([
      {
        date,
        shift,
        cats: JSON.stringify(list),
        createdTime: dayjs().format("YYYY-MM-DD HH:mm:ss.SSS"),
      },
    ])
    .select();
  if (error) {
    throw new Error(`HTTP error! status: ${error.status}`);
  }

  return {
    ...data[0],
    recordId: data[0].id,
    cats: JSON.parse(data[0].cats),
  };
};

export const Update = async (body) => {
  const { recordId, date, shift, cats, note, member } = body;
  try {
    const oldData = await Get({
      date: dayjs(date).format("YYYY-MM-DD"),
      shift,
    });
    const { note: oldNote } = oldData[0];

    const { data, error } = await supabase.from(TABLE_MEDICINE).update({
      shift: shift,
      date: date,
      cats: JSON.stringify(cats),
      note: note,
      member: member,
      modifiedTime: dayjs().format("YYYY-MM-DD HH:mm:ss.SSS"),
    })
      .eq("id", recordId)
      .select();

    const { note: newNote } = data[0];

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
