export const ShiftMap = (shift) => {
  const map = {
    morning: "早班",
    night: "晚班",
    早班: "morning",
    晚班: "night",
  };
  return map[shift];
};

export default {
  ShiftMap,
};
