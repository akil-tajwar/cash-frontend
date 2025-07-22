export const formatIndianNumber = (num: number): string => {
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum < 1_000) {
    return `${sign}${absNum}`;
  } else if (absNum < 1_00_000) {
    // Thousands
    const value = absNum / 1_000;
    return `${sign}${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}K`;
  } else if (absNum < 1_00_00_000) {
    // Lakhs
    const value = absNum / 1_00_000;
    return `${sign}${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}L`;
  } else if (absNum < 1_00_00_00_000) {
    // Crores
    const value = absNum / 1_00_00_000;
    return `${sign}${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}Cr`;
  } else {
    // Arab and above
    const value = absNum / 1_00_00_00_000;
    return `${sign}${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}Ar`;
  }
};
