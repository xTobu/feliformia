import { request } from "../lib/nocodb";

const TABLE_ID_MAIN = process.env.NOCODB_BASEID_CAT;

export const List = async () => {
  try {
    const where = "(adopted,eq,false)";
    const response = await request.get(
      `${TABLE_ID_MAIN}/records?where=${where}&shuffle=0&offset=0`
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = response;

    return data
      .filter((record) => record.name)
      .map((record) => ({
        Id: record.Id,
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
    const response = await request.get(`${TABLE_ID_MAIN}/records/${Id}`);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = response;
    return {
      Id: data.Id,
      name: data.name,
      room: data.room,
    };
  } catch (error) {
    console.error("Error fetching record from NocoDB:", error.message);
    throw error;
  }
};

export default { List, Get };
