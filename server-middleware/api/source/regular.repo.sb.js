import { supabase } from "../lib/supabase";
import { ShiftMap } from "../helper/constant";
import repoCat from "./cat.repo.sb";
import repoLine from "./line.repo";
import dayjs from "dayjs";

const TABLE_REGULAR = "regulars";

export const Get = async (body) => {
  const { date, shift } = body;
  const { data, error } = await supabase
    .from(TABLE_REGULAR)
    .select()
    .eq("date", date)
    .eq("shift", shift)
    .order("createdTime", { ascending: true })
    .limit(1);

  if (error) {
    throw new Error(`get regular error! error: ${JSON.stringify(error)}`);
  }
  if (data.length === 0) {
    return null;
  }

  return {
    ...data[0],
    recordId: data[0].id,
    cats: JSON.parse(data[0].cats),
  };
};

export const Between = async (body) => {
  const { dateStart, dateEnd } = body;

  const { data, error } = await supabase
    .from(TABLE_REGULAR)
    .select()
    .gte("date", dateStart)
    .lte("date", dateEnd)
    .limit(100)
    .order("date", { ascending: true })
    .order("shift", { ascending: true });

  if (error) {
    throw new Error(`between regular error! error: ${JSON.stringify(error)}`);
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

  const { date, shift } = body;
  const { data, error } = await supabase
    .from(TABLE_REGULAR)
    .insert([
      {
        date,
        shift,
        cats: JSON.stringify(list),
        createdTime: dayjs().format("YYYY-MM-DD HH:mm:ss.SSS"),
      },
    ])
    .select()
    .limit(1);

  // duplicate key error
  if (error && error.code == "23505") {
    const regular = await Get({ date, shift });
    return regular;
  }

  if (error) {
    throw new Error(`create regular error! error: ${JSON.stringify(error)}`);
  }

  return {
    ...data[0],
    recordId: data[0].id,
    cats: JSON.parse(data[0].cats),
  };
};

// 更新資料
export const Update = async (body) => {
  const { recordId, date, shift, cats, note, member } = body;
  try {
    const { note: oldNote } = await Get({
      date: dayjs(date).format("YYYY-MM-DD"),
      shift,
    });

    const { data, error } = await supabase
      .from(TABLE_REGULAR)
      .update({
        shift: shift,
        date: date,
        cats: JSON.stringify(cats),
        note: note,
        member: member,
        modifiedTime: dayjs().format("YYYY-MM-DD HH:mm:ss.SSS"),
      })
      .eq("id", recordId)
      .select();

    if (error) {
      throw new Error(`update regular error! error: ${JSON.stringify(error)}`);
    }

    const { note: newNote } = data[0];
    return;

    if (newNote != oldNote) {
      const textDate = dayjs(date).format("YYYY/MM/DD");
      const textShift = ShiftMap(shift);
      const textPush = `飲食及如廁紀錄\n------------\n日期： ${textDate}\n班別： ${textShift}\n志工： ${
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
