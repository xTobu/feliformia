import { supabase } from "../lib/supabase";

const TABLE_CAT = "cats";

export const List = async () => {
  try {
    const { data, error } = await supabase.from(TABLE_CAT).select();
    if (error) {
      throw new Error(`HTTP error! status: ${error.status}`);
    }

    return data
      .sort((a, b) => a.order - b.order)
      .filter((record) => record.name)
      .map((record) => ({
        recordId: record.id,
        name: record.name,
        room: record.room,
      }));
  } catch (error) {
    console.error("Error fetching list from NocoDB:", error.message);
    throw error;
  }
};

export const Get = async (Id) => {
  try {
    const { data, error } = await supabase
      .from(TABLE_CAT)
      .select("*")
      .eq("id", Id)
      .eq("adopted", false)
      .single();
    if (error) {
      throw new Error(`HTTP error! status: ${error.status}`);
    }
    if (!data) {
      throw new Error("No data found");
    }

    return {
      recordId: data.id,
      name: data.name,
      room: data.room,
    };
  } catch (error) {
    console.error("Error fetching record from Supabase:", error.message);
    throw error;
  }
};

export default { List, Get };
