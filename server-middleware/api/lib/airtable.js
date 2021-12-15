import airtable from "airtable";

const client = new airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = {
  cat: client.base(process.env.AIRTABLE_BASEID_CAT),
  regular: client.base(process.env.AIRTABLE_BASEID_REGULAR),
  volunteer: client.base(process.env.AIRTABLE_BASEID_VOLUNTEER),
  medicine: client.base(process.env.AIRTABLE_BASEID_MEDICINE),
};

export const table = {
  cat: base.cat("main"),
  regular: base.regular("main"),
  volunteer: base.volunteer("main"),
  medicine: {
    main: base.medicine("main"),
    notice: base.medicine("notice"),
  },
};
