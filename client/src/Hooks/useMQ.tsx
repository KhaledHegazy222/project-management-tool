import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
const useMQ = () => {
  const theme = useTheme();
  const matchesXLarge = useMediaQuery(theme.breakpoints.up("xl"));
  const matchesLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const matchesMedium = useMediaQuery(theme.breakpoints.up("md"));
  const matchesSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const matchesXSmall = useMediaQuery(theme.breakpoints.up("xs"));

  return {
    matchesXLarge,
    matchesLarge,
    matchesMedium,
    matchesSmall,
    matchesXSmall,
  };
};

export default useMQ;
