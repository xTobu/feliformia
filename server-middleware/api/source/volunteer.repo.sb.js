import { supabase } from "../lib/supabase";

const TABLE_VOLUNTEER = "volunteers";

export const List = async () => {
  const { data, error } = await supabase.from(TABLE_VOLUNTEER).select();
  if (error) {
    throw new Error(`HTTP error! status: ${error.status}`);
  }

  return data.map((record) => ({
    recordId: record.id,
    name: record.name,
  }));
};

export const Get = async (recordId) => {
  const record = await table.volunteer.find(recordId);
  return record.fields;
};
