import { table } from "../lib/airtable";
import { supabase } from "../lib/supabase";

const TABLE_MIND = "minds";

export const List = async () => {
  const { data, error } = await supabase.from(TABLE_MIND).select().eq("active", true);
  if (error) {
    throw new Error(`HTTP error! status: ${error.status}`);
  }

  return data.map((record) => ({
    recordId: record.id,
    note: record.note,
  }));
};

export const Get = async (recordId) => {
  const { data, error } = await supabase.from(TABLE_MIND).select().eq("active", true).eq("id", recordId);
  if (error) {
    throw new Error(`HTTP error! status: ${error.status}`);
  }

  return data.map((record) => ({
    recordId: record.id,
    note: record.note,
  }));
};
